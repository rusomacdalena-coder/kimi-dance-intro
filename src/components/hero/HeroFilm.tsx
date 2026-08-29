import { useEffect, useRef, useState } from 'react'

import { HeroStage } from './heroRuntime'
import { KimidanceHeroPiece } from './KimidanceHeroLoop'
import './hero.css'

/* Scene table verbatim from the dc composition's window.OM_SCENES
   (Kimidance Hero Loop.dc.html) — names and durations are the film's
   authored cue grid (总长 12.0s); descriptions dropped, ccDerive ignores
   them. OM_PLAYBACK was {"mode":"loop"}; the loop lives in HeroStage. */
const SCENES = [
  { name: '开场', dur: 2.2 },
  { name: '拉开', dur: 2 },
  { name: '三步', dur: 1.8 },
  { name: '产出', dur: 2.6 },
  { name: '信任', dur: 2.2 },
  { name: '收尾', dur: 1.2 },
]

const W = 1920

/* The four single-plate separation filters, verbatim matrices from the
   Broadsheet design system's print-plates defs (_ds_bundle.js). Only the
   per-plate filters are ported — #sep-all and the hover press driver are
   template-page features the film does not use. */
function SepDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter colorInterpolationFilters="sRGB" id="sep-c"><feColorMatrix type="matrix" values="1 0 0 0 0  0.467 0 0 0 0.533  0.310 0 0 0 0.690  0 0 0 0 1" /></filter>
        <filter colorInterpolationFilters="sRGB" id="sep-m"><feColorMatrix type="matrix" values="0 0.161 0 0 0.839  0 1 0 0 0  0 0.576 0 0 0.424  0 0 0 0 1" /></filter>
        <filter colorInterpolationFilters="sRGB" id="sep-y"><feColorMatrix type="matrix" values="0 0 0.071 0 0.929  0 0 0.267 0 0.733  0 0 1 0 0  0 0 0 0 1" /></filter>
        <filter colorInterpolationFilters="sRGB" id="sep-k"><feColorMatrix type="matrix" values="0.112 0.375 0.038 0 0.475  0.113 0.379 0.038 0 0.471  0.113 0.380 0.038 0 0.468  0 0 0 0 1" /></filter>
        {/* ink-edition additive plates: disjoint channels, screen-recombine */}
        <filter colorInterpolationFilters="sRGB" id="sep-r"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" /></filter>
        <filter colorInterpolationFilters="sRGB" id="sep-g"><feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0 1" /></filter>
        <filter colorInterpolationFilters="sRGB" id="sep-b"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0 1" /></filter>
      </defs>
    </svg>
  )
}

function reduceMotionPreferred(): boolean {
  /* test hooks mirroring the OS preference: ?kd-motion=reduce and
     html[data-kd-motion="reduce"] force the same static-first-frame path
     the media query takes, so the fallback is verifiable in any browser. */
  const forced = new URLSearchParams(window.location.search).get('kd-motion')
  if (forced === 'reduce') return true
  if (forced === 'allow') return false
  if (document.documentElement.dataset.kdMotion === 'reduce') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* The hero film island. Server-side (and before hydration) it renders the
   film at T=0 — the authored first frame (frame 0 === frame 12), scaled by
   the CSS fallback ladder in hero.css — so the first paint is never blank
   and never overflows. After mount a ResizeObserver replaces the ladder
   with the exact scale; prefers-reduced-motion (or the html[data-kd-motion]
   test hook) keeps the clock stopped on that same static first frame. */
export default function HeroFilm() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const apply = () => setPlaying(!reduceMotionPreferred())
    apply()
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setScale(el.clientWidth / W)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [])

  return (
    <div
      aria-label="积米律动产品演示：12 秒印刷风循环短片——短剧关键帧被拆成印刷分色版，再产出文学剧本、三步流程与台词零篡改承诺"
      className="kd-heroloop"
      ref={boxRef}
      role="img"
    >
      <div aria-hidden="true" className="kd-heroloop-stage" style={scale > 0 ? { transform: `scale(${scale})` } : undefined}>
        <SepDefs />
        <HeroStage playing={playing} scenes={SCENES}>
          <KimidanceHeroPiece />
        </HeroStage>
      </div>
    </div>
  )
}
