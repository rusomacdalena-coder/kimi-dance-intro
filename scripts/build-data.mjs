// 拉片数据页构建：从投放区完整 breakdown.csv 计算叙事节奏统计，
// 生成 src/data/lapianStats.generated.ts + public/lapian-data.md。
//
// 口径约束（判断层 2026-09-03 裁定 E）：
// - 只统计"已发布案例"（以 public/cases/cases.json 为准，slug 与案例页同源）；
// - 所有数字由本脚本从原始 CSV 重算，禁止手填；
// - 汇总只吃完整全片（inAggregate），片段单列不入汇总；汇总之下必给分型子行（真人 / AI 漫剧 / 3D 动漫）；
// - 每分钟切镜次数按各片 60 秒窗口取中位（丢掉末尾不足 60 秒的窗口，数每个窗口内起始的镜头数，全部窗口合并取中位）；
// - 类型与画幅来自 SAMPLE_META：画幅 = ffprobe 读本机源片；类型 = 公开页面 + 抽帧目检；
// - 运行顺序：先 npm run cases，再 npm run data。
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DEFAULT_INPUT = '/Users/oliver/Documents/SEO｜GEO/P1-案例库素材投放区'
const INPUT_DIR = process.argv[2] || DEFAULT_INPUT
const CASE_INDEX = 'public/cases/cases.json'
const DATA_OUT = 'src/data/lapianStats.generated.ts'
const MD_OUT = 'public/lapian-data.md'
const TODAY = new Date().toISOString().slice(0, 10)

// ── 样本分型（人工核实字段；数字部分仍全部由 CSV 重算）─────────────────
// type: 真人 / AI 漫剧 / 3D 动漫；aspect 来自 ffprobe（2026-09-03 本机源片）；
// evidence: 公开页面链接（类型依据）；inAggregate=false 的为片段，单列不入汇总。
const SAMPLE_META = {
  时光和你都很美: {
    type: '真人',
    typeBasis: '公开报道 + 抽帧',
    aspect: '竖屏 720×1280',
    inAggregate: true,
    evidence: [{ label: '搜狐报道（横店摄制真人短剧）', url: 'https://www.sohu.com/a/1037271510_532230' }],
  },
  凡人百世书: {
    type: 'AI 漫剧',
    typeBasis: '公开页面 + 抽帧',
    aspect: '横屏 1280×720',
    inAggregate: true,
    evidence: [
      { label: '短剧百科（AI漫剧）', url: 'https://www.duanjubaike.net/manju/info-7670854490097994814.html' },
      { label: '百度百科', url: 'https://baike.baidu.com/item/%E5%87%A1%E4%BA%BA%E7%99%BE%E4%B8%96%E4%B9%A6/67910935' },
    ],
  },
  '日薪一万，我在博物馆值夜班': {
    type: 'AI 漫剧',
    typeBasis: '公开页面 + 抽帧',
    aspect: '横屏 1280×720',
    inAggregate: true,
    evidence: [
      { label: '新浪（红果 AI 漫剧榜单）', url: 'https://www.sina.cn/news/detail/5298437427824619.html' },
      { label: '爱奇艺', url: 'https://www.iqiyi.com/a_cuba3wif29.html' },
    ],
  },
  '末世：从搬空全球仓库开始第一季': {
    type: '3D 动漫',
    typeBasis: '公开片库（132 集）+ 抽帧',
    aspect: '竖屏 720×1280',
    inAggregate: true,
    evidence: [],
  },
  硬核包子铺: {
    type: 'AI 漫剧',
    typeBasis: '抽帧判断（未找到公开页）',
    aspect: '竖屏 720×1280',
    inAggregate: false,
    note: '片段 21.6 分',
    evidence: [],
  },
  '大明，李景隆的别样人生': {
    type: 'AI 漫剧',
    typeBasis: '公开页面 + 抽帧',
    aspect: '横屏 1280×720',
    inAggregate: false,
    note: '片段约前 12 分 · 早期版本产出',
    evidence: [{ label: 'bilibili（标 AI短剧）', url: 'https://www.bilibili.com/video/BV1vhgf6pEz9/' }],
  },
}
const TYPE_ORDER = ['真人', 'AI 漫剧', '3D 动漫']

// ── 与 build-cases.mjs 保持一致的小工具（解析逻辑稳定，允许少量重复）──────
function parseCsvLine(line) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    const next = line[i + 1]
    if (quoted && ch === '"' && next === '"') {
      cur += '"'
      i += 1
    } else if (ch === '"') {
      quoted = !quoted
    } else if (ch === ',' && !quoted) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out.map((v) => v.trim())
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim())
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0]).map((h) => h.replace(/^﻿/, ''))
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))
  })
}

