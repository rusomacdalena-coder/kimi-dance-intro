// 向 IndexNow 提交站点 URL（Bing、博查等引擎共享同一提交端点）。
// 用法：npm run indexnow —— 在每次部署上线后执行。
import { existsSync, readFileSync } from 'node:fs'

const KEY = 'b15b7898d5a92137b49614467361d199'
const HOST = 'kimidance.com'
const caseIndexPath = 'public/cases/cases.json'

const caseUrls = existsSync(caseIndexPath)
  ? JSON.parse(readFileSync(caseIndexPath, 'utf8')).flatMap((item) => [
      `https://${HOST}/cases/${item.slug}/`,
      `https://${HOST}/cases/${item.slug}.md`,
    ])
  : []

const urls = [
  `https://${HOST}/`,
  `https://${HOST}/what-is-ai-lapian/`,
  `https://${HOST}/about/`,
  `https://${HOST}/compare/ai-lapian-tools/`,
  `https://${HOST}/guides/lapian-template/`,
  `https://${HOST}/data/`,
  `https://${HOST}/compare-ai-lapian-tools.md`,
  `https://${HOST}/lapian-template.md`,
  `https://${HOST}/lapian-data.md`,
  `https://${HOST}/llms.txt`,
  ...(caseUrls.length ? [`https://${HOST}/cases/`, ...caseUrls] : []),
]

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
})

console.log(`IndexNow: HTTP ${res.status}`)
const text = await res.text()
if (text) console.log(text)
if (res.status >= 400) process.exit(1)
