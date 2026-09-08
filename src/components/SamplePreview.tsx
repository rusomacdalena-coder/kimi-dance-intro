import { useState } from 'react'

/* ── 真实产出 · 《时光和你都很美》──────────────────────────────────────
   两处内容从 SEO｜GEO/09-数据播种内容包.md 第九节逐字复制（判断层 2026-09-08
   「官网收缩第二包」第二屏定稿），不得改动一字。
   来源文件：P1-案例库素材投放区/时光和你都很美_70集合集/
     +拉片.md 场1-9 整场；breakdown.csv shot_0052–shot_0057。 */
const SCRIPT_TEXT = `场1-9 日 外 户外花园
人物：时瑶，林嘉歌

△时瑶站在花园的一侧，平静地看向身边的男子。
△林嘉歌旁若无人地坐在长椅上撸猫，时瑶静静立于他身后。
时瑶（带着一丝质问）：喂 你怎么不说话
△时瑶目不转睛地盯着他，神情专注且探究。
时瑶：你在听我说话吗
△林嘉歌微微垂下眼眸，神色淡然自若。
林嘉歌：怎么可能
△林嘉歌紧紧抱着猫，侧头看向别处，语气冷淡。
林嘉歌：不会娶的
△林嘉歌低头看着猫，眉宇间流露出一抹不易察觉的落寞。`

const BREAKDOWN_HEAD = ['镜头号', '起止', '时长(s)', '景别', '运镜', '角色', '台词', '画面描述', '情绪', '叙事功能']
const BREAKDOWN_ROWS: string[][] = [
  ['shot_0052', '00:02:12–00:02:15', '2.56', '全景', '固定', '时瑶/林嘉歌', '时瑶: 喂 你怎么不说话', '林嘉歌坐在长椅上撸猫，时瑶在背景中', '质问', '冲突'],
  ['shot_0053', '00:02:15–00:02:17', '1.6', '特写', '固定', '时瑶', '时瑶: 你在听我说话吗', '时瑶面部特写，神情专注', '探究', '铺垫'],
  ['shot_0054', '00:02:17–00:02:19', '2.92', '特写', '固定', '林嘉歌', '林嘉歌: 怎么可能', '林嘉歌面部特写，微微垂眸', '淡然', '过渡'],
  ['shot_0055', '00:02:19–00:02:21', '1.92', '全景', '固定', '林嘉歌/时瑶', '林嘉歌: 不会娶的', '林嘉歌抱着猫，侧头看向一旁', '坚定/冷淡', '转折'],
  ['shot_0056', '00:02:21–00:02:23', '1.16', '近景', '固定', '林嘉歌', '', '林嘉歌低头看猫，神情落寞', '伤感', '铺垫'],
  ['shot_0057', '00:02:23–00:02:24', '1.4', '特写', '固定', '', '', '一个果实从树枝上掉落', '凄凉', '铺垫'],
]

const STONE = 'hsl(35 30% 92%)' /* cream on the dark ground */
const DIM = 'hsl(32 13% 76%)'
const RULE = 'rgba(255, 255, 255, 0.12)'

type Tab = 'script' | 'breakdown'

/* 深底上的卡片（判断层 2026-09-08「官网回滚到深色」第 3 条）：背景比页面略浅一档 + 1px 边框，文字不动 */
export default function SamplePreview() {
  const [tab, setTab] = useState<Tab>('script')

  const tabStyle = (active: boolean) => ({
    color: active ? STONE : DIM,
    borderBottom: active ? `2px solid ${STONE}` : '2px solid transparent',
  })

  return (
    <section id="sample" className="py-20 md:py-28 px-4 md:px-6 scroll-mt-20" style={{ color: STONE }}>
      <div className="max-w-4xl mx-auto kd-card p-5 md:p-8">
        <div className="kd-label" style={{ color: DIM }}>—— 真实产出 · 《时光和你都很美》</div>

        {/* 两个标签页 */}
        <div className="mt-6 flex gap-6 text-sm font-semibold" style={{ borderBottom: `1px solid ${RULE}` }}>
          <button type="button" className="pb-3" style={tabStyle(tab === 'script')} onClick={() => setTab('script')}>
            文学剧本
          </button>
          <button type="button" className="pb-3" style={tabStyle(tab === 'breakdown')} onClick={() => setTab('breakdown')}>
            分镜速查表
          </button>
        </div>

        {tab === 'script' ? (
          <pre
            className="mt-6 text-[15px] leading-[1.9] whitespace-pre-wrap"
            style={{ fontFamily: 'inherit', color: STONE, margin: 0 }}
          >
            {SCRIPT_TEXT}
          </pre>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" style={{ color: STONE, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {BREAKDOWN_HEAD.map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap"
                      style={{ color: DIM, borderBottom: `1px solid ${RULE}` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BREAKDOWN_ROWS.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={`px-3 py-2 align-top ${i === 0 || i === 1 || i === 2 ? 'whitespace-nowrap' : ''}`}
                        style={{ borderBottom: `1px solid ${RULE}`, fontFamily: i === 0 ? 'ui-monospace, Menlo, monospace' : 'inherit' }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-sm" style={{ color: DIM }}>
          台词按原音原样保留、不经 AI 改写；语音识别的错字可能存在，投稿前请人工核对。
        </p>
        <a href="/cases/" className="inline-block mt-4 text-sm font-semibold underline underline-offset-4" style={{ color: STONE }}>
          更多拆解 →
        </a>
      </div>
    </section>
  )
}
