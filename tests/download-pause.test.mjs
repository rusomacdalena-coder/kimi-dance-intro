import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import test from 'node:test'

const TEXT = new Set(['.html', '.js', '.mjs', '.txt', '.xml', '.json', '.md', '.css', '.svg'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(path)))
    else files.push(path)
  }
  return files
}

test('built site has no installer hrefs', async () => {
  const root = fileURLToPath(new URL('../docs/', import.meta.url))
  const files = await walk(root)
  const installerHref =
    /(?:href|src)\s*[:=]\s*["'][^"']*(?:api\.kimidance\.com\/downloads|\.dmg|\.exe)/i
  const installerUrl = /https?:\/\/[^\s"'<>]*?(?:api\.kimidance\.com\/downloads|\.dmg|\.exe)/i

  for (const file of files) {
    assert.equal(/\.(?:dmg|exe)$/i.test(file), false, file)
    const ext = file.slice(file.lastIndexOf('.'))
    if (!TEXT.has(ext)) continue
    const content = await readFile(file, 'utf8')
    assert.equal(content.includes('api.kimidance.com/downloads'), false, file)
    assert.equal(installerHref.test(content), false, file)
    assert.equal(installerUrl.test(content), false, file)
    assert.equal(content.includes('下载客户端'), false, file)
    assert.equal(content.includes('下载 macOS 版'), false, file)
    assert.equal(content.includes('下载 Windows 版'), false, file)
  }
})
