import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const DEFAULT_INPUT = '/Users/oliver/Documents/SEO｜GEO/P1-案例库素材投放区'
const INPUT_DIR = process.argv[2] || DEFAULT_INPUT
const DATA_OUT = 'src/data/cases.generated.ts'
const PUBLIC_CASES_DIR = 'public/cases'
const CASE_INDEX_OUT = join(PUBLIC_CASES_DIR, 'cases.json')
const TODAY = new Date().toISOString().slice(0, 10)
const MAX_SHOT_ROWS = 10

function readText(path) {
  return readFileSync(path, 'utf8').replace(/^\uFEFF/, '')
}

function fileExists(path) {
  return existsSync(path) && statSync(path).isFile()
}

function dirExists(path) {
  return existsSync(path) && statSync(path).isDirectory()
}

function shortHash(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 8)
}

function slugify(text) {
  const ascii = text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return ascii.length >= 3 ? ascii : `case-${shortHash(text)}`
}

function truncate(text, max) {
  const compact = String(text || '').replace(/\s+/g, ' ').trim()
  return compact.length > max ? `${compact.slice(0, max - 1)}…` : compact
}

function stripMarkdown(line) {
  // 反复剥离行首的标题/引用/列表标记，才能吃掉缩进的嵌套子列表（如 "  - **对比分析**"），
  // 否则会漏出 "- -" 双短横。
  let s = line.replace(/\r/g, '').replace(/^\s+/, '')
  let prev
  do {
    prev = s
    s = s
      .replace(/^#{1,6}\s+/, '')
      .replace(/^>\s?/, '')
      .replace(/^[-*+]\s+/, '')
      .replace(/^\d+[.)]\s+/, '')
      .replace(/^\s+/, '')
  } while (s !== prev)
  return s.replace(/\*\*/g, '').replace(/`/g, '').trim()
}

function truncateSentence(text, max) {
  const compact = String(text || '').replace(/\s+/g, ' ').trim()
  if (compact.length <= max) return compact
  const head = compact.slice(0, max)
  const lastPunct = Math.max(
    head.lastIndexOf('。'),
    head.lastIndexOf('！'),
    head.lastIndexOf('？'),
  )
  if (lastPunct >= max * 0.5) return head.slice(0, lastPunct + 1)
  return `${head.slice(0, max - 1)}…`
}

// 从 analysis.md 抽取已声明的权威总数（镜头/场景/时长），作为头部指标的首选来源，
// 避免与 breakdown.csv（可能是节选）自相矛盾。
function extractStatedTotals(text) {
  const shotMatch = text.match(/([\d,]{2,})\s*个?\s*镜头(?!时长)/)
  const sceneMatch = text.match(/([\d,]+)\s*个?\s*场景/)
  const minMatch = text.match(/([\d.]+)\s*分钟/)
  const shots = shotMatch ? Number(shotMatch[1].replace(/,/g, '')) : NaN
  const scenes = sceneMatch ? Number(sceneMatch[1].replace(/,/g, '')) : NaN
  return {
    shots: Number.isFinite(shots) ? shots : null,
    scenes: Number.isFinite(scenes) ? scenes : null,
    durationLabel: minMatch ? `${minMatch[1]} 分钟` : '',
  }
}

function mdCell(value) {
  return String(value || '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim()
}

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
  const headers = parseCsvLine(lines[0]).map((h) => h.replace(/^\uFEFF/, ''))
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))
  })
}

function countBy(rows, key) {
  const counts = new Map()
  for (const row of rows) {
    const value = String(row[key] || '').trim()
    if (!value) continue
    counts.set(value, (counts.get(value) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return mins > 0 ? `${mins}分${String(secs).padStart(2, '0')}秒` : `${secs}秒`
}

function findCaseDirs(inputDir) {
  if (!dirExists(inputDir)) return []
  return readdirSync(inputDir)
    .filter((name) => !name.startsWith('.') && name !== 'README.md')
    .map((name) => join(inputDir, name))
    .filter((path) => dirExists(path))
}

function findFiles(dir) {
  const names = readdirSync(dir)
  const analysis = join(dir, 'analysis.md')
  const breakdown = join(dir, 'breakdown.csv')
  const script = names.find((name) => name.endsWith('+拉片.md')) ||
    names.find((name) => name.endsWith('.md') && name !== 'analysis.md' && name !== 'README.md')

  return {
    title: basename(dir),
    analysis: fileExists(analysis) ? analysis : null,
    breakdown: fileExists(breakdown) ? breakdown : null,
    script: script ? join(dir, script) : null,
  }
}

function extractSummary(analysisText, title) {
  // 逐行清洗后取第一条成句的行，而不是把整段无空行的列表压成一行，避免 run-on 摘要。
  const candidate = analysisText
    .split(/\r?\n/)
    .map(stripMarkdown)
    .find((line) => line && !line.startsWith('---') && line.length >= 24)
  return truncateSentence(
    candidate || `${title} 的 AI 拉片案例，公开叙事结构、节奏数据、情绪/切镜统计和分镜表摘要，不公开完整剧本正文。`,
    150,
  )
}

function extractStructure(analysisText, rows) {
  const seen = new Set()
  const candidates = analysisText
    .split(/\r?\n/)
    .map(stripMarkdown)
    .filter((line) => line.length >= 12 && line.length <= 120)
    .filter((line) => /(钩子|冲突|高潮|反转|情绪|节奏|场景|人物|叙事|开场|结尾)/.test(line))
    // 跳过纯统计枚举行，避免与"核心数据"重复
    .filter((line) => !/(镜头总数|场景总数|平均镜头时长)/.test(line))
    .filter((line) => (seen.has(line) ? false : seen.add(line)))
    .slice(0, 6)

  if (candidates.length >= 3) return candidates

  const narrativeTop = countBy(rows, '叙事功能').slice(0, 4).map(([name, count]) => `${name}：${count} 个镜头`)
  if (narrativeTop.length) return narrativeTop

  return [
    '开场建立人物处境与核心冲突。',
    '中段通过连续镜头推进压力、误会或对抗。',
    '结尾释放阶段性结果，并为下一段剧情留下悬念。',
  ]
}

// 判断 breakdown.csv 是否只是节选样本：analysis.md 声明的镜头总数远大于 CSV 实际行数时为真。
function isSampleBreakdown(rows, analysisText) {
  const stated = extractStatedTotals(analysisText)
  return Boolean(stated.shots && rows.length && rows.length < stated.shots * 0.9)
}

function buildMetrics(rows, analysisText) {
  const stated = extractStatedTotals(analysisText)
  const sample = isSampleBreakdown(rows, analysisText)
  const csvShots = rows.length
  const csvDuration = rows.reduce((sum, row) => {
    const value = Number.parseFloat(row['时长(s)'] || row['时长'] || '')
    return Number.isFinite(value) ? sum + value : sum
  }, 0)
  const csvScenes = new Set(rows.map((row) => row['场景ID']).filter(Boolean)).size
  const emotionTop = countBy(rows, '宏情绪')[0] || countBy(rows, '情绪')[0]
  const narrativeTop = countBy(rows, '叙事功能')[0]

  const metrics = []
  // 头部总量优先采信 analysis.md 的权威声明，避免与节选 CSV 打架。
  if (stated.shots) metrics.push({ label: '镜头数', value: String(stated.shots), note: '来自 analysis.md' })
  else if (csvShots) metrics.push({ label: '镜头数', value: String(csvShots), note: '来自 breakdown.csv' })

  if (stated.durationLabel) metrics.push({ label: '视频时长', value: stated.durationLabel, note: '来自 analysis.md' })
  else if (csvDuration) metrics.push({ label: '视频时长', value: formatDuration(csvDuration), note: sample ? '样本镜头汇总' : '按镜头时长汇总' })

  if (stated.scenes) metrics.push({ label: '场景数', value: String(stated.scenes), note: '来自 analysis.md' })
  else if (csvScenes) metrics.push({ label: '场景数', value: String(csvScenes), note: '按场景ID去重' })

  // 情绪/叙事分布来自现有分镜行；只有在数据完整（非节选）时才作为头部指标，
  // 否则会用少量样本冒充全集分布。
  if (!sample && emotionTop) metrics.push({ label: '主要情绪', value: emotionTop[0], note: `${emotionTop[1]} 个镜头` })
  if (!sample && narrativeTop) metrics.push({ label: '最高频叙事功能', value: narrativeTop[0], note: `${narrativeTop[1]} 个镜头` })

  return metrics.length ? metrics : [{ label: '公开内容', value: '结构摘要', note: '等待 breakdown.csv 补充量化指标' }]
}

function sampleShotRows(rows) {
  if (!rows.length) return []
  const step = Math.max(1, Math.floor(rows.length / MAX_SHOT_ROWS))
  const sampled = []
  for (let i = 0; i < rows.length && sampled.length < MAX_SHOT_ROWS; i += step) {
    const row = rows[i]
    sampled.push({
      shot: row['镜头号'] || String(i + 1),
      time: [row['起始时间'], row['结束时间']].filter(Boolean).join(' → ') || '—',
      scene: row['场景地点'] || row['场景ID'] || '未标注',
      visual: truncate(row['画面描述'], 72),
      emotion: row['宏情绪'] || row['情绪'] || '—',
      narrative: truncate(row['叙事功能'], 36),
    })
  }
  return sampled
}

function buildMethodology(rows, analysisText) {
  const methodology = []
  const shotCount = rows.length
  const sample = isSampleBreakdown(rows, analysisText)
  const basis = sample ? '（基于公开分镜样本）' : ''
  const narrativeTop = countBy(rows, '叙事功能').slice(0, 3)
  const emotionTop = countBy(rows, '宏情绪').slice(0, 3)

  if (shotCount) methodology.push(`本案例公开 ${Math.min(shotCount, MAX_SHOT_ROWS)} 条分镜摘要样本，用于观察节奏和叙事功能分布。`)
  if (narrativeTop.length) methodology.push(`高频叙事功能${basis}集中在：${narrativeTop.map(([name, count]) => `${name}（${count}）`).join('、')}。`)
  if (emotionTop.length) methodology.push(`宏情绪分布${basis}以 ${emotionTop.map(([name, count]) => `${name}（${count}）`).join('、')} 为主。`)
  if (/钩子|冲突|高潮|反转/.test(analysisText)) methodology.push('叙事观察来自 analysis.md，并在公开页中删除成段台词和完整剧本正文。')

  return methodology.length ? methodology : ['公开页保留结构化分析，不发布完整剧本正文；后续可随素材补充分镜数据和情绪统计。']
}

function buildMarkdown(item) {
  return `# ${item.title}

> ${item.summary}

## 核心数据

${item.metrics.map((m) => `- ${m.label}: ${m.value}${m.note ? `（${m.note}）` : ''}`).join('\n')}

## 叙事结构摘要

${item.structure.map((line) => `- ${line}`).join('\n')}

## 分镜表摘要

| 镜头 | 时间 | 场景 | 画面摘要 | 情绪 | 叙事功能 |
|---|---|---|---|---|---|
${item.shotRows.map((row) => `| ${mdCell(row.shot)} | ${mdCell(row.time)} | ${mdCell(row.scene)} | ${mdCell(row.visual)} | ${mdCell(row.emotion)} | ${mdCell(row.narrative)} |`).join('\n')}

## 方法论观察

${item.methodology.map((line) => `- ${line}`).join('\n')}

## 版权边界

本页由积米律动 pipeline 自动生成并裁剪。公开页只保留结构化分析和摘要，不发布完整剧本正文，不发布成段台词。
`
}

function buildCase(dir) {
  const files = findFiles(dir)
  const analysisText = files.analysis ? readText(files.analysis) : ''
  const rows = files.breakdown ? parseCsv(readText(files.breakdown)) : []
  const sourceTitle = files.title
  const slug = slugify(sourceTitle)
  const sourceFiles = [
    files.script && basename(files.script),
    files.analysis && 'analysis.md',
    files.breakdown && 'breakdown.csv',
  ].filter(Boolean)

  const item = {
    slug,
    title: `${sourceTitle}｜AI 拉片案例`,
    sourceTitle,
    summary: extractSummary(analysisText, sourceTitle),
    publishedAt: TODAY,
    updatedAt: TODAY,
    durationLabel: formatDuration(rows.reduce((sum, row) => {
      const value = Number.parseFloat(row['时长(s)'] || '')
      return Number.isFinite(value) ? sum + value : sum
    }, 0)),
    sourceFiles,
    metrics: buildMetrics(rows, analysisText),
    structure: extractStructure(analysisText, rows),
    methodology: buildMethodology(rows, analysisText),
    shotRows: sampleShotRows(rows),
    markdownPath: `/cases/${slug}.md`,
  }

  return item
}

function cleanPublicCases() {
  mkdirSync(PUBLIC_CASES_DIR, { recursive: true })
  for (const name of readdirSync(PUBLIC_CASES_DIR)) {
    if (name.endsWith('.md')) rmSync(join(PUBLIC_CASES_DIR, name))
  }
}

const caseDirs = findCaseDirs(INPUT_DIR)
const cases = caseDirs.map(buildCase).sort((a, b) => a.sourceTitle.localeCompare(b.sourceTitle, 'zh-CN'))

cleanPublicCases()
for (const item of cases) {
  writeFileSync(join(PUBLIC_CASES_DIR, `${item.slug}.md`), buildMarkdown(item), 'utf8')
}

writeFileSync(
  DATA_OUT,
  `import type { CaseStudy } from './caseTypes'\n\nexport const generatedCases = ${JSON.stringify(cases, null, 2)} satisfies CaseStudy[]\n`,
  'utf8',
)
writeFileSync(CASE_INDEX_OUT, `${JSON.stringify(cases.map(({ slug, title, updatedAt }) => ({ slug, title, updatedAt })), null, 2)}\n`, 'utf8')

console.log(`Cases generated: ${cases.length}`)
if (!caseDirs.length) console.log(`No case folders found in ${INPUT_DIR}`)
