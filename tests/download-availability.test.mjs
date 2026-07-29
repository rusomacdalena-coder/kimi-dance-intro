import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('download page publishes the verified macOS 0.4.7 release', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  for (const content of [page, built]) {
    assert.match(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Mac-0\.4\.7-arm64\.dmg/,
    )
    assert.match(content, /3c155a643d7df3f6a3d813333e977ab05cd77cacb0a4a79ea72f3f6b22343075/)
    assert.match(content, /下载 macOS 版 0\.4\.7/)
    assert.match(content, /微信扫码充值/)
    assert.doesNotMatch(content, /应用内充值即将上线/)
    assert.doesNotMatch(content, /0\.3\.2/)
    assert.doesNotMatch(content, /5d6540503e16e52f222e05ee1c4a11d935f56a4e713bd7fd4259e2716f943c03/)
    assert.doesNotMatch(content, /https:\/\/api\.kimidance\.com\/downloads\/[^"' ]+\.(?:exe|msi)/)
  }
})
