# R-4win 交付报告 · 官网切换 Windows 0.4.10-r15

- 日期:2026-08-30。hash:**`af3bd0e`**(+ 本报告 commit)。push 10:36:51 +08,线上可见 **10:37:14 +08**(23 秒,cache-buster 验真身)。
- Mac 行一字未动;服务器零动作(旧 r14 文件留原处 = 回滚路径);零积分。

## 1. 仓况与底座

- 仓库干净,基线 HEAD `fbd0174`。
- 新 exe 先验后用:HEAD `200 OK`、`Content-Length: 98014980` 与事实底座逐字一致。

## 2. 改动(仅 Windows 行)

| 位置 | 旧 → 新 |
|---|---|
| `download.astro:4` | dateModified `2026-08-29` → `2026-08-30` |
| `:10-11` WIN_URL | `…0.4.9-r14-x64.exe` → `…0.4.10-r15-x64.exe` |
| `:12` WIN_SHA256 | `ff4ca723…fcf10` → `bc1204c1…3d0e` |
| `:13` WIN_SIZE | **不变**:98,014,980 B = 93.48 MiB,仍落「约 93 MB」仓内 MiB 口径 |
| `:14` WIN_FILENAME | → 新文件名(shasum 示例经 `{WIN_FILENAME}/{WIN_SHA256}` 模板自动联动) |
| `:81` / `:89` | 「版本 0.4.9」→「版本 0.4.10」、按钮 → 「下载 Windows 版 0.4.10」 |

版本展示口径说明:沿用页面既有约定(与 Mac 行同构)——正文/按钮展示素版本号 `0.4.10`,修订号 `r15` 保留在文件名/URL/sha 示例中(r14 时代即此约定)。如要正文直接展示 `0.4.10-r15`,一处改动即可。

## 3. 测试同步(`tests/download-availability.test.mjs`)

- Windows 条目全量改为 0.4.10-r15(标题/sha/文件名/按钮文案/唯一下载源 URL);
- api.kimidance.com 白名单负向断言改指 r15(顺手修正了注释里过期的「r13」字样);
- **禁回流**照 Mac 做法新增:旧文件名 `Kimidance-Windows-Setup-0.4.9-r14-x64.exe` 与旧 sha `ff4ca723…fcf10` 不得再现(page+built 双查)。
- 套件 **6/6 全绿**;构建产物核验:r15 ×3、新 sha ×2、旧文件名 **0**、旧 sha **0**、Mac dmg ×2 原样、`2026-08-30` ×1。

## 4. invite.astro

Windows 入口**零命中**(全页 grep 仅 `execCommand('copy')` 一处含 exec 字样;且 invite 套件既有断言禁止任何 exe/msi 链接出现)。无需改动。

## 5. 用户视角验货(6a/b/c/d)

| 项 | 结果 |
|---|---|
| a 线上页面 | `Kimidance-Windows-Setup-0.4.10-r15-x64.exe` ×3、新 sha ×2、「下载 Windows 版 0.4.10」×1;**旧 r14 文件名 0 命中、旧 sha 0 命中**;Mac 文案原样 ×1 |
| b 真下载 | 按页面链接下到 /tmp:**98,014,980 B 分毫不差**、sha256 `bc1204c181ffa5721789e0042ea28e5f0da0df3bf270fbb90335458ad3fd3d0e` **逐字一致**;验毕即删(已确认删除) |
| c Mac 复核 | `200 OK` + `Content-Length: 40286777`(未误伤) |
| d 双端截图 | 桌面 1440(双卡并排,Windows 卡「版本 0.4.10 · 约 93 MB」)与手机 375 各一张存会话;scrollWidth == innerWidth,无溢出 |

## 6. 回滚(只写不做)

把 `download.astro` 与 `download-availability.test.mjs` 的 Windows 条目改回 r14 值(URL/sha/文件名/文案,及测试白名单与禁回流对调)再 push 即回滚;服务器零动作(r14 文件仍在原处)。