function displayTitleFromDir(name) {
  return name
    .replace(/_第?\d+(?:-\d+)?集合集$/u, '')
    .replace(/_合并_\d+集$/u, '')
    .replace(/_\d+集合集$/u, '')
    .replace(/_output$/u, '')
    .trim()
}

// ── 统计工具 ────────────────────────────────────────────────────────────
function timeToSeconds(t) {
  const m = String(t || '').match(/^(\d+):(\d{2}):(\d{2})$/)
  if (!m) return null
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])
}

function median(values) {
  const v = [...values].sort((a, b) => a - b)
  if (!v.length) return null
  const mid = Math.floor(v.length / 2)
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2
}

function round(n, digits = 1) {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

// ── 逐部统计 ────────────────────────────────────────────────────────────
function analyzeDrama(dir, title, slug, meta) {
  const csvPath = join(dir, 'breakdown.csv')
  if (!existsSync(csvPath)) return null
  const rows = parseCsv(readFileSync(csvPath, 'utf8'))
  if (!rows.length) return null

  let totalSec = 0
  let le2 = 0
  let le5 = 0
  let closeup = 0
  const narrative = new Map()
  const shotScale = new Map()
  const starts = []
  let firstHookSec = null

  for (const row of rows) {
    const start = timeToSeconds(row['起始时间'])
    starts.push(start === null ? totalSec : start)
    const dur = Number.parseFloat(row['时长(s)'] || row['时长'] || '')
    if (Number.isFinite(dur)) {
      totalSec += dur
      if (dur <= 2) le2 += 1
      if (dur <= 5) le5 += 1
    }
    const scale = String(row['景别'] || '').trim()
    if (scale) shotScale.set(scale, (shotScale.get(scale) || 0) + 1)
    if (scale === '特写' || scale === '近景') closeup += 1

    const fn = String(row['叙事功能'] || '').trim()
    if (fn) {
      narrative.set(fn, (narrative.get(fn) || 0) + 1)
      if (firstHookSec === null && fn.includes('钩子')) {
        firstHookSec = timeToSeconds(row['起始时间'])
      }
    }
  }

  // 60 秒窗口：丢掉末尾不足 60 秒的窗口，数每个窗口内起始的镜头数
  const windowCount = Math.floor(totalSec / 60)
  const windows = new Array(windowCount).fill(0)
  for (const s of starts) {
    const w = Math.floor(s / 60)
    if (w >= 0 && w < windowCount) windows[w] += 1
  }

  const shots = rows.length
  const minutes = totalSec / 60

  // 注意：不统计"场景数"——CSV 的场景ID 是粗粒度分区（每部仅 7-13 个），
  // 与案例页里来自 analysis.md 的"场景总数"（数百）不同口径，混用会自相矛盾。
  return {
    title,
    slug,
    type: meta.type,
    typeBasis: meta.typeBasis,
    aspect: meta.aspect,
    inAggregate: meta.inAggregate,
    note: meta.note || '',
    evidence: meta.evidence,
    shots,
    minutes: round(minutes, 1),
    avgShotSec: round(totalSec / shots, 2),
    shotsPerMinMedian: median(windows),
    windowCount,
    le2Share: round((le2 / shots) * 100, 1),
    le5Share: round((le5 / shots) * 100, 1),
    closeupShare: round((closeup / shots) * 100, 1),
    firstHookSec,
    narrativeTop: [...narrative.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
    shotScale: [...shotScale.entries()].sort((a, b) => b[1] - a[1]),
    _totalSec: totalSec,
    _le2: le2,
    _le5: le5,
    _closeup: closeup,
    _narrative: narrative,
    _windows: windows,
  }
}

// ── 主流程 ──────────────────────────────────────────────────────────────
if (!existsSync(CASE_INDEX)) {
  console.error(`缺少 ${CASE_INDEX}，请先运行 npm run cases`)
  process.exit(1)
}
const published = JSON.parse(readFileSync(CASE_INDEX, 'utf8'))
const slugByTitle = new Map(published.map((c) => [c.title.replace(/｜AI 拉片案例$/u, ''), c.slug]))

const dramas = []
for (const name of readdirSync(INPUT_DIR)) {
  if (name.startsWith('.') || name.startsWith('_') || name === 'README.md') continue
  const dir = join(INPUT_DIR, name)
  if (!statSync(dir).isDirectory()) continue
  const title = displayTitleFromDir(name)
  const slug = slugByTitle.get(title)
  if (!slug) {
    console.warn(`跳过（未发布为案例）: ${title}`)
    continue
  }
  const meta = SAMPLE_META[title]
  if (!meta) {
    console.error(`缺少样本分型信息（SAMPLE_META）: ${title}`)
    process.exit(1)
  }
  const stats = analyzeDrama(dir, title, slug, meta)
  if (stats) dramas.push(stats)
}

if (!dramas.length) {
  console.error('没有可统计的已发布案例。')
  process.exit(1)
}

// 全片在前、片段在后；同组内按时长降序
dramas.sort((a, b) => Number(b.inAggregate) - Number(a.inAggregate) || b.minutes - a.minutes)

function summarize(set) {
  const totalShots = set.reduce((s, d) => s + d.shots, 0)
  const totalSec = set.reduce((s, d) => s + d._totalSec, 0)
  const windows = set.flatMap((d) => d._windows)
  return {
    dramaCount: set.length,
    totalMinutes: round(totalSec / 60, 0),
    totalShots,
    avgShotSec: round(totalSec / totalShots, 2),
    medianShotsPerMin: median(windows),
    windowCount: windows.length,
    le2Share: round((set.reduce((s, d) => s + d._le2, 0) / totalShots) * 100, 1),
    le5Share: round((set.reduce((s, d) => s + d._le5, 0) / totalShots) * 100, 1),
    closeupShare: round((set.reduce((s, d) => s + d._closeup, 0) / totalShots) * 100, 1),
  }
}

const full = dramas.filter((d) => d.inAggregate)
const fragments = dramas.filter((d) => !d.inAggregate)

// 工作量事实：已标注全部样本
const annotated = summarize(dramas)

// 汇总：只吃全片
const narrativeAll = new Map()
for (const d of full) {
  for (const [k, v] of d._narrative) narrativeAll.set(k, (narrativeAll.get(k) || 0) + v)
}
const aggregate = {
  updatedAt: TODAY,
  ...summarize(full),
  narrativeTop: [...narrativeAll.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count, share: round((count / full.reduce((s, d) => s + d.shots, 0)) * 100, 1) })),
}

