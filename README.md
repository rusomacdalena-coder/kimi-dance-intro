# 积米律动 KimiDance

> 积米律动（Kimidance）是一款 AI 拉片工具：输入一部短剧或长视频，自动输出文学剧本、叙事节奏分析和分镜速查表，全程台词零篡改。

官网：**[kimidance.com](https://kimidance.com)** ｜ 内测申请：[kimidance.com/#beta](https://kimidance.com/#beta)

![KimiDance UI](assets/ui-dashboard.png)

## 它能做什么

| 输入 | 输出 |
|------|------|
| 一部视频（mp4/mov/mkv/avi，≤ 2 GB） | **文学剧本** — 投稿模板格式（场头 + △ 动作行 + 角色台词 + OS/VO 标记），台词零篡改 |
| | **叙事节奏分析** — 钩子 / 冲突点 / 高潮 / 情绪曲线 |
| | **分镜速查表** — 每个镜头一行（景别 / 运镜 / 角色 / 台词 / 情绪 / 叙事功能），CSV 直接进 Excel |

**速度**：1 小时视频，云端通道约 4-9 分钟，本机通道约 30-90 分钟。

## 核心红线：台词零篡改

LLM 只做标注和结构化生成，绝不改写原始台词。质量校验强制执行：台词 recall ≥ 95%、tamper = 0，不达标不出稿。ASR 出来的台词是什么，剧本里的台词就是什么。

## 示例输出

- [崇祯元年·拉片样本](samples/崇祯元年_拉片样本.md)
- [叙事节奏分析样本](samples/analysis.md)
- [分镜速查表样本](samples/breakdown_sample.csv)

## 什么是 AI 拉片？

概念科普（拉片 / AI 拉片 / agent 拉片 的定义与 FAQ）：[kimidance.com/what-is-ai-lapian](https://kimidance.com/what-is-ai-lapian/)

## 架构

[→ 完整架构文档](ARCHITECTURE.md)

**Pipeline**：Python 3.12 + Whisper ASR + PySceneDetect + 多模态大模型标注 + LLM 成稿
**形态**：macOS 桌面应用（本地运行，视频不离开你的电脑）

## 当前状态

- ✅ 核心流水线：转录 → 切镜标注 → 角色识别 → 成稿 全流程稳定运行
- ✅ macOS 桌面安装包内测发放中
- 🔄 Windows 版打包中
- 🔄 拉片 MCP（让 Claude / ChatGPT 等 agent 直接调用拉片）开发中

## 本仓库

本仓库包含 kimidance.com 官网源码（Astro）与公开介绍文档。

```bash
npm install
npm run dev        # 本地开发
npm run build      # 构建到 docs/（GitHub Pages 部署目录）
npm run indexnow   # 部署后向 IndexNow（Bing/博查）推送收录
```

## 联系方式

- 邮箱：oliverzhu929598@gmail.com
- 内测申请：[kimidance.com/#beta](https://kimidance.com/#beta)
