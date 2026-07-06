import { useState, useEffect } from 'react'
import BetaForm from './BetaForm'
import SamplePreview from './SamplePreview'
import ProductPreview from './ProductPreview'

/* ─── Nav ─────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [
    { label: '功能', href: '#features' },
    { label: '工作流程', href: '#workflow' },
    { label: '产品预览', href: '#preview' },
    { label: '产出示例', href: '#sample' },
    { label: '什么是 AI 拉片', href: '/what-is-ai-lapian/' },
  ]

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/78 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-black/20'
          : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="积米律动"
            className="w-8 h-8"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tracking-wide text-cream">
              积米律动
            </span>
            <span className="text-xs text-muted-foreground">Kimidance</span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-cream transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#beta"
            className="text-sm font-medium px-5 py-2 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary transition-colors"
          >
            申请内测
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm text-muted-foreground hover:text-cream"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#beta"
            className="block text-sm text-muted-foreground hover:text-cream"
            onClick={() => setMenuOpen(false)}
          >
            申请内测
          </a>
        </div>
      )}
    </nav>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-16 bg-warm-glow overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[hsl(30_40%_12%)] rounded-full blur-[160px] opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="label-caps mb-8">Private Beta &middot; 2026</div>

        <h1 className="text-editorial text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.15] tracking-tight">
          <span className="block">稍等片刻</span>
          <span className="block">一部短剧视频</span>
          <span className="block text-gradient">变成可用的文学剧本</span>
        </h1>

        <p className="mt-8 text-lg copy-readable max-w-xl mx-auto">
          上传视频，自动拉片、识别角色、分析叙事。
          <br className="hidden sm:block" />
          一个午觉的时间，拿到一份可读可投稿的剧本。
        </p>

        {/* Stats row — editorial data points */}
        <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cream">
              1/10
            </div>
            <div className="text-xs text-muted-foreground mt-1">竞品成本</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cream">
              2<span className="text-base text-muted-foreground ml-0.5">GB</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">单文件上限</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cream">
              30<span className="text-base text-copper">+</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">内测已完成</div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#beta"
            className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors shadow-xl shadow-primary/25"
          >
            申请内测 &rarr;
          </a>
          <a
            href="#sample"
            className="px-8 py-3.5 rounded-full border border-border/70 bg-card/25 backdrop-blur text-muted-foreground font-medium text-base hover:text-cream hover:border-primary/40 transition-all"
          >
            &darr; 看看产出长什么样
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ─────────────────────────────────────────────────────────── */
const outputs = [
  {
    title: '文学剧本',
    file: '拉片.md',
    size: '184 KB',
    desc: '场头 + 动作行 + 角色台词 + OS/VO 标记。台词零篡改——每一句都是原声实录。',
  },
  {
    title: '叙事分析',
    file: 'analysis.md',
    size: '21 KB',
    desc: '钩子、冲突点、高潮、情绪曲线，一眼看出节奏设计。',
  },
  {
    title: '分镜速查表',
    file: 'breakdown.csv',
    size: '94 KB',
    desc: '每镜一行：景别、运镜、角色、台词、情绪、叙事功能。Excel 直接打开。',
  },
]

