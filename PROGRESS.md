# 当前状态

- 2026-11-26：开工时仓库根目录没有 `PROGRESS.md`。本文件从这一天写起。
- 2026-11-26：服务中断声明已提交 `33f98c05ce1d1e11a357fbf030a89044e49d1203`，说明提交 `0b2f92b`，分支 `cursor/service-outage-notice-9352`，相对 `main`（`750a4fe`）。已修：本地源码和 `docs/index.html`、`docs/download/index.html`。未合并，未发版，用户未在 https://kimidance.com 或 https://kimidance.com/download/ 拿到。审查请求：https://github.com/rusomacdalena-coder/kimi-dance-intro/pull/2
- 2026-11-26：声明原文是「服务暂时中断，正在紧急处理。已安装的软件可能暂时无法登录或开始任务，请稍后再试。」出处：`src/lib/service-outage.mjs` 的 `SERVICE_OUTAGE_NOTICE`。
- 2026-11-26：`npm test` 9 条通过。本地预览 http://127.0.0.1:4321/ 与 http://127.0.0.1:4321/download/ 最上沿能看到声明。截图在审查请求说明里。线上页面未核，因为本单不发布。
- 2026-11-27：上一条「未合并」已过时。现核 `git log`：`main` 顶端是 `0e2366f9fe85c8c8bff35276cbdc0f0344a9c84b`「首页和下载页顶部加上服务中断声明」，与 `origin/main` 一致。GitHub Pages（`gh api repos/rusomacdalena-coder/kimi-dance-intro/pages`，2026-11-27）：`source.branch` = `main`，`source.path` = `/docs`，`cname` = `kimidance.com`，`status` = `built`。
- 2026-11-27：安装包链接暂停。已修：提交 `5355802337a2ac00a1c111c1cda606016f2cad49`，报告 `reports/pause-downloads.md`。未合并，未发版，用户未在 https://kimidance.com 或 https://kimidance.com/download/ 拿到。审查请求：https://github.com/rusomacdalena-coder/kimi-dance-intro/pull/3 。`npm test` 10 条通过（2026-11-27，本地 `node --test tests/*.test.mjs`）。
- 2026-11-27：上一条「未合并、未发版」已过时。`rusomacdalena-coder` 合并了审查请求 #3，合并提交 `38ad985e2aa43dfa34d4fc9c2a1fe1c7b408b0e0`。GitHub Pages 构建 `1408472903` 状态 `built`，对应提交 `38ad985`（`gh api repos/rusomacdalena-coder/kimi-dance-intro/pages/builds`，2026-11-27）。同一时刻用 curl 打开 https://kimidance.com/ ：正文没有「下载客户端」，导航和页脚「下载」仍指向 `/download/`。https://kimidance.com/download/ ：有「客户端下载暂时关闭，服务正在修复，请稍后再试。」和 `oliverzhu929598@gmail.com`，没有「下载 macOS 版」「下载 Windows 版」，也没有 `api.kimidance.com/downloads`。标题当时仍是「下载积米律动 Kimidance — macOS 与 Windows 客户端」。
- 2026-11-27：Codex 在 https://github.com/rusomacdalena-coder/kimi-dance-intro/pull/3#discussion_r4718874768 要求改下载页标题和描述。本条只记录，修复提交号待补。

# 已定决策（附理由）

- 2026-11-26：声明只登首页和下载页，不进全站顶栏。理由：三句验收只要求这两页；案例库、邀请页多一则声明就超出本单。
- 2026-11-26：两页共用 `src/lib/service-outage.mjs` 里的 `SERVICE_OUTAGE_NOTICE`，不在页面里各写一遍。理由：首页是 React，下载页是 Astro，各写一遍容易把定稿改样。
- 2026-11-26：声明样式放在 `SERVICE_OUTAGE_NOTICE_CSS`，不写进 `src/styles/global.css`。理由：写进全站样式会让 `docs/_astro/_slug_.DskvkCzu.css` 改哈希，其它页面的构建 HTML 会跟着改样式文件名。
- 2026-11-26：不写预计恢复时间，不写救援、搬家或数据是否还在。理由：本单禁改措辞。
- 2026-11-26：不合并 `main`，不跑 IndexNow，不改 CNAME。理由：发布由积米·PM 核对后自己做。
- 2026-11-27：安装包链接暂停。首页去掉「下载客户端 · Mac / Windows」，含手机底部固定栏。`/download/` 留下，正文写「客户端下载暂时关闭，服务正在修复，请稍后再试。」并保留 `oliverzhu929598@gmail.com`。导航和页脚「下载」仍指向 `/download/`。邀请页去掉指向安装包的按钮。理由：Oliver 2026-11-27 授权「做」；验收允许下载页留下暂停说明，也允许导航指向该页。
- 2026-11-27：下载页仍保留安装指引、SHA-256 和安装包文件名，这些是纯文本，不是链接。理由：验收禁止的是可点按钮和安装包 URL；已经拿到安装包的人还要能核对。
- 2026-11-27：不合并 `main`，不跑 IndexNow，不登录、不改 `api.kimidance.com`，不删除服务器上的安装包。理由：本单只开审查请求。
- 2026-11-27：下载页 `<title>`、`og:title`、`twitter:title` 和 description 改为「积米律动 Kimidance — 客户端下载暂时关闭」和暂停说明。正文标题「下载积米律动客户端」不动。理由：搜索和社交预览仍在承诺可以下载 macOS 与 Windows 客户端；Codex 审查意见 `discussion_r4718874768`。

# 试过但失败的路

- 2026-11-26：曾把声明样式放进 `src/styles/global.css`，并用 Tailwind 类 `sticky`、`pt-8`、`pt-12`、`md:pt-16`。构建后 `docs/_astro/_slug_.DskvkCzu.css` 换成新哈希，案例库和邀请页等 HTML 只改了样式文件名。已撤回，原因：其它页面不该被本单的样式表改名带上。
- 2026-11-26：曾在 `src/layouts/ArticleLayout.astro` 里无条件包一层 `div`。没开声明的案例库构建结果多了一个空 `div`。已撤回，原因：只有下载页传入 `serviceOutageNotice` 时才需要这层顶栏。
