# KimiDance 架构文档

## Pipeline 概览

```
Video (.mp4/.mov/.mkv)
    │
    ▼
Layer 0: 视频预处理
    ├── ffmpeg 音频提取
    ├── Whisper ASR 转写（faster-whisper 本地 / OpenAI Whisper API）
    ├── PySceneDetect 镜头切分
    └── 关键帧提取
    │
    ▼
Layer 1: 多模态镜头标注
    ├── Gemini 2.5 Flash / GPT-4o 驱动
    ├── 批量 25 镜头并行（关键帧 + 对白 + 时间戳）
    ├── 输出：场景类型、角色、对白-角色映射、情绪、景别、叙事功能
    └── 全局 API 限流器（令牌桶）
    │
    ▼
Layer 1.5/1.6: 角色解析
    ├── speaker_resolver.py — 纯规则角色身份补全
    ├── llm_character_backfill.py — LLM 全片角色聚合
    └── apply_character_map.py — 确定性角色回写
    │
    ▼
Layer 2: 产物生成
    ├── 文学剧本（.md）— 投稿模板格式
    ├── 叙事节奏分析（.md）— 钩子/冲突/高潮/情绪曲线
    └── 分镜速查表（.csv）— 每镜头可查
    │
    ▼
Output: Streamlit Web UI / CLI / JSON
```

## 核心模块

| 模块 | 角色 | 说明 |
|------|------|------|
| `lapian.py` | CLI 主入口 | Typer CLI，调度全流程 |
| `config.py` | 配置中心 | 所有可调参数集中管理 |
| `lapian_v2.py` | Layer 0 | 视频预处理（转写+切分+关键帧） |
| `annotate.py` | Layer 1 | 多模态镜头标注 |
| `speaker_resolver.py` | Layer 1.5 | 纯规则角色识别 |
| `llm_character_backfill.py` | Layer 1.6 | LLM 角色聚合 |
| `apply_character_map.py` | Layer 1.6 | 确定性角色回写 |
| `generate.py` | Layer 2 | 剧本/分析/CSV 生成 |
| `validate.py` | 质量门 | 台词零篡改 + 标注完整性校验 |
| `script_dialogue_validator.py` | 质量门 | Layer 2 台词硬校验 |
| `throttle.py` | 基础设施 | 全局 API 限流器（令牌桶） |
| `streamlit_app.py` | Web UI | Streamlit 界面 |
| `progress_reporter.py` | 可观测性 | 进度上报 |
| `pipeline_watchdog.py` | 可观测性 | 运行状态自动监控 |
| `pipeline_lock.py` | 基础设施 | 单视频互斥锁 |
| `cost_estimator.py` | 成本 | 跑前成本预估 |
| `usage_telemetry.py` | 成本 | 跑后用量追踪 |
| `error_codes.py` | 基础设施 | 统一错误码体系 |

## 质量红线

### 台词零篡改

核心原则：LLM 绝对不允许改写 ASR 输出的原始台词文本。

执行层：
- `validate.py`：标注阶段校验，确保每个 shot 的 raw_text 未被修改
- `script_dialogue_validator.py`：剧本生成阶段校验，逐句对比 ASR 原文
- 两道独立校验，任一失败 → 流程终止

### 角色标注完整性

- 角色识别召回率目标 ≥ 95%
- LLM 回填仅处理 `[待确认]` 标记的 speaker
- 确定性规则优先于 LLM 推断

## 技术选型

| 层 | 技术 | 选型理由 |
|---|------|---------|
| ASR | faster-whisper / OpenAI Whisper | 本地优先，云端 fallback |
| 镜头切分 | PySceneDetect + OpenCV | 内容感知切分，非固定时长 |
| 视觉标注 | Gemini 2.5 Flash | 成本/速度最优，多模态原生支持 |
| 剧本生成 | GPT-4o | 长文本结构化输出最稳定 |
| Web UI | Streamlit | 零前端依赖，Python 生态无缝 |
| 包管理 | uv + hatchling | 极速安装，锁文件可复现 |

## 性能基线

基于 40 分钟视频（崇祯元年测试集，1751 个镜头）：

| 指标 | 数值 |
|------|------|
| 总耗时 | ~58 分钟 |
| 成本 | ~$0.50-2.00（视模型选择） |
| 角色识别率 | 94.8%（143 个角色名，5.2% 待确认） |
| 对白覆盖率 | ≥95% |

## 安全边界

- API Key 存储于本地 `.env`（不入库）
- 视频本地处理，不上传至第三方服务器（ASR/LLM API 调用除外）
- 单视频互斥锁防止并发冲突
- 失败自动导出诊断包（日志 + 配置 + 环境信息）
