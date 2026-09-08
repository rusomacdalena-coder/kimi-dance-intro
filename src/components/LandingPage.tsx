import { useEffect, useRef, useState } from 'react'
import HeroFilm from './hero/HeroFilm'
import SamplePreview from './SamplePreview'
import { BETA_MAILTO } from '../lib/links.mjs'

/* 首页三屏（判断层 2026-09-08「官网收缩第二包」第 1 部分定稿；文案一字不改） */

const DOWNLOAD_URL = 'https://kimidance.com/download/'

const NAV = [
  { label: '产出示例', href: '#sample' },
  { label: '案例库', href: '/cases/' },
  { label: '下载', href: '/download/' },
]

/* ─── Nav ─────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-background/95 border-b border-border' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="积米律动" className="w-8 h-8" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tracking-wide text-cream">积米律动</span>
            <span className="text-xs text-muted-foreground">Kimidance</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-cream transition-colors">
              {l.label}
            </a>
          ))}
          <a href={BETA_MAILTO} className="btn-primary btn-sm">
            申请邀请码
          </a>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
          type="button"
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
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm text-muted-foreground hover:text-cream"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href={BETA_MAILTO} className="block text-sm text-muted-foreground hover:text-cream" onClick={() => setMenuOpen(false)}>
            申请邀请码
          </a>
        </div>
      )}
    </nav>
  )
}

/* ─── 第一屏 ───────────────────────────────────────────────────────────── */
function Hero({ heroRef }: { heroRef: React.RefObject<HTMLElement> }) {
  return (
    <section ref={heroRef} className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div>
          <div className="kd-label">—— 积米律动 · AI 拉片工具</div>
          <h1 className="text-editorial font-bold text-[32px] leading-[1.25] sm:text-4xl md:text-5xl md:leading-[1.2] mt-4">
            爆款的剧本没人会给你。那就把它变回剧本。
          </h1>
          <p className="copy-readable text-base md:text-lg mt-5">
            积米律动把一部你想学的剧——短剧或长视频——直接变成文学剧本、叙事节奏分析、分镜速查表。台词不经 AI 改写。
          </p>
          <div className="mt-7 flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
            <a href={DOWNLOAD_URL} className="btn-primary">
              下载客户端 · Mac / Windows
            </a>
            <a href={BETA_MAILTO} className="btn-secondary">
              没有邀请码？写邮件申请 →
            </a>
          </div>
          <p className="mt-4 text-xs md:text-sm text-muted-foreground">
            公测中 · 注册赠 100 积分 · ¥1 / 视频分钟 · 任务开始前先看费用预估
          </p>
        </div>
        <div>
          <HeroFilm />
        </div>
      </div>
    </section>
  )
}

/* ─── 第三屏 ───────────────────────────────────────────────────────────── */
function Block({ label, children, id }: { label: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="scroll-mt-20">
      <div className="kd-label">—— {label}</div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function ThirdScreen() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-3xl mx-auto space-y-14">
        <Block label="怎么用">
          <p className="copy-readable text-base md:text-lg">
            选一个本地视频 → 确认费用预估 → 任务完成后打开成品文件夹（剧本 .md ／ 叙事分析 .md ／ 分镜表 .csv）
          </p>
        </Block>

        <Block label="三件产物">
          <ul className="copy-readable text-base md:text-lg space-y-3">
            <li>文学剧本——场头、△ 动作行、角色台词、OS/VO 标记，按行业通用剧本模板输出。</li>
            <li>叙事节奏分析——钩子、冲突点、高潮、情绪曲线。</li>
            <li>分镜速查表——每镜一行：景别、运镜、角色、台词、情绪、叙事功能，CSV。</li>
          </ul>
        </Block>

        <Block label="使用须知" id="about">
          <p className="copy-readable text-base md:text-lg">
            积米律动是一个拉片学习工具。你上传的视频，版权属于原作者或版权方；工具输出的剧本、叙事分析和分镜表，仅供个人学习、研究和教学参考，请勿用于商业发行、署名投稿或任何侵犯原作品权利的用途。使用本工具即表示你已了解并同意以上说明。
          </p>
        </Block>

        <Block label="名字">
          <p className="copy-readable text-base md:text-lg">
            积米对字节，律动对跳动——把奔流而过的视频，一颗一颗积回可以阅读的剧本。Kimidance 与舞蹈无关。
          </p>
        </Block>

        <p className="text-sm text-muted-foreground">
          联系：<a href="mailto:oliverzhu929598@gmail.com" className="underline underline-offset-4 text-cream">oliverzhu929598@gmail.com</a>
        </p>
      </div>
    </section>
  )
}

/* ─── Footer ───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <a href="/what-is-ai-lapian/" className="hover:text-cream transition-colors">AI 拉片</a>
          <span>·</span>
          <a href="/cases/" className="hover:text-cream transition-colors">案例库</a>
          <span>·</span>
          <a href="/download/" className="hover:text-cream transition-colors">下载</a>
        </div>
        <div>kimidance.com · 积米律动 · Get your hands dirty</div>
      </div>
    </footer>
  )
}

/* ─── 手机端底部固定栏：滚过第一屏后出现 ───────────────────────────────── */
function StickyCta({ heroRef }: { heroRef: React.RefObject<HTMLElement> }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const h = () => {
      const el = heroRef.current
      const limit = el ? el.offsetTop + el.offsetHeight - 64 : 600
      setShow(window.scrollY > limit)
    }
    h()
    window.addEventListener('scroll', h, { passive: true })
    window.addEventListener('resize', h)
    return () => {
      window.removeEventListener('scroll', h)
      window.removeEventListener('resize', h)
    }
  }, [heroRef])
  if (!show) return null
  return (
    <div className="md:hidden kd-sticky-cta">
      <a href={DOWNLOAD_URL} className="btn-primary">
        下载客户端 · Mac / Windows
      </a>
    </div>
  )
}

/* ─── Landing Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null)
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero heroRef={heroRef} />
      <SamplePreview />
      <ThirdScreen />
      <Footer />
      <StickyCta heroRef={heroRef} />
    </div>
  )
}
