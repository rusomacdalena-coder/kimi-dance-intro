/* Minimal composition runtime for the hero film.
 * Easing / clamp / animate / ccDerive / ccWarp are VERBATIM from the dc
 * runtime (animations-v3.jsx) so the film's authored timing is reproduced
 * exactly; the player chrome (Stage/PlaybackBar/Captions/export plumbing)
 * is deliberately not ported. HeroStage is the site-side replacement:
 * a rAF clock over the scene table plus the same composition context
 * contract ({T, CUES, authoredTotal, ...}) the film was authored against.
 */
import React from 'react'

export const Easing = {
  linear: (t) => t,

  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1
    return c3 * t * t * t - c1 * t * t
  },
}

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

export function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from
    if (t >= end) return to
    const local = (t - start) / (end - start)
    return from + (to - from) * ease(local)
  }
}

function ccDerive(scenes) {
  let playStart = 0
  let authStart = 0
  const sections = []
  const table = Object.create(null)
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i]
    const nat = typeof s.nat === 'number' && isFinite(s.nat) && s.nat > 0 ? s.nat : s.dur
    sections.push({ name: s.name, playStart, dur: s.dur, authStart, nat })
    if (!Object.prototype.hasOwnProperty.call(table, s.name)) {
      table[s.name] = Math.round(authStart * 1000) / 1000
    }
    playStart += s.dur
    authStart += nat
  }
  return {
    sections,
    table,
    total: Math.round(playStart * 1000) / 1000,
    authoredTotal: Math.round(authStart * 1000) / 1000,
  }
}

function ccWarp(d, t) {
  const ss = d.sections
  if (ss.length === 0) return 0
  let idx = ss.length - 1
  for (let i = 0; i < ss.length; i++) {
    if (t < ss[i].playStart + ss[i].dur) { idx = i; break }
  }
  const s = ss[idx]
  const local = Math.min(Math.max(t - s.playStart, 0), s.dur)
  const T = s.authStart + (s.dur > 0 ? local * (s.nat / s.dur) : 0)
  return Math.min(T, d.authoredTotal)
}

const CompositionContext = React.createContext(null)

export function useComposition() {
  const ctx = React.useContext(CompositionContext)
  if (!ctx) throw new Error('useComposition() must be called inside <HeroStage>')
  return ctx
}

export function HeroStage({ scenes, playing, children }) {
  const derived = React.useMemo(() => ccDerive(scenes), [scenes])
  const [time, setTime] = React.useState(0)

  React.useEffect(() => {
    if (!playing) { setTime(0); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (now) => {
      setTime(((now - t0) / 1000) % derived.total)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, derived])

  const T = ccWarp(derived, time)
  const value = React.useMemo(() => ({
    T,
    CUES: derived.table,
    time,
    duration: derived.total,
    authoredTotal: derived.authoredTotal,
    playing,
  }), [T, derived, time, playing])

  return <CompositionContext.Provider value={value}>{children}</CompositionContext.Provider>
}
