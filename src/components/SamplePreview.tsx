import { useState } from 'react'

/* ── 风水天师 mock 剧本样本 ────────────────────────────────────────────── */
const scriptSample = `场1-1 夜 内 玄学事务所·办公室

人物：林天师，小莲

△ 灰暗的办公室，窗帘半拉。桌上散落着罗盘和符纸。
△ 林天师坐在桌前，手指摩挲着一枚铜钱，眉头紧锁。

林天师（皱眉）：这个案子不简单，得亲自去一趟。
小莲（OS）：师父每次说这话，回来都得躺三天。

△ 林天师抓起包，头也不回地走出门。

场1-2 夜 外 老宅·门口

人物：林天师，张管家

△ 破旧的宅院大门，两盏红灯笼在风中摇晃。
△ 一个穿灰色长衫的老人站在门口，神色焦虑。

张管家（急切）：林天师，您可算来了！
张管家（压低声音）：老爷三天没出过房间了，里面一直有动静。
林天师（平静）：带路吧。

△ 林天师从包中取出罗盘，指针剧烈摆动。
林天师（自言自语）：果然，是冲着主位来的。`

const breakdownRows = [
  {
    shot: '001',
    scene: '场1-1',
    scale: '中景',
    move: '固定',
    char: '林天师',
    line: '这个案子不简单，得亲自去一趟。',
    emotion: '凝重',
    function: '建置悬念',
  },
  {
    shot: '002',
    scene: '场1-1',
    scale: '特写',
    move: '推',
    char: '林天师',
    line: '—',
    emotion: '决心',
    function: '角色动机',
  },
  {
    shot: '003',
    scene: '场1-2',
    scale: '全景',
    move: '固定',
    char: '张管家',
    line: '林天师，您可算来了！',
    emotion: '焦虑',
    function: '场景转换',
  },
  {
    shot: '004',
    scene: '场1-2',
    scale: '近景',
    move: '手持',
    char: '林天师',
    line: '果然，是冲着主位来的。',
    emotion: '警觉',
    function: '钩子 / 悬念升级',
  },
]

type Tab = 'script' | 'breakdown'

export default function SamplePreview() {
  const [tab, setTab] = useState<Tab>('script')

  return (
    <section id="sample" className="py-28 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="label-caps mb-4 text-center">Sample Output</div>
        <h2 className="text-editorial text-3xl sm:text-4xl font-bold text-center mb-3">
          真实产出预览
        </h2>
        <p className="text-center copy-readable mb-12">
          以下为模拟剧本格式，实际产出来自你上传的视频
        </p>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'script'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/80 text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTab('script')}
          >
            📝 文学剧本
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'breakdown'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/80 text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTab('breakdown')}
          >
            📋 分镜速查表
          </button>
        </div>

        {/* Content */}
        <div className="rounded-2xl surface-glass overflow-hidden">
          {/* Title bar */}
          <div className="px-5 py-3 border-b border-border/70 flex items-center gap-2 bg-muted/40">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-2">
              {tab === 'script'
                ? '风水天师第二季+拉片.md'
                : 'breakdown.csv'}
            </span>
          </div>

          {tab === 'script' ? (
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {scriptSample.split('\n').map((line, i) => {
                  // Scene headers
                  if (line.match(/^场\d/)) {
                    return (
                      <div key={i} className="text-primary font-bold mt-6 mb-2 first:mt-0">
                        {line}
                      </div>
                    )
                  }
                  // Character list
                  if (line.startsWith('人物：')) {
                    return (
                      <div key={i} className="text-muted-foreground text-xs mb-3">
                        {line}
                      </div>
                    )
                  }
                  // Action lines
                  if (line.startsWith('△')) {
                    return (
                      <div key={i} className="text-muted-foreground my-1">
                        {line}
                      </div>
                    )
                  }
                  // Dialogue
                  if (line.match(/^.+[（(]/)) {
                    const match = line.match(/^(.+?)[（(](.+?)[）)][:：](.+)$/)
                    if (match) {
                      return (
                        <div key={i} className="my-1">
                          <span className="text-foreground font-medium">
                            {match[1]}
                          </span>
                          <span className="text-muted-foreground">
                            （{match[2]}）：
                          </span>
                          <span className="text-foreground">{match[3]}</span>
                        </div>
                      )
                    }
                  }
                  // Empty lines
                  if (!line.trim()) {
                    return <div key={i} className="h-2" />
                  }
                  // Fallback
                  return (
                    <div key={i} className="text-foreground my-1">
                      {line}
                    </div>
                  )
                })}
              </pre>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs text-left">
                    <th className="px-4 py-3 font-semibold">镜号</th>
                    <th className="px-4 py-3 font-semibold">场景</th>
                    <th className="px-4 py-3 font-semibold">景别</th>
                    <th className="px-4 py-3 font-semibold">运镜</th>
                    <th className="px-4 py-3 font-semibold">角色</th>
                    <th className="px-4 py-3 font-semibold">台词</th>
                    <th className="px-4 py-3 font-semibold">情绪</th>
                    <th className="px-4 py-3 font-semibold">叙事功能</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownRows.map((r) => (
                    <tr
                      key={r.shot}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {r.shot}
                      </td>
                      <td className="px-4 py-3 text-primary">{r.scene}</td>
                      <td className="px-4 py-3">{r.scale}</td>
                      <td className="px-4 py-3">{r.move}</td>
                      <td className="px-4 py-3">{r.char}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">
                        {r.line}
                      </td>
                      <td className="px-4 py-3">{r.emotion}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.function}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