// 分型子行（汇总之下必给）
const typeRows = TYPE_ORDER.filter((t) => full.some((d) => d.type === t)).map((t) => {
  const set = full.filter((d) => d.type === t)
  return { type: t, titles: set.map((d) => d.title), ...summarize(set) }
})

const publicDramas = dramas.map(({ _totalSec, _le2, _le5, _closeup, _narrative, _windows, ...pub }) => pub)

writeFileSync(
  DATA_OUT,
  `// 由 scripts/build-data.mjs 生成，禁止手改；数字全部来自投放区原始 breakdown.csv。\n` +
    `export const lapianAnnotated = ${JSON.stringify(annotated, null, 2)} as const\n\n` +
    `export const lapianAggregate = ${JSON.stringify(aggregate, null, 2)} as const\n\n` +
    `export const lapianTypeRows = ${JSON.stringify(typeRows, null, 2)} as const\n\n` +
    `export const lapianDramas = ${JSON.stringify(publicDramas, null, 2)} as const\n`,
  'utf8',
)

// ── Markdown 镜像 ───────────────────────────────────────────────────────
const a = aggregate
const n = (x) => x.toLocaleString('en-US')
const typeLabel = (x) => (/^[A-Za-z0-9]/.test(x) ? ` ${x}` : x)
const typeSummary = typeRows.map((t) => `${t.dramaCount} 部${typeLabel(t.type)}`).join('、')
const evidenceText = (d) =>
  [`画幅 ffprobe`, d.typeBasis, ...d.evidence.map((e) => `[${e.label}](${e.url})`)].join('；')
