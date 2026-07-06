import { useState, useEffect, useCallback } from 'react'

const slides = [
  {
    src: '/preview/01-dashboard.png',
    label: '工作台',
    desc: '今日任务一览、实时处理进度、本月开销统计',
  },
  {
    src: '/preview/02-new-task.png',
    label: '新建任务',
    desc: '拖入视频，选择云端或本机处理通道',
  },
  {
    src: '/preview/03-processing.png',
    label: '实时处理',
    desc: '逐 batch 日志流、分步进度、费用实时预估',
  },
  {
    src: '/preview/04-result.png',
    label: '产出结果',
    desc: '剧本在线阅读、质量红线校验、一键导出 ZIP',
  },
  {
    src: '/preview/05-history.png',
    label: '历史档案',
    desc: '全部任务状态追踪，筛选排序、导出 CSV',
  },
  {
    src: '/preview/07-login.png',
    label: '登录',
    desc: '邮箱密码、微信扫码、Google / GitHub 一键登录',
  },
]

const INTERVAL = 4500

export default function ProductPreview() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [])

  /* auto‑play */
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = slides[current]

  return (
    <section id="preview" className="py-28 px-6 scroll-mt-20 bg-warm-gradient">
      <div className="max-w-6xl mx-auto">
        <div className="label-caps mb-4 text-center">Product Preview</div>
        <h2 className="text-editorial text-3xl sm:text-4xl font-bold text-center mb-3">
          看看你将用到的工坊
        </h2>
        <p className="text-center copy-readable mb-14 max-w-lg mx-auto">
          从登录到交付，全流程在浏览器里完成
        </p>

        {/* ── Carousel ── */}
        <div
          className="relative group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* macOS-style window chrome */}
          <div className="rounded-xl preview-frame overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(20,8%,7%)]/85 border-b border-border/60">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="flex-1 text-center text-xs text-muted-foreground/60 truncate">
                kimidance — {slide.label}
              </span>
            </div>

            {/* Image area */}
            <div className="relative aspect-[16/10] bg-black overflow-hidden">
              {slides.map((s, i) => (
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.label}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`preview-image absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
                    i === current ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              {/* Prev / Next arrows — visible on hover */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="上一张"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="下一张"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Caption + dots */}
          <div className="mt-6 flex flex-col items-center gap-4">
            {/* Caption */}
            <div className="text-center">
              <span className="text-sm font-semibold text-cream">{slide.label}</span>
              <span className="text-sm text-muted-foreground ml-3">{slide.desc}</span>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`第 ${i + 1} 张`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
