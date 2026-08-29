# F-6 交付报告 · 首页 Hero 动画上官网

- 日期:2026-08-29。hash:**`dd0fa53`**(功能)+ 本报告 commit。push 21:17:48 +08,Pages 构建 `built`,线上 last-modified **21:18:14 +08**(26 秒)。
- 未动下载/邀请页内容(docs 全站重建仅资产哈希改名,download/invite 套件断言全绿);零第三方 CDN;dc.html 未上站。

## 0. 素材核验(先验后用)

- 实际位置:`拉片工具v2/rust 版/apps/`(包文写的 `~/Documents/Kimidance-Design/` 里没有;zip 名为空格版「Animate 品牌风格指南.zip」)。
- `kimidance-hero-loop.html`:2,511,677 B 分毫不差;sha256 = `504056fc…51427e54`,**与包文指定的权威值(…e54)完全一致**(包文另一处 `…e58` 为笔误)。
- zip:sha256 = `0ae437ce…170ec586` ✓;内容物齐:kimidance-hero.jsx / animations-v3.jsx / frames-data.js / frames×4 / _ds styles.css + _ds_bundle.js / dist 基准。

## 1. 探栈结论

- **React 集成早已存在**:`astro.config.mjs:2,29`(@astrojs/react)、`package.json:16,20,21`;更关键的是**首页本身就是 React 岛**——`src/pages/index.astro:28` `<LandingPage client:load />`,React 运行时今天就在首页载荷里。
- 首页 hero 现状:`src/components/LandingPage.tsx:109-174`(Hero 函数),标题三行在 `:121-125`,CTA 行至 `:170`。

## 2. 择路:A(组件移植),理由

1. React 已在船上 → A 路最大成本(运行时 ~44KB gz)为零增量;B 路(视频)反而要 2-4MB。
2. 组件动效不依赖 framer-motion——自带 ~120 行内核(Easing/animate/ccDerive/ccWarp),可原样搬运,授权时序逐毫秒保真;B 路只能得到有损像素。
3. 字体栈组件自写 `"Source Serif 4","Noto Serif SC",Georgia,serif`,站点全站零字体外链 → 天然合规。
4. 帧图仅 4 张、显示框 163×290 → webp 76KB 搞定。

## 3. 施工清单

| 文件 | 内容 |
|---|---|
| `src/components/hero/heroRuntime.jsx` | dc 运行时内核 verbatim(Easing/clamp/animate/ccDerive/ccWarp)+ `HeroStage`(rAF 时钟锚墙钟、12s 取模循环、`playing=false` 时钉 T=0)——替代 1383 行播放器壳 |
| `src/components/hero/KimidanceHeroLoop.jsx` | 影片本体 **verbatim**,三处声明式改动:①全局量→imports;②`frameSrc`→`/hero/shot_N.webp`(弃 window.KD_FRAMES);③CompositionStage 包装+window 导出→具名导出 `KimidanceHeroPiece` |
| `src/components/hero/HeroFilm.tsx` | 岛内封装:场景表 verbatim 自 OM_SCENES(6 幕共 12.0s)、四个 `#sep-c/m/y/k` 分色滤镜 defs(矩阵值 verbatim 自 _ds_bundle.js)、ResizeObserver 精确缩放、`prefers-reduced-motion` 闸 + `?kd-motion=reduce/allow` 与 `html[data-kd-motion]` 取证钩 |
| `src/components/hero/hero.css` | Broadsheet tokens + `.cmyk` 版语法 **全部 `.kd-heroloop` 作用域化**(零泄漏);预水合缩放阶梯(8 档媒体查询,水合后被精确值取代,溢出由 aspect-ratio 盒剪裁兜底) |
| `public/hero/shot_00{3,14,27,28}.webp` | 326px 宽(显示框 2×),共 **76KB** |
| `LandingPage.tsx` | `:3` import;CTA 行后插 `<HeroFilm />`(`:171-173`);内容列补 `w-full`(flex 收缩修正,标题文案零改动) |

## 4. 家规证据

- **无空白首屏**:SSR 直出授权首帧(frame 0 === frame 12)——构建产物 `docs/index.html` 内 `data-screen-label` ×1、`T 0.0s` ×1、分色版 img ×5/帧;线上同查(label=1、T0=1、webp 引用=20)。海报即真 DOM,非贴图。
- **reduced-motion → 静态首帧**:`?kd-motion=reduce` 实测 label `T 0.0s → T 0.0s`(帧泵后仍 0.0),截图时码 **00:00:00:00**;媒体查询与取证钩共用同一判定函数。
- **总重前后对比**(构建产物,首页全部引用文件):
  - BEFORE:raw **484,400 B** / gzip **165,152 B**(6 文件)
  - AFTER:raw **590,414 B** / gzip **247,229 B**(10 文件)
  - **新增 raw 106,014 B(103.5KB)/ 线上传输 ≈80KB**(webp 不再 gzip;明细:LandingPage 块 +14.5KB raw、index.html +17.1KB[SSR 首帧+内联 hero.css]、about.css +0.7KB、webp 73.6KB)——**预算 600KB,用了 17.7%**。
- **build + 套件**:16 页构建过;**6/6 测试全绿**(download/invite 断言未动)。
- **零外链**:构建产物 `unpkg=0、fonts.googleapis/gstatic=0`(index.html 与 LandingPage 块均为 0)。

## 5. 用户视角(线上实证)

- 桌面 1440:标题/文案/数据行/CTA 原样;片子在播(label 0.0→3.9s;截图逮住「拉开」段推镜特写);`scrollWidth 1425/1440` 无横向溢出。
- 手机 375:**`scrollWidth 375/375` 零溢出**,wrapper 325px、scale 0.1693(=325/1920 精确),片子在播(时码 00:00:04:23),截图在案。
- CDN 提示:kimidance.com 边缘缓存对无参请求约有数分钟延迟(带 cache-buster 立即新版);资产哈希改名,旧页拿新资产无碍。

## 6. 已知说明

- 本机 dc.html 基准用 Google Fonts 的 Source Serif 4;线上无该字体的访客回落 Noto Serif SC/系统衬线(包文即此要求),拉丁字形与基准略异,中文主体一致。
- 浏览器面板隐藏时 rAF 节流+旧瓦片不重绘,曾产生"白块/停播"假象;以 DOM 权威数据(label 推进、几何、背景色)复核排除,记录在案防复判。
- 帧图 alt 为空、液面层 `aria-hidden`,总容器 `role="img"` + 中文 aria-label(整片对读屏是一张"图")。

## 7. 回滚

`git revert dd0fa53 && git push`(连报告则一并 revert 本报告 commit);纯前端,服务器零动作。
