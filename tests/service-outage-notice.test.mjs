import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { SERVICE_OUTAGE_NOTICE } from '../src/lib/service-outage.mjs'

const NOTICE =
  '服务暂时中断，正在紧急处理。已安装的软件可能暂时无法登录或开始任务，请稍后再试。'

function visibleText(html) {
  const bodyAt = html.indexOf('<body')
  assert.ok(bodyAt >= 0, 'page has a body')
  const body = html.slice(bodyAt)
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function noticeText(html) {
  const notice = html.match(/<p class="service-outage-notice"[^>]*>([^<]*)<\/p>/)
  assert.ok(notice, 'service outage notice element is present')
  return notice[1].trim()
}

test('用户打开积米律动官网首页，应在页面最上方看到声明：「服务暂时中断，正在紧急处理。已安装的软件可能暂时无法登录或开始任务，请稍后再试。」', async () => {
  assert.equal(SERVICE_OUTAGE_NOTICE, NOTICE)
  const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8')
  assert.equal(visibleText(html).startsWith(NOTICE), true)
  assert.equal(noticeText(html), NOTICE)
  assert.equal(html.split(NOTICE).length - 1, 1)
})

test('用户打开积米律动官网的下载页，应在页面最上方看到同一则声明。', async () => {
  const html = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')
  assert.equal(visibleText(html).startsWith(NOTICE), true)
  assert.equal(noticeText(html), NOTICE)
  assert.equal(html.split(NOTICE).length - 1, 1)
})

test('用户打开官网首页和下载页时，除了最上方多了这则声明，其余内容和登声明前一样，下载入口和现有版本说明仍在。', async () => {
  const home = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8')
  const download = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')
  const downloadSource = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')

  assert.match(home, /爆款的剧本没人会给你。那就把它变回剧本。/)
  assert.match(home, /台词不经 AI 改写。/)
  assert.match(home, /下载客户端 · Mac \/ Windows/)
  assert.match(home, /公测中 · 注册赠 100 积分 · ¥1 \/ 视频分钟 · 任务开始前先看费用预估/)

  assert.match(download, /下载积米律动客户端/)
  assert.match(download, /公测期，采用邀请码注册/)
  assert.match(
    download,
    /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-0\.4\.25-macOS\.dmg/,
  )
  assert.match(
    download,
    /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Windows-Setup-0\.4\.25-r1-x64\.exe/,
  )
  assert.match(download, /下载 macOS 版 0\.4\.25/)
  assert.match(download, /下载 Windows 版 0\.4\.25/)
  assert.match(download, /版本 0\.4\.25/)
  assert.match(download, /91017d604202c5288da4347ba7b56dee3d52c38b82916f03205c373267d4e867/)
  assert.match(download, /1b6d2073234a9419f390a3aba5123ce91d0133db321d9fb10a6f97585baa1824/)
  assert.match(download, /已经装过 0\.4\.8 的老用户/)
  assert.match(download, /不需要先卸载/)
  assert.match(download, /0\.2\.x 或更早版本的老用户/)
  assert.match(download, /请先卸载旧版本/)
  assert.match(downloadSource, /公测期，采用邀请码注册/)

  for (const html of [home, download]) {
    const text = noticeText(html)
    assert.equal(text, NOTICE)
    assert.equal(text.includes('预计'), false)
    assert.equal(text.includes('救援'), false)
    assert.equal(text.includes('搬家'), false)
  }
})
