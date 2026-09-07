# kimi-dance-intro（kimidance.com 官网）

积米律动 Kimidance 官网源码：Astro 5 + React 岛 + Tailwind，静态构建到 `docs/`，GitHub Pages 从 `docs/` 部署到 kimidance.com。内容源与裁定记录在 `~/Documents/SEO｜GEO/`（案例三件套投放区、待办、宣传边界自查）。

## 常用命令

```bash
npm run dev        # 本地开发
npm run cases      # 从 SEO｜GEO/P1-案例库素材投放区 生成案例库数据与 .md 镜像
npm run data       # 从已发布案例重算节奏统计（口径 E）
npm run build      # 构建到 docs/；顺序：cases → data → build
npm run indexnow   # 部署后向 IndexNow 推送收录
npm test           # node --test tests/*.test.mjs（纯本地文件断言，不联网）
```

`docs/` 是构建产物，随源码一起提交，推 main 即上线。

## 红线

- 对外文案过宣传边界：一句式「台词不经 AI 改写」；展开式必须带「语音识别的错字可能存在，投稿前请人工核对」。不写耗时数字；不写"安全 / 放心 / 无害 / 绝不"；"全球首个"必须留证或改可证句。
- 案例库不发完整剧本正文（`scripts/build-cases.mjs` 执行，分镜最多 10 行）。
- 下载链接只指向 `api.kimidance.com/downloads/`，不指向源码仓 release；改下载页必须同步 `tests/`。
- `docs/` 不手改、不放内部文件：它会被公开发布，且每次 build 清空。

## 跨会话延续（以 PROGRESS.md 为准）

本仓的进度文件是仓库根目录的 `PROGRESS.md`（不是 `docs/PROGRESS.md`，因为 `docs/` 是发布目录）。

1. **开工前先读 `PROGRESS.md`，以它为准，不要凭记忆猜项目状态。** 对话记忆在压缩后会丢，文件不会。文件不存在就直说不存在。文件里标"待办 / 在跑 / 等结果"的条目，动手前先用 `git log` / `ls` 核实物，用一行报"文件说 X，实况 Y"，再决定做不做。
2. **每完成一个阶段就更新 `PROGRESS.md`**（压缩上下文之前也要更新一次）。"当前状态"按 已修 / 已发版 / 用户已拿到 三态分开写，不许混；"已完成"必须附 commit hash 或文件路径，没有就写"已做，未提交，hash 待补"。
3. **"已定决策"和"试过但失败的路"两节只追加、不删除。** 要撤回一条决策，就在后面追加一行"已撤回，原因：…"，不改旧行、不删旧行。不然下一个窗口会把否决过的方案再提一遍。
4. **更新时只改有变化的部分。** 不要整篇重写：没变的行原样保留，改动的行就地改，新事实追加。整篇重写会悄悄丢掉别人写进去的细节。
5. **不确定的事宁可空着，不要编。** 没核实的数字、hash、状态一律写 UNKNOWN 并注明"去哪查"；宁可留白也不写一个看起来合理的猜测。
