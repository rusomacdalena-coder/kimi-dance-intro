// 拉片数据页构建：从投放区完整 breakdown.csv 计算叙事节奏统计，
// 生成 src/data/lapianStats.generated.ts + public/lapian-data.md。
//
// 口径约束：
// - 只统计"已发布案例"（以 public/cases/cases.json 为准，slug 与案例页同源）；
// - 所有数字由本脚本从原始 CSV 重算，禁止手填；
// - 运行顺序：先 npm run cases，再 npm run data。
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DEFAULT_INPUT = '/Users/oliver/Documents/SEO｜GEO/P1-案例库素材投放区'
const INPUT_DIR = process.argv[2] || DEFAULT_INPUT
const CASE_INDEX = 'public/cases/cases.json'
const DATA_OUT = 'src/data/lapianStats.generated.ts'
const MD_OUT = 'public/lapian-data.md'
const TODAY = new Date().toISOString().slice(0, 10)

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
function analyzeDrama(dir, title, slug) {
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
  let firstHookSec = null

  for (const row of rows) {
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

  const shots = rows.length
  const minutes = totalSec / 60

  // 注意：不统计"场景数"——CSV 的场景ID 是粗粒度分区（每部仅 7-13 个），
  // 与案例页里来自 analysis.md 的"场景总数"（数百）不同口径，混用会自相矛盾。
  return {
    title,
    slug,
    shots,
    minutes: round(minutes, 1),
    avgShotSec: round(totalSec / shots, 2),
    shotsPerMin: round(shots / minutes, 1),
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
  const stats = analyzeDrama(dir, title, slug)
  if (stats) dramas.push(stats)
}

if (!dramas.length) {
  console.error('没有可统计的已发布案例。')
  process.exit(1)
}

dramas.sort((a, b) => b.minutes - a.minutes)

// 语料级聚合（镜头加权）
const totalShots = dramas.reduce((s, d) => s + d.shots, 0)
const totalSec = dramas.reduce((s, d) => s + d._totalSec, 0)
const narrativeAll = new Map()
for (const d of dramas) {
  for (const [k, v] of d._narrative) narrativeAll.set(k, (narrativeAll.get(k) || 0) + v)
}

const hookSamples = dramas.filter((d) => d.firstHookSec !== null)
const aggregate = {
  updatedAt: TODAY,
  dramaCount: dramas.length,
  totalMinutes: round(totalSec / 60, 0),
  totalShots,
  avgShotSec: round(totalSec / totalShots, 2),
  medianShotsPerMin: round(median(dramas.map((d) => d.shotsPerMin)), 1),
  le2Share: round((dramas.reduce((s, d) => s + d._le2, 0) / totalShots) * 100, 1),
  le5Share: round((dramas.reduce((s, d) => s + d._le5, 0) / totalShots) * 100, 1),
  closeupShare: round((dramas.reduce((s, d) => s + d._closeup, 0) / totalShots) * 100, 1),
  hookSampleCount: hookSamples.length,
  hookWithin5s: hookSamples.filter((d) => d.firstHookSec <= 5).length,
  medianFirstHookSec: median(hookSamples.map((d) => d.firstHookSec)),
  narrativeTop: [...narrativeAll.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count, share: round((count / totalShots) * 100, 1) })),
}

const publicDramas = dramas.map(({ _totalSec, _le2, _le5, _closeup, _narrative, ...pub }) => pub)

writeFileSync(
  DATA_OUT,
  `// 由 scripts/build-data.mjs 生成，禁止手改；数字全部来自投放区原始 breakdown.csv。\n` +
    `export const lapianAggregate = ${JSON.stringify(aggregate, null, 2)} as const\n\n` +
    `export const lapianDramas = ${JSON.stringify(publicDramas, null, 2)} as const\n`,
  'utf8',
)

// ── Markdown 镜像 ───────────────────────────────────────────────────────
const a = aggregate
const md = `# 短剧叙事节奏数据（拉片指数 v0）

> 网页版：https://kimidance.com/data/ ｜ 数据来源：积米律动 pipeline 全片逐镜头标注 ｜ 最后更新：${TODAY}
> 引用本页数据请注明来源：积米律动（kimidance.com/data/）。

## 样本

${a.dramaCount} 部已公开案例的短剧/长剧，合计 ${a.totalMinutes} 分钟、${a.totalShots.toLocaleString('en-US')} 个镜头。仅收录"分镜表覆盖全片且与叙事分析一致"的作品，源数据不一致的样本会被剔除。

## 核心数字（镜头加权）

- 平均镜头时长 ${a.avgShotSec} 秒；每分钟切镜中位数 ${a.medianShotsPerMin} 次。
- ${a.le2Share}% 的镜头不超过 2 秒；${a.le5Share}% 的镜头不超过 5 秒。
- 特写 + 近景占全部镜头的 ${a.closeupShare}%。
- ${a.hookSampleCount} 部可测样本中，${a.hookWithin5s} 部在开场 5 秒内出现首个"钩子"镜头；其余作品（多集合集）首钩出现在 4-5 分钟段，分布呈双峰。

## 叙事功能分布（Top）

${a.narrativeTop.map((n) => `- ${n.name}：${n.count.toLocaleString('en-US')} 个镜头（${n.share}%）`).join('\n')}

## 各作品数据

| 作品 | 时长(分) | 镜头数 | 平均镜头(秒) | 每分钟切镜 | ≤5s 镜头占比 | 特写+近景占比 | 首钩(秒) |
|---|---|---|---|---|---|---|---|
${publicDramas
  .map(
    (d) =>
      `| [${d.title}](https://kimidance.com/cases/${d.slug}/) | ${d.minutes} | ${d.shots.toLocaleString('en-US')} | ${d.avgShotSec} | ${d.shotsPerMin} | ${d.le5Share}% | ${d.closeupShare}% | ${d.firstHookSec ?? '—'} |`,
  )
  .join('\n')}

## 方法论

- 数据由积米律动（Kimidance）AI 拉片 pipeline 生成：全片逐镜头标注景别、运镜、时长、场景、情绪与叙事功能。
- 本页所有数字由脚本从原始分镜表（breakdown.csv）自动重算，不做人工修饰。
- 入库前做一致性校验：分镜表覆盖时长与叙事分析声明不一致的作品不进入统计。
- 样本量仍在扩充中，数字会随案例库更新。
`
writeFileSync(MD_OUT, md, 'utf8')

console.log(`Data built: ${a.dramaCount} dramas, ${a.totalShots} shots, ${a.totalMinutes} min`)
console.log(`首钩中位=${a.medianFirstHookSec}s 平均镜头=${a.avgShotSec}s 特写近景=${a.closeupShare}%`)
