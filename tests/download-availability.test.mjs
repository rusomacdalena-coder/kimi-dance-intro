import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('download page withholds both desktop downloads', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  assert.match(page, /尽请期待/)
  assert.doesNotMatch(page, /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Mac-/)
  assert.doesNotMatch(page, /Download for macOS/)
  assert.match(page, /Windows 版即将开放/)
  assert.doesNotMatch(page, /Download for Windows/)
  assert.doesNotMatch(page, /Kimidance-Windows-0\.1\.0-x64\.msi/)
  assert.match(built, /尽请期待/)
  assert.doesNotMatch(built, /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Mac-/)
  assert.doesNotMatch(built, /Download for macOS/)
  assert.doesNotMatch(built, /Kimidance-Windows-Setup-[^"']*\.exe/)
  assert.doesNotMatch(built, /Download for Windows/)
})
