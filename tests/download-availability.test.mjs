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
    // only the authorized r13 installer may be served from api.kimidance.com
    assert.doesNotMatch(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/(?!Kimidance-Windows-Setup-0\.4\.9-r14-x64\.exe)[^"' ]+\.(?:exe|msi)/,
    )
  }
})

test('download page publishes the authorized Windows 0.4.9-r14 release', async () => {
  const page = await readFile(new URL('../src/pages/download.astro', import.meta.url), 'utf8')
  const built = await readFile(new URL('../docs/download/index.html', import.meta.url), 'utf8')

  for (const content of [page, built]) {
    // exact authorized bytes: _candD1 setup_sha256 for 0.4.9/r14 (five-gate green rebuild)
    assert.match(content, /ff4ca723c071fbbec52e29eb15fa0f90de0ec46d5cbca2c0a5a209adf60fcf10/)
    assert.match(content, /Kimidance-Windows-Setup-0\.4\.9-r14-x64\.exe/)
    assert.match(content, /下载 Windows 版 0\.4\.9/)
    // sole download source: the domestic mirror (never the private source repo)
    assert.match(
      content,
      /https:\/\/api\.kimidance\.com\/downloads\/Kimidance-Windows-Setup-0\.4\.9-r14-x64\.exe/,
    )
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