const md = `# 微短剧叙事节奏数据（拉片指数 v0）

> 网页版：https://kimidance.com/data/ ｜ 数据来源：积米律动 pipeline 全片逐镜头标注 ｜ 最后更新：${TODAY}
> 引用本页数据请注明来源：积米律动（kimidance.com/data/）。

## 样本

已标注 ${annotated.dramaCount} 部微短剧 / ${annotated.totalMinutes} 分钟 / ${n(annotated.totalShots)} 个镜头（工作量事实）。统计汇总取其中 ${a.dramaCount} 部全片（${a.totalMinutes} 分钟 / ${n(a.totalShots)} 镜头）：${typeSummary}；${fragments.length} 部片段单列不入汇总。真人样本只有 1 部，本页不做真人与漫剧的比较，只列数。

## 核心数字（${a.dramaCount} 部全片，镜头加权）

- 平均镜头时长 ${a.avgShotSec} 秒；每分钟切镜中位数 ${a.medianShotsPerMin} 次（各片 60 秒窗口取中位，共 ${a.windowCount} 个窗口）。
- ${a.le2Share}% 的镜头不超过 2 秒；${a.le5Share}% 的镜头不超过 5 秒。
- 特写 + 近景占全部镜头的 ${a.closeupShare}%。
- 首个"钩子"镜头的出现时间不做汇总，逐部见下表"首钩(秒)"列。

## 汇总与分型

| 口径 | 部数 | 时长(分) | 镜头数 | 平均镜头(秒) | 每分钟切镜(60 秒窗口中位) | ≤5s 镜头占比 | 特写+近景占比 |
|---|---|---|---|---|---|---|---|
| 汇总（全片） | ${a.dramaCount} | ${a.totalMinutes} | ${n(a.totalShots)} | ${a.avgShotSec} | ${a.medianShotsPerMin} | ${a.le5Share}% | ${a.closeupShare}% |
${typeRows
  .map(
    (t) =>
      `| ${t.type}（${t.titles.join('、')}） | ${t.dramaCount} | ${t.totalMinutes} | ${n(t.totalShots)} | ${t.avgShotSec} | ${t.medianShotsPerMin} | ${t.le5Share}% | ${t.closeupShare}% |`,
  )
  .join('\n')}

## 叙事功能分布（${a.dramaCount} 部全片，Top）

${a.narrativeTop.map((x) => `- ${x.name}：${n(x.count)} 个镜头（${x.share}%）`).join('\n')}

## 各作品数据

| 作品 | 类型 | 画幅 | 时长(分) | 镜头数 | 平均镜头(秒) | 每分钟切镜(60 秒窗口中位) | ≤5s 镜头占比 | 特写+近景占比 | 首钩(秒) | 依据 |
|---|---|---|---|---|---|---|---|---|---|---|
${publicDramas
  .map(
    (d) =>
      `| [${d.title}](https://kimidance.com/cases/${d.slug}/)${d.inAggregate ? '' : `（${d.note} · 不入汇总）`} | ${d.type} | ${d.aspect} | ${d.minutes} | ${n(d.shots)} | ${d.avgShotSec} | ${d.shotsPerMinMedian ?? '—'} | ${d.le5Share}% | ${d.closeupShare}% | ${d.firstHookSec ?? '未标注'} | ${evidenceText(d)} |`,
  )
  .join('\n')}

## 方法论

- 数据由积米律动（Kimidance）AI 拉片 pipeline 生成：全片逐镜头标注景别、运镜、时长、场景、情绪与叙事功能。
- 本页所有数字由脚本从原始分镜表（breakdown.csv）自动重算，不做人工修饰。
- 汇总口径为镜头加权（不是按部平均）；只汇总完整全片，片段单列不入汇总；汇总之下按类型（真人 / AI 漫剧 / 3D 动漫）给分型子行。
- 每分钟切镜次数按各片 60 秒窗口取中位：丢掉末尾不足 60 秒的窗口，数每个窗口内起始的镜头数，全部窗口合并取中位。
- 类型与画幅依据：画幅 = ffprobe 读取本机源片分辨率；类型 = 公开页面（表中链接）+ 抽帧目检。
- 样本量仍在扩充中，数字会随案例库更新。
`
writeFileSync(MD_OUT, md, 'utf8')

console.log(`Data built: annotated ${annotated.dramaCount} dramas / ${annotated.totalShots} shots / ${annotated.totalMinutes} min; aggregate ${a.dramaCount} full / ${a.totalShots} shots / ${a.totalMinutes} min`)
console.log(`平均镜头=${a.avgShotSec}s 切镜中位=${a.medianShotsPerMin} (${a.windowCount} windows) ≤2s=${a.le2Share}% ≤5s=${a.le5Share}% 特写近景=${a.closeupShare}%`)
console.log('分型:', typeRows.map((t) => `${t.type} ${t.dramaCount} 部 ${t.totalMinutes}m/${t.totalShots} avg ${t.avgShotSec} med ${t.medianShotsPerMin} le5 ${t.le5Share} cu ${t.closeupShare}`).join(' | '))