function Features() {
  return (
    <section id="features" className="py-28 px-6 scroll-mt-20 bg-warm-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="label-caps mb-4 text-center">Output</div>
        <h2 className="text-editorial text-3xl sm:text-4xl font-bold text-center mb-16">
          一个视频进去，三件套出来
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {outputs.map((o) => (
            <div
              key={o.title}
              className="group p-8 rounded-2xl surface-glass-soft hover:border-primary/35 transition-all duration-300"
            >
              <h3 className="text-editorial text-2xl font-bold mb-2">
                {o.title}
              </h3>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded">
                  {o.file}
                </span>
                <span className="text-xs text-muted-foreground/50">
                  {o.size}
                </span>
              </div>
              <p className="text-sm copy-readable">
                {o.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Workflow ──────────────────────────────────────────────────────────── */
const steps = [
  {
    num: '01',
    title: '把视频丢进来',
    desc: '拖入 .mp4 / .mov / .mkv，或粘贴本地文件路径',
    detail: 'mp4 · mov · mkv · avi · 单文件上限 2 GB',
  },
  {
    num: '02',
    title: 'AI 全自动处理',
    desc: '语音转录 → 逐镜头标注 → 角色确认 → 剧本生成',
    detail: '云端 4-9 分钟 / 本机 30-90 分钟 · 实时费用预估',
  },
  {
    num: '03',
    title: '下载成品',
    desc: '一键导出 ZIP：剧本 + 分析 + 分镜表 + 角色关系图',
    detail: '质量红线：recall ≥ 95%  ·  tamper = 0',
  },
]

function Workflow() {
  return (
    <section id="workflow" className="py-28 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="label-caps mb-4 text-center">How it works</div>
        <h2 className="text-editorial text-3xl sm:text-4xl font-bold text-center mb-16">
          三步完成
        </h2>

        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={s.num} className="flex gap-6 sm:gap-8">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl surface-glass-soft text-copper font-bold text-xl flex items-center justify-center shrink-0">
                  {s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 min-h-[60px] bg-gradient-to-b from-border to-transparent my-2" />
                )}
              </div>
              {/* Content */}
              <div className="pb-12 pt-3">
                <h3 className="text-editorial text-xl font-bold mb-2">{s.title}</h3>
                <p className="copy-readable text-sm">
                  {s.desc}
                </p>
                <p className="text-muted-foreground/40 text-xs mt-2 font-mono">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Differentiators ──────────────────────────────────────────────────── */
const diffs = [
  { title: '台词零篡改', desc: '全流程台词只做传递，LLM 不被允许改写' },
  { title: '三层架构', desc: '识别、分析、成稿分层处理' },
  { title: '按量付费', desc: '用你自己的 API Key，不收平台费' },
  { title: '本地运行', desc: '跑在你的 mac 上，极致的速度' },
  { title: '投稿格式', desc: '自动输出行业标准投稿模板格式' },
  { title: '质量红线', desc: 'recall ≥ 95%  ·  tamper = 0 强制校验' },
]

function Differentiators() {
  return (
    <section className="py-28 px-6 bg-warm-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="label-caps mb-4 text-center">Why Kimidance</div>
        <h2 className="text-editorial text-3xl sm:text-4xl font-bold text-center mb-16">
          为什么选积米
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {diffs.map((d) => (
            <div key={d.title}>
              <h3 className="text-cream font-semibold text-base mb-1.5">
                {d.title}
              </h3>
              <p className="text-sm copy-readable">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Who ──────────────────────────────────────────────────────────────── */
const personas = [
  { label: '短剧编剧', desc: '快速拆解竞品剧本结构' },
  { label: '漫剧制片', desc: '批量生成分镜速查表' },
  { label: '剧本写手', desc: '从爆款视频学节奏设计' },
  { label: '影视教学', desc: 'AI 辅助拉片作业' },
]

function ForWho() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="label-caps mb-4">For Who</div>
        <h2 className="text-editorial text-3xl sm:text-4xl font-bold mb-14">
          谁在用
        </h2>
        <div className="flex flex-wrap justify-center gap-5">
          {personas.map((p) => (
            <div
              key={p.label}
              className="px-7 py-5 rounded-2xl surface-glass-soft hover:border-primary/35 transition-all text-left min-w-[180px]"
            >
              <div className="text-cream font-semibold text-base mb-1">{p.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border/40 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <p className="text-xs text-muted-foreground/70 text-center max-w-xl mx-auto leading-relaxed">
          积米律动（Kimidance）是一款 AI
          拉片工具：输入一部短剧或长视频，自动输出文学剧本、叙事节奏分析和分镜速查表，全程台词零篡改。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <a href="/what-is-ai-lapian/" className="hover:text-cream transition-colors">
            什么是 AI 拉片
          </a>
          <a href="/about/" className="hover:text-cream transition-colors">
            关于积米律动
          </a>
          <a
            href="https://github.com/rusomacdalena-coder/kimi-dance-intro"
            className="hover:text-cream transition-colors"
            rel="noopener"
          >
            GitHub
          </a>
          <a
            href="mailto:oliverzhu929598@gmail.com"
            className="hover:text-cream transition-colors"
          >
            oliverzhu929598@gmail.com
          </a>
        </div>
        <div className="text-xs text-muted-foreground/50 text-center">
          &copy; 2026 积米律动 &middot; Kimidance
        </div>
      </div>
    </footer>
  )
}

/* ─── Landing Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Features />
      <Workflow />
      <ProductPreview />
      <Differentiators />
      <SamplePreview />
      <ForWho />

      {/* Beta form */}
      <section id="beta" className="py-28 px-6 scroll-mt-20 bg-warm-gradient">
        <div className="max-w-xl mx-auto">
          <div className="label-caps mb-4 text-center">Join Beta</div>
          <h2 className="text-editorial text-3xl sm:text-4xl font-bold text-center mb-3">
            申请内测名额
          </h2>
          <p className="text-center copy-readable mb-12">
            目前仅限 Mac 用户，Windows 版即将到来
          </p>
          <BetaForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
