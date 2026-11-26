# 当前状态

- 2026-11-26：开工时仓库根目录没有 `PROGRESS.md`。本文件从这一天写起。
- 2026-11-26：服务中断声明已写在分支 `cursor/service-outage-notice-9352`，相对 `main`（`750a4fe`）。已修：本地源码和 `docs/index.html`、`docs/download/index.html`。未合并，未发版，用户未在 https://kimidance.com 或 https://kimidance.com/download/ 拿到。审查请求链接：待本提交之后补。
- 2026-11-26：声明原文是「服务暂时中断，正在紧急处理。已安装的软件可能暂时无法登录或开始任务，请稍后再试。」出处：`src/lib/service-outage.mjs` 的 `SERVICE_OUTAGE_NOTICE`。
- 2026-11-26：`npm test` 9 条通过。本地预览 http://127.0.0.1:4321/ 与 http://127.0.0.1:4321/download/ 最上沿能看到声明。截图在审查请求说明里。线上页面未核，因为本单不发布。

# 已定决策（附理由）

- 2026-11-26：声明只登首页和下载页，不进全站顶栏。理由：三句验收只要求这两页；案例库、邀请页多一则声明就超出本单。
- 2026-11-26：两页共用 `src/lib/service-outage.mjs` 里的 `SERVICE_OUTAGE_NOTICE`，不在页面里各写一遍。理由：首页是 React，下载页是 Astro，各写一遍容易把定稿改样。
- 2026-11-26：声明样式放在 `SERVICE_OUTAGE_NOTICE_CSS`，不写进 `src/styles/global.css`。理由：写进全站样式会让 `docs/_astro/_slug_.DskvkCzu.css` 改哈希，其它页面的构建 HTML 会跟着改样式文件名。
- 2026-11-26：不写预计恢复时间，不写救援、搬家或数据是否还在。理由：本单禁改措辞。
- 2026-11-26：不合并 `main`，不跑 IndexNow，不改 CNAME。理由：发布由积米·PM 核对后自己做。

# 试过但失败的路

- 2026-11-26：曾把声明样式放进 `src/styles/global.css`，并用 Tailwind 类 `sticky`、`pt-8`、`pt-12`、`md:pt-16`。构建后 `docs/_astro/_slug_.DskvkCzu.css` 换成新哈希，案例库和邀请页等 HTML 只改了样式文件名。已撤回，原因：其它页面不该被本单的样式表改名带上。
- 2026-11-26：曾在 `src/layouts/ArticleLayout.astro` 里无条件包一层 `div`。没开声明的案例库构建结果多了一个空 `div`。已撤回，原因：只有下载页传入 `serviceOutageNotice` 时才需要这层顶栏。
