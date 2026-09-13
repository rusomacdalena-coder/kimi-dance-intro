import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('download page publishes the verified macOS 0.4.12 release', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  for (const content of [page, built]) {
    // exact authorized bytes: sha256 for Mac 0.4.12 (server sha256sum == /api/updates/latest, 2026-09-13)
    assert.match(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-0\.4\.12-macOS\.dmg/,
    )
    assert.match(content, /757bb76740b5c411600911a43c970358b84b8f5d20f41de5ed99649135bd2020/)
    assert.match(content, /下载 macOS 版 0\.4\.12/)
    // superseded 0.4.11 Mac artifacts must not resurface (no-backflow, 2026-09-13)
    assert.doesNotMatch(content, /Kimidance-Mac-0\.4\.11-arm64\.dmg/)
    assert.doesNotMatch(content, /c15fd3ec6c35a23ae5f86fc5d1586b5e9d118ca43444a0c1c7e42f5f3837a0e1/)
    // only the authorized 0.4.12 DMG may be served from api.kimidance.com
    assert.doesNotMatch(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/(?!Kimidance-0\.4\.12-macOS\.dmg)[^"' ]+\.dmg/,
    )
    // superseded 0.4.10 Mac artifacts must not resurface (no-backflow, 2026-09-08)
    assert.doesNotMatch(content, /Kimidance-Mac-0\.4\.10-arm64\.dmg/)
    assert.doesNotMatch(content, /f97d4ff36427db02d2d1e62fae0335473dab63f7394a69c48a70a75d6e405d0c/)
    assert.match(content, /微信扫码充值/)
    assert.doesNotMatch(content, /应用内充值即将上线/)
    assert.doesNotMatch(content, /0\.3\.2/)
    assert.doesNotMatch(content, /5d6540503e16e52f222e05ee1c4a11d935f56a4e713bd7fd4259e2716f943c03/)
    // superseded 0.4.8 Mac artifacts must not resurface on the page
    // (the plain string "0.4.8" stays legal: Windows upgrade guidance cites it)
    assert.doesNotMatch(content, /Kimidance-Mac-0\.4\.8-arm64\.dmg/)
    assert.doesNotMatch(content, /2502c7c178d6a0374d4b680d7e254bb08675ab4c6dab24dc71756913e2d453a8/)
    // only the authorized r16 installer may be served from api.kimidance.com
    assert.doesNotMatch(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/(?!Kimidance-Windows-Setup-0\.4\.11-r16-x64\.exe)[^"' ]+\.(?:exe|msi)/,
    )
  }
})

test('download page publishes the authorized Windows 0.4.11-r16 release', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  for (const content of [page, built]) {
    // exact authorized bytes: sha256 for 0.4.11/r16 (判断层 R-4c fact base, server-verified 2026-09-03)
    assert.match(content, /66735b16d67c7b42ef2514ee34e287a80cb052dd16cc7a7d5594b9d4807c6118/)
    assert.match(content, /Kimidance-Windows-Setup-0\.4\.11-r16-x64\.exe/)
    assert.match(content, /下载 Windows 版 0\.4\.11/)
    // superseded 0.4.10-r15 Windows artifacts must not resurface (no-backflow, 2026-09-08)
    assert.doesNotMatch(content, /Kimidance-Windows-Setup-0\.4\.10-r15-x64\.exe/)
    assert.doesNotMatch(content, /bc1204c181ffa5721789e0042ea28e5f0da0df3bf270fbb90335458ad3fd3d0e/)
    // sole download source: the domestic mirror (never the private source repo)
    assert.match(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Windows-Setup-0\.4\.11-r16-x64\.exe/,
    )
    // superseded 0.4.9-r14 Windows artifacts must not resurface on the page
    assert.doesNotMatch(content, /Kimidance-Windows-Setup-0\.4\.9-r14-x64\.exe/)
    assert.doesNotMatch(content, /ff4ca723c071fbbec52e29eb15fa0f90de0ec46d5cbca2c0a5a209adf60fcf10/)
    assert.doesNotMatch(content, /releases\/download\/windows-v0\.4\.8-r13/)
    assert.doesNotMatch(content, /备用下载/)
    assert.doesNotMatch(content, /github\.com\/rusomacdalena-coder\/kimidance-rs/)
    // unsigned build ships with SmartScreen guidance; never claim it is signed
    assert.match(content, /更多信息/)
    assert.match(content, /仍要运行/)
    assert.doesNotMatch(content, /Windows[^。]{0,40}已签名/)
    // WebView2 elevation caveat must stay on the page
    assert.match(content, /WebView2/)
    assert.match(content, /需要管理员权限/)
    // Upgrade guidance is split by installed version, because the in-place
    // upgrade fix was only ever verified against 0.4.8.
    //
    // The previous blanket `assert.doesNotMatch(content, /请先卸载旧版本/)` is
    // deliberately removed, not worked around: it asserted that nobody is ever
    // told to uninstall first, which is false for 0.2.x and earlier. Those
    // users were publicly served 0.1.0 / 0.2.4 / 0.2.6 builds, were covered by
    // the old generic warning, and are not covered by the fix — so the
    // uninstall-first instruction must remain on the page for them.
    assert.match(content, /已经装过 0\.4\.8 的老用户/)
    assert.match(content, /不需要先卸载/)
    assert.match(content, /0\.2\.x 或更早版本的老用户/)
    assert.match(content, /请先卸载旧版本/)
  }
})
