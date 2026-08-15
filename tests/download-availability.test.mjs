import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('download page publishes the verified macOS 0.4.8 release', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  for (const content of [page, built]) {
    assert.match(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Mac-0\.4\.8-arm64\.dmg/,
    )
    assert.match(content, /2502c7c178d6a0374d4b680d7e254bb08675ab4c6dab24dc71756913e2d453a8/)
    assert.match(content, /下载 macOS 版 0\.4\.8/)
    assert.match(content, /微信扫码充值/)
    assert.doesNotMatch(content, /应用内充值即将上线/)
    assert.doesNotMatch(content, /0\.3\.2/)
    assert.doesNotMatch(content, /5d6540503e16e52f222e05ee1c4a11d935f56a4e713bd7fd4259e2716f943c03/)
    assert.doesNotMatch(content, /https:\/\/api\.kimidance\.com\/downloads\/[^"' ]+\.(?:exe|msi)/)
  }
})

test('download page publishes the authorized Windows 0.4.8-r13 release', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  for (const content of [page, built]) {
    // exact authorized bytes: registry candidate setup_sha256 for 0.4.8/r13
    assert.match(content, /5c449a17926a433551caa653f7a89716871936ab63375537d33599948e25fc7a/)
    assert.match(content, /Kimidance-Windows-Setup-0\.4\.8-r13-x64\.exe/)
    assert.match(content, /下载 Windows 版 0\.4\.8/)
    // the asset must come from a public GitHub release, never the private source repo
    assert.match(
      content,
      /https:\/\/github\.com\/rusomacdalena-coder\/kimi-dance-intro\/releases\/download\/windows-v0\.4\.8-r13\//,
    )
    assert.doesNotMatch(content, /github\.com\/rusomacdalena-coder\/kimidance-rs/)
    // unsigned build ships with SmartScreen guidance; never claim it is signed
    assert.match(content, /更多信息/)
    assert.match(content, /仍要运行/)
    assert.doesNotMatch(content, /Windows[^。]{0,40}已签名/)
    // WebView2 elevation caveat must stay on the page
    assert.match(content, /WebView2/)
    assert.match(content, /需要管理员权限/)
  }
})
