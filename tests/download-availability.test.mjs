import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('download page offers macOS and Windows clients', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  assert.match(page, /Kimidance-Mac-0\.3\.2-arm64\.dmg/)
  assert.match(page, /Download for macOS/)
  assert.match(page, /Download for Windows/)
  assert.doesNotMatch(page, /Kimidance-Windows-0\.1\.0-x64\.msi/)
  // Shipped HTML exposes both download entries.
  assert.match(built, /Kimidance-Mac-0\.3\.2-arm64\.dmg/)
  assert.match(built, /Kimidance-Windows-Setup-0\.2\.6-x64\.exe/)
  assert.match(built, /仍要运行/)
})
