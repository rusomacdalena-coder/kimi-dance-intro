# 服务中断声明 · 交付报告

- 日期：2026-11-26
- 仓库：https://github.com/rusomacdalena-coder/kimi-dance-intro
- 分支：`cursor/service-outage-notice-9352`
- 基线：`main`（`750a4fe`，与 `origin/main` 一致）
- 状态：审查请求待开出后填写链接。未合并。未推 `main`。未跑 `npm run indexnow`。线上 https://kimidance.com 与 https://kimidance.com/download/ 本单没有发布。
- 开工时仓库根目录没有 `PROGRESS.md`。本单新建了 `PROGRESS.md`。

声明原文（两句，与定稿一致）：

> 服务暂时中断，正在紧急处理。已安装的软件可能暂时无法登录或开始任务，请稍后再试。

## 改了什么

声明只出现在首页和下载页的页面最上方，跟在导航上面。案例库、邀请页和其它文章页不渲染这则声明。

| 路径 | 作用 |
|---|---|
| `src/lib/service-outage.mjs` | 唯一文案 `SERVICE_OUTAGE_NOTICE`，以及只给这两页用的样式 |
| `src/components/LandingPage.tsx` | 首页顶栏：声明在导航之上 |
| `src/pages/download.astro` | 只多了 `serviceOutageNotice`，下载页正文未改 |
| `src/layouts/ArticleLayout.astro` | 仅当 `serviceOutageNotice` 为真时，在导航前渲染声明 |
| `src/components/ArticleTopNav.astro` | 从 `ArticleLayout` 抽出的原顶栏。未开声明的页面仍用原来的固定顶栏 |
| `tests/service-outage-notice.test.mjs` | 三句验收各一条测试，标题与验收原文一致 |
| `docs/index.html` | 首页构建结果 |
| `docs/download/index.html` | 下载页构建结果 |
| `docs/_astro/LandingPage.DTPTOajz.js` | 首页脚本。旧文件 `docs/_astro/LandingPage.BOGOFjId.js` 删除 |

没有改 `public/CNAME`、`docs/CNAME`、下载链接、邀请码说法、版本号或 SHA-256。`src/styles/global.css` 未改。`docs/_astro/_slug_.DskvkCzu.css` 与 `main` 上的字节一致，所以案例库等页面的构建 HTML 没有进入本单差异。

下载入口仍是：

- `https://api.kimidance.com/downloads/Kimidance-0.4.25-macOS.dmg`
- `https://api.kimidance.com/downloads/Kimidance-Windows-Setup-0.4.25-r1-x64.exe`

按钮文案仍是「下载 macOS 版 0.4.25」和「下载 Windows 版 0.4.25」。

## 三句验收怎么核的

本地预览：`npm run preview -- --host 127.0.0.1 --port 4321`（2026-11-26）。截图在 `/opt/cursor/artifacts/`，不是线上页面。

自动测试：`npm test`（`node --test tests/*.test.mjs`）。9 条通过，其中 3 条标题就是下面三句验收。

### 1. 用户打开积米律动官网首页，应在页面最上方看到声明：「服务暂时中断，正在紧急处理。已安装的软件可能暂时无法登录或开始任务，请稍后再试。」

- `tests/service-outage-notice.test.mjs` 读 `docs/index.html`，去掉脚本和样式后，正文第一个可见文本等于上述两句，且全文只出现一次。
- 本地预览 http://127.0.0.1:4321/ 桌面 1440×900 与手机 390×844 截图：米色条在页面最上沿，导航和标题都在声明下面。手机上两句折成两行，文字没有改。

### 2. 用户打开积米律动官网的下载页，应在页面最上方看到同一则声明。

- 同一测试文件读 `docs/download/index.html`，正文第一个可见文本同样是上述两句，且全文只出现一次。
- 本地预览 http://127.0.0.1:4321/download/ 桌面 1440×1400 与手机 390×1000 截图：同一条米色声明在最上沿，下面仍是「下载积米律动客户端」。

### 3. 用户打开官网首页和下载页时，除了最上方多了这则声明，其余内容和登声明前一样，下载入口和现有版本说明仍在。

- 测试仍能在 `docs/index.html` 里找到「爆款的剧本没人会给你。那就把它变回剧本。」「台词不经 AI 改写。」「下载客户端 · Mac / Windows」「公测中 · 注册赠 100 积分 · ¥1 / 视频分钟 · 任务开始前先看费用预估」。
- 测试仍能在 `docs/download/index.html` 和 `src/pages/download.astro` 里找到「公测期，采用邀请码注册」、两个 `api.kimidance.com/downloads/` 链接、两个 0.4.25 下载按钮、「版本 0.4.25」、两条 SHA-256、「已经装过 0.4.8 的老用户」「不需要先卸载」「0.2.x 或更早版本的老用户」「请先卸载旧版本」。
- 声明元素内部的文本与定稿两句相等，不含「预计」「救援」「搬家」。
- 原有下载页测试 `tests/download-availability.test.mjs` 仍通过。
- 截图里 Mac / Windows 卡片、0.4.25 按钮、0.4.8 与 0.2.x 的安装说明都还在。
- `git diff` 里，除 `docs/index.html`、`docs/download/index.html` 和首页脚本换名外，其它 `docs/**/*.html` 与 `main` 无差异。案例库本地预览 http://127.0.0.1:4321/cases/ 最上沿仍是原来的导航，没有这则声明。

## 发布边界

本单停在审查请求。积米·PM 合并到 `main` 之后，GitHub Pages 才会用 `docs/` 更新 https://kimidance.com 和 https://kimidance.com/download/ 。线上是否出现声明，由积米·PM 发布后亲自打开页面验收。
