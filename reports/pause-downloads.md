# 暂停官网安装包链接

日期：2026-11-27。授权原文：「做」。本单只开审查请求，不合并 `main`。

审查请求：https://github.com/rusomacdalena-coder/kimi-dance-intro/pull/3
提交：`5355802337a2ac00a1c111c1cda606016f2cad49`

## 发布位置

2026-11-27 查询 `gh api repos/rusomacdalena-coder/kimi-dance-intro/pages`：

- `source.branch` = `main`
- `source.path` = `/docs`
- `cname` = `kimidance.com`
- `status` = `built`

仓库没有 `.github` 工作流。GitHub Pages 从 `main` 的 `/docs` 发布到 https://kimidance.com 。合并前线上不变。

## 验收三句（原文，未改）

1. 用户打开官网首页，看不到可点的「下载客户端」按钮，点导航或页脚里的「下载」也进不了能下载安装包的页面。
2. 用户打开原来的下载页地址，看不到「下载 macOS 版」和「下载 Windows 版」这两个能直接拉安装包的按钮。
3. 官网各页不再提供指向接口域名安装包的链接。

## 做了什么

- `src/components/LandingPage.tsx`：去掉首页主按钮「下载客户端 · Mac / Windows」，并去掉手机底部固定栏。导航和页脚的「下载」仍指向 `/download/`。
- `src/pages/download.astro`：去掉两个安装包按钮和 `https://api.kimidance.com/downloads/...`。页首写「客户端下载暂时关闭，服务正在修复，请稍后再试。」并保留邀请邮件 `oliverzhu929598@gmail.com`。安装指引、SHA-256、文件名仍是纯文本，不是链接。
- `src/pages/invite.astro`：去掉「下载 macOS App 0.4.25」和对应的 `.dmg` 地址。复制邀请码仍在。
- `src/pages/what-is-ai-lapian.astro`、`public/what-is-ai-lapian.md`、`public/llms-full.txt`：原来指向 `/download/` 的「下载客户端」改成「下载页」或暂停说明。这些地址仍是 https://kimidance.com/download/ ，不是安装包。
- `src/styles/global.css`：删掉只给手机底部固定栏用的 `.kd-sticky-cta`。
- 测试改为断言安装包链接不存在。`npm test`：10 条通过（2026-11-27，`node --test tests/*.test.mjs`）。

## 构建产物里的安装包链接

2026-11-27 对 `docs/` 下全部 `.html` `.js` `.txt` `.xml` `.json` `.md` `.css` `.svg` 扫描：

- 字符串 `api.kimidance.com/downloads`：0 处
- `href` 或 `src` 指向 `.dmg` 或 `.exe`：0 处
- `https://` 开头、以 `.dmg` 或 `.exe` 结尾的地址：0 处
- 「下载客户端」「下载 macOS 版」「下载 Windows 版」：0 处

`docs/download/index.html` 里仍有文件名 `Kimidance-0.4.25-macOS.dmg` 和 `Kimidance-Windows-Setup-0.4.25-r1-x64.exe`，出现在校验命令和说明文字里，没有包在 `href` 里。

本地预览 http://127.0.0.1:4321/ 、http://127.0.0.1:4321/download/ 、http://127.0.0.1:4321/invite/?code=TEST123 已打开。首页桌面和 390 宽没有「下载客户端」按钮，也没有底部固定下载栏。下载页两张系统卡片没有安装包按钮，页首是暂停说明和 `oliverzhu929598@gmail.com`。邀请页没有「下载 macOS App 0.4.25」。

## 未发布、不在构建结果里

`src/pages/data/_index.astro` 文件名以下划线开头，Astro 不构建。里面仍有指向 `/download/` 的「下载客户端」。线上 `/data/` 是跳转页 `src/pages/data/index.astro`，没有安装包链接。

`reports/` 里的旧报告仍写着历史安装包地址。`reports/` 不进 `docs/`，不会发到 https://kimidance.com 。

## 样式表哈希

去掉只被安装包按钮使用的类之后，构建样式从 `docs/_astro/_slug_.DskvkCzu.css` 换成 `docs/_astro/_slug_.DTIl23Tl.css`。案例库等页面的 HTML 只改了这一个样式文件名。颜色和字体没有改。

## 合并后线上核对（2026-11-27）

`rusomacdalena-coder` 合并了 https://github.com/rusomacdalena-coder/kimi-dance-intro/pull/3 ，合并提交 `38ad985e2aa43dfa34d4fc9c2a1fe1c7b408b0e0`。Pages 构建 `1408472903` 状态 `built`。

curl https://kimidance.com/ ：没有「下载客户端」。curl https://kimidance.com/download/ ：有暂停说明和 `oliverzhu929598@gmail.com`，没有「下载 macOS 版」「下载 Windows 版」，没有 `api.kimidance.com/downloads`。当时的 `<title>` 仍是「下载积米律动 Kimidance — macOS 与 Windows 客户端」。

## 明确没做

- 没有合并 `main`
- 没有跑 IndexNow
- 没有登录、修改或删除 `api.kimidance.com` 上的安装包
