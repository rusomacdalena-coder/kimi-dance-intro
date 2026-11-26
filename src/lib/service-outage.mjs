/* ── 服务中断声明 ─────────────────────────────────────────────
 * 首页与下载页共用这一句。措辞已定死，不要改、删或换说法。
 * 不写预计恢复时间，不写救援、搬家或数据是否还在。
 * 样式只跟声明走，不写进全站 global.css，避免其它页面的样式文件改名。
 * ──────────────────────────────────────────────────────────── */

export const SERVICE_OUTAGE_NOTICE =
  '服务暂时中断，正在紧急处理。已安装的软件可能暂时无法登录或开始任务，请稍后再试。'

export const SERVICE_OUTAGE_NOTICE_CSS = `
.service-outage-bar {
  position: sticky;
  top: 0;
  z-index: 50;
}
.service-outage-notice {
  margin: 0;
  padding: calc(0.7rem + env(safe-area-inset-top)) 1.25rem 0.7rem;
  background: #f3e6cf;
  color: #1a120c;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.55;
}
section.service-outage-hero {
  padding-top: 2rem;
}
@media (min-width: 768px) {
  section.service-outage-hero {
    padding-top: 4rem;
  }
}
main.service-outage-main {
  padding-top: 3rem;
}
`.trim()
