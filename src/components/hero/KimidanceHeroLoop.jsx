/* kimidance 落地页 Hero 循环片 v2 — 12s / 1920×1080 / 纸白印张
   动效原则：一台摄影机 + 一台印刷机。
   摄影机有分镜（推入分色版、推入剧本页、拉开看深色块），机器有重量（套准是砸回去的，
   纸页落下时整张纸会震一下），字是被印上去的（clip 擦过 + 领头的墨条），不是淡入的。
   All choreography keyed to T + CUES (authored seconds); frame 0 === frame 12.

   Site port of the dc composition (source: Animate 品牌风格指南.zip
   kimidance-hero.jsx, sha256 0ae437ce…c586). Three deliberate edits, body
   otherwise verbatim: (1) globals from the dc runtime become imports from
   ./heroRuntime; (2) frameSrc points at the local webp frames instead of
   window.KD_FRAMES; (3) the CompositionStage wrapper + window export are
   replaced by a named export — HeroFilm.tsx owns the stage. */
import { animate, Easing, clamp, useComposition } from './heroRuntime'

const W = 1920, H = 1080;

const INK = 'var(--color-text)';
const PAPER = 'var(--color-bg)';
const SHEET = 'var(--color-neutral-100)';   /* the white of a printed sheet on the page */
const MUTE = 'var(--color-neutral-600)';
const QUIET = 'var(--color-neutral-700)';
const RULE = 'var(--color-neutral-400)';    /* decorative hairlines only, never type */
const HAIR = 'var(--color-neutral-300)';

/* var(--font-heading) can't be used verbatim here: its own fallback is system-ui,
   which would capture CJK before any serif. Same Source Serif 4 head, with the
   CJK serif spliced in ahead of the generic fallbacks. */
const SERIF = '"Source Serif 4","Noto Serif SC",Georgia,serif';

/* the only four curves in this film */
const MOTION = {
  enter: (start, dur, from, to) =>
    animate({ from, to, start, end: start + dur, ease: Easing.easeOutCubic }),
  glide: (start, dur, from, to) =>
    animate({ from, to, start, end: start + dur, ease: Easing.easeInOutCubic }),
  strike: (start, dur, from, to) =>
    animate({ from, to, start, end: start + dur, ease: Easing.easeInQuart }),
  pop: (start, dur, from, to) =>
    animate({ from, to, start, end: start + dur, ease: Easing.easeOutBack }),
};

/* piecewise keyframe track built only out of MOTION.glide deltas */
function track(T, keys) {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (b[1] !== a[1]) v += MOTION.glide(a[0], b[0] - a[0], 0, b[1] - a[1])(T);
  }
  return v;
}

/* Real keyframes out of the tool's own shot detector (results/…/keyframes),
   printed through the design system's .cmyk separation. Shot ids, 景别,
   运镜 and 情绪 are read verbatim from the run's own shot_annotations /
   annotate_cache — nothing here is assigned by eye. */
const frameSrc = (n) => `/hero/shot_${n}.webp`;

const FRAMES = [
  { n: '003', size: '远景', cam: '固定', mood: '对峙/开启' },
  { n: '014', size: '近景', cam: '固定', mood: '赏识/深沉' },
  { n: '027', size: '全景', cam: '固定', mood: '平静' },
  { n: '028', size: '中景', cam: '推', mood: '从容' },
];
const SHOT_TOTAL = 39;

const FW = 163, FH = 290;

/* The system leaves plate offsets to the page but fixes their SCALE: its own
   plate rules translate by 0.018–0.036em — a few percent of the element, "a
   few pixels out of register". So misregistration here is a fraction of the
   frame, with the direction vectors normalised so the two extreme plates sit
   exactly MISREG apart. Never an absolute pixel amount. */
const MISREG = 0.028;
const PLATE_VEC = {
  'sep-k': [0, 0],
  'sep-c': [-0.138, 0.106],
  'sep-m': [0.438, 0.308],
  'sep-y': [-0.373, -0.276],
};

function Frame({ src, sp, ken }) {
  const plate = (cls) => (
    <img key={cls} className={cls} src={src} alt=""
      style={{ transform: `translate(${PLATE_VEC[cls][0] * sp}px, ${PLATE_VEC[cls][1] * sp}px) scale(${ken})` }} />
  );
  return (
    <figure className="cmyk" style={{
      position: 'relative', width: FW, height: FH, margin: 0, overflow: 'hidden',
      border: `1px solid ${INK}`, boxSizing: 'border-box',
    }}>
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {plate('sep-k')}
      {plate('sep-c')}
      {plate('sep-m')}
      {plate('sep-y')}
    </figure>
  );
}

function RegTarget({ left, top }) {
  return (
    <div style={{ position: 'absolute', left, top, width: 22, height: 22 }}>
      <div style={{ position: 'absolute', left: 10, top: 0, width: 1, height: 22, background: RULE }} />
      <div style={{ position: 'absolute', left: 0, top: 10, width: 22, height: 1, background: RULE }} />
      <div style={{ position: 'absolute', left: 4, top: 4, width: 13, height: 13, border: `1px solid ${RULE}`, borderRadius: '50%' }} />
    </div>
  );
}

function Micro({ children, style }) {
  return (
    <div style={{
      fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: '0.3em',
      textTransform: 'uppercase', color: MUTE, ...style,
    }}>{children}</div>
  );
}

/* Verbatim from the same run's 03+拉片.md — the script these frames produced. */
const SCRIPT_FILE = '03+拉片.md';
const SCRIPT_LINES = [
  { k: 'slug', t: '场1-1  日  外  城墙顶端', gap: 0.00 },
  { k: 'cast', t: '人物：沈远峰，银湖', gap: 0.20 },
  { k: 'act', t: '△ 银湖神情肃穆地背手站立，目光深邃。', gap: 0.16 },
  { k: 'dlg', t: '银湖（严肃有威信，看向前方）：寻龙千万 看蝉山', gap: 0.34 },
  { k: 'act', t: '△ 沈远峰眼神有些呆滞，显得错愕而不知所措。', gap: 0.16 },
  { k: 'dlg', t: '沈远峰（微张嘴巴）：土 土行', gap: 0.30 },
];

const STEPS = [
  { n: '01', t: '语音转录 · 切镜', s: 'Layer 0' },
  { n: '02', t: '逐镜头标注', s: 'Layer 1' },
  { n: '03', t: '剧本生成', s: 'Layer 2' },
];

export function KimidanceHeroPiece(props) {
  const { T, CUES, authoredTotal } = useComposition();
  const C = {
    pull: CUES['拉开'], steps: CUES['三步'],
    out: CUES['产出'], trust: CUES['信任'], end: CUES['收尾'],
  };
  const total = authoredTotal || 12;
  const cl = (v) => clamp(v, 0, 1);

  const plateMode = props.plateBreak || '一次';
  const plateOn = plateMode !== '不用';
  const plateAlways = plateMode === '全片';
  const voidOn = props.darkBlock !== false;

  /* ——— camera: a shot list, not a static frame ———
     Each keyframe is [t, scale, focusX, focusY] in sheet coordinates. The big
     push (拉开) is framed so the headline leaves frame entirely — the close-up
     is pure plate detail; every other move is a slow sheet push that keeps the
     whole column on the paper. */
  const camScale = track(T, [
    [0, 1], [C.pull + 0.15, 1.045], [C.pull + 0.85, 2.1], [C.steps - 0.15, 2.1],
    [C.steps + 0.25, 1.03], [C.out + 0.05, 1.03], [C.out + 0.95, 1.062],
    [C.trust - 0.3, 1.078], [C.trust, 1], [total, 1],
  ]);
  const camFx = track(T, [
    [0, 960], [C.pull + 0.15, 1000], [C.pull + 0.85, 1440], [C.steps - 0.15, 1455],
    [C.steps + 0.25, 960], [C.out + 0.05, 960], [C.out + 0.95, 998],
    [C.trust - 0.3, 1006], [C.trust, 960], [total, 960],
  ]);
  const camFy = track(T, [
    [0, 540], [C.pull + 0.15, 520], [C.pull + 0.85, 380], [C.steps - 0.15, 372],
    [C.steps + 0.25, 536], [C.out + 0.05, 536], [C.out + 0.95, 528],
    [C.trust - 0.3, 526], [C.trust, 540], [total, 540],
  ]);
  const camTx = -(camFx * camScale - W / 2);
  const camTy = -(camFy * camScale - H / 2);
  /* press impact — the sheet jolts when metal lands */
  const jolt = (t0, amp) =>
    amp * (MOTION.pop(t0, 0.07, 0, 1)(T) - MOTION.glide(t0 + 0.07, 0.3, 0, 1)(T));
  const shake = jolt(C.pull + 1.74, 4) + jolt(C.out + 0.66, 2.6) + jolt(C.trust + 0.5, 3.4);

  /* ——— the frame, and the one chroma beat ——— */
  const breathe = 1 + 0.02 * (0.5 - 0.5 * Math.cos((2 * Math.PI * T) / total));
  const out = cl(MOTION.pop(C.pull, 0.62, 0, 1)(T));          // plates fly apart, overshoot
  const back = cl(MOTION.strike(C.pull + 1.28, 0.48, 0, 1)(T)); // and are slammed into register
  const sep = cl(out - back);
  const spread = FW * MISREG * (plateOn ? (plateAlways ? 0.35 + 0.65 * sep : sep) : 0);
  const flash = cl(MOTION.enter(C.pull + 1.7, 0.05, 0, 1)(T)) * (1 - cl(MOTION.glide(C.pull + 1.76, 0.18, 0, 1)(T)));

  /* 开场 — the reading pass down the frame */
  const scan = MOTION.glide(0.4, 1.4, 0, 1)(T);
  const scanAlpha = scan > 0 && scan < 1 ? 1 : 0;

  /* 三步 — one hairline sweeps the column; numerals snap as it crosses them */
  const sweep = cl(MOTION.glide(C.steps + 0.1, 1.05, 0, 1)(T));
  const sweepOut = cl(MOTION.strike(C.end + 0.25, 0.6, 0, 1)(T));
  const sweepAlpha = sweep > 0 && sweep < 1 ? 1 : 0;

  /* 产出 — the page comes off the press, then the lines are printed on */
  const pageUp = 1 - cl(MOTION.enter(C.out, 0.66, 0, 1)(T)) + cl(MOTION.strike(C.end + 0.15, 0.8, 0, 1)(T));
  const ruleW = MOTION.glide(C.out + 0.5, 0.75, 0, 540)(T) - MOTION.strike(C.end + 0.3, 0.6, 0, 540)(T);

  /* 信任 — the one dark block: drops with weight, leaves in a hurry */
  const voidDrop = cl(MOTION.pop(C.trust + 0.1, 0.6, 0, 1)(T));
  const voidGone = cl(MOTION.strike(C.end, 0.52, 0, 1)(T));
  const tally = Math.round(MOTION.glide(C.trust + 0.5, 0.9, 0, 60)(T));
  const checkW = cl(MOTION.glide(C.trust + 0.85, 0.45, 0, 1)(T) - MOTION.strike(C.end - 0.15, 0.4, 0, 1)(T));

  const tc = `00:00:${String(Math.floor(T)).padStart(2, '0')}:${String(Math.floor((T % 1) * 25)).padStart(2, '0')}`;
  const grainStep = Math.floor(T * 12) % 6;

  return (
    <div data-screen-label={`T ${T.toFixed(1)}s`} style={{
      position: 'absolute', inset: 0, background: PAPER,
      fontFamily: SERIF, color: INK, overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translate(${camTx}px, ${camTy + shake}px) scale(${camScale})`,
        transformOrigin: '0 0',
      }}>
        <RegTarget left={40} top={40} />
        <RegTarget left={W - 62} top={40} />
        <RegTarget left={40} top={H - 62} />
        <RegTarget left={W - 62} top={H - 62} />

        {/* masthead — the one place rules print: thick over thin */}
        <Micro style={{ position: 'absolute', left: 140, top: 62, fontSize: 24, letterSpacing: '0.34em', color: INK, fontWeight: 700 }}>
          积米律动 · KIMIDANCE
        </Micro>
        <div style={{ position: 'absolute', left: 140, top: 108, width: W - 280, height: 3, background: INK }} />
        <div style={{ position: 'absolute', left: 140, top: 117, width: W - 280, height: 1, background: INK }} />
        <div style={{
          position: 'absolute', right: 140, top: 60, fontSize: 24, letterSpacing: '0.16em',
          color: MUTE, fontVariantNumeric: 'tabular-nums',
        }}>{tc}</div>

        {/* headline */}
        <div style={{ position: 'absolute', left: 140, top: 186, width: 830 }}>
          <div style={{ fontSize: 88, lineHeight: 1.14, fontWeight: 400, color: MUTE, letterSpacing: '0.01em' }}>
            别人的爆款视频
          </div>
          <div style={{
            fontSize: 104, lineHeight: 1.1, fontWeight: 700, color: INK, marginTop: 6,
            letterSpacing: '0.01em', transform: `scale(${breathe})`, transformOrigin: 'left center',
          }}>
            你的文学剧本
          </div>
          <div style={{ width: Math.max(0, ruleW), height: 3, background: INK, marginTop: 18 }} />
        </div>

        <div style={{
          position: 'absolute', left: 142, top: 486, width: 700,
          fontSize: 28, lineHeight: 1.62, color: MUTE, textWrap: 'pretty',
        }}>
          全自动 AI 拉片工具。输入一个短剧视频，输出投稿级文学剧本、叙事分析、分镜速查表。
        </div>

        {/* 三步 — driven by the single sweeping hairline */}
        <div style={{ position: 'absolute', left: 142, top: 596, width: 720, height: 190 }}>
          <div style={{
            position: 'absolute', left: sweep * 700, top: 8, width: 1, height: 128,
            background: INK, opacity: sweepAlpha * 0.6,
          }} />
          <div style={{ position: 'absolute', left: 0, top: 14, display: 'flex', gap: 64 }}>
            {STEPS.map((s, i) => {
              const gate = cl((sweep - (0.1 + i * 0.3)) / 0.14) - sweepOut;
              const a = cl(gate);
              return (
                <div key={s.n} style={{ opacity: a, transform: `translateY(${(1 - a) * 10}px)` }}>
                  <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.n}</div>
                  <div style={{ width: 34 * a, height: 1, background: INK, margin: '14px 0 12px' }} />
                  <div style={{ fontSize: 25, color: INK, whiteSpace: 'nowrap' }}>{s.t}</div>
                  <Micro style={{ fontSize: 22, marginTop: 6, letterSpacing: '0.24em', color: MUTE }}>{s.s}</Micro>
                </div>
              );
            })}
          </div>
        </div>

        {/* right column — four real keyframes, pulled apart into plates */}
        <div style={{ position: 'absolute', left: 1080, top: 186, width: 700 }}>
          <div style={{ position: 'relative', width: 700, height: FH }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {FRAMES.map((f, i) => (
                <div key={f.n}>
                  <Frame src={frameSrc(f.n)} sp={spread}
                    ken={1 + 0.05 * (0.5 - 0.5 * Math.cos(2 * Math.PI * (T / total + i * 0.25)))} />
                </div>
              ))}
            </div>
            <div style={{
              position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 74,
              marginTop: -74, opacity: scanAlpha * 0.45, mixBlendMode: 'screen',
              backgroundImage: 'linear-gradient(to top, var(--color-neutral-500), transparent)',
            }} />
            <div style={{
              position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 2,
              background: INK, opacity: scanAlpha,
            }} />
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
            {FRAMES.map((f) => (
              <div key={f.n} style={{ width: FW }}>
                <Micro style={{ fontSize: 22, color: INK, letterSpacing: '0.2em' }}>SHOT {f.n}</Micro>
                <div style={{ fontSize: 24, color: INK, marginTop: 5 }}>{f.size} · {f.cam}</div>
                <div style={{ fontSize: 22, color: MUTE, marginTop: 3 }}>{f.mood}</div>
              </div>
            ))}
          </div>

          <div style={{
            position: 'absolute', left: 0, top: 512, width: 700,
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          }}>
            <div style={{ fontSize: 25, color: MUTE }}>{SHOT_TOTAL} 个镜头 · 景别、运镜、角色、情绪已标注</div>
            <Micro style={{ fontSize: 22, color: MUTE, opacity: cl(sep * 1.6) }}>SEPARATION</Micro>
          </div>

          {/* the page that comes off the press */}
          <div style={{ position: 'absolute', left: -1, top: -35, width: 702, height: 522, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 1, top: 1, width: 700, height: 520,
              background: SHEET, border: `1px solid ${HAIR}`,
              transform: `translateY(${cl(pageUp) * 560}px)`,
              padding: '34px 40px', boxSizing: 'border-box',
            }}>
              <Micro style={{ fontSize: 22, color: MUTE, marginBottom: 26, textTransform: 'none' }}>{SCRIPT_FILE}</Micro>
              {SCRIPT_LINES.map((l, i) => {
                const at = C.out + 0.72 + SCRIPT_LINES.slice(0, i + 1).reduce((a, x) => a + x.gap, 0) + i * 0.14;
                const p = cl(MOTION.glide(at, 0.34, 0, 1)(T));
                return (
                  <div key={i} style={{
                    position: 'relative',
                    fontSize: l.k === 'slug' ? 28 : 25,
                    fontWeight: l.k === 'slug' ? 700 : 400,
                    color: l.k === 'act' ? MUTE : INK,
                    lineHeight: 1.5,
                    marginBottom: l.k === 'slug' ? 16 : 12,
                  }}>
                    {/* printed on: the ink is wiped across, a bar leading it */}
                    <div style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{l.t}</div>
                    {p > 0 && p < 1 && (
                      <div style={{
                        position: 'absolute', left: `${p * 100}%`, top: 2, width: 2, bottom: 2, background: INK,
                      }} />
                    )}
                    {i === 3 && (
                      <div style={{
                        position: 'absolute', left: 0, bottom: -3, height: 2,
                        width: `${checkW * 100}%`, background: INK,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 信任 — the single dark void block */}
        {voidOn && (
          <div style={{
            position: 'absolute', left: 140, top: 858, width: W - 280, height: 128,
            overflow: 'hidden',
            clipPath: `inset(0 ${voidGone * 100}% 0 0)`,
          }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, width: '100%', height: 160,
            background: INK, color: PAPER,
            transform: `translateY(${(1 - voidDrop) * 128}px)`,
            display: 'flex', alignItems: 'center', gap: 44,
            padding: '0 40px 32px', boxSizing: 'border-box',
          }}>
            <Micro style={{ fontSize: 22, color: 'var(--lq-onvoid)', letterSpacing: '0.32em' }}>TRUST</Micro>
            <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '0.02em' }}>台词零篡改</div>
            <div style={{ marginLeft: 'auto', fontSize: 28, color: 'var(--lq-onvoid)', fontVariantNumeric: 'tabular-nums' }}>
              {tally}/60 句一字未改 · 8 分钟测试视频
            </div>
          </div>
          </div>
        )}

        <div style={{
          position: 'absolute', left: 142, bottom: 44, display: 'flex', alignItems: 'baseline', gap: 26,
        }}>
          <div style={{ fontSize: 24, color: MUTE, letterSpacing: '0.08em' }}>kimidance.com · 积米律动</div>
          <div style={{ fontSize: 24, color: QUIET, fontStyle: 'italic' }}>Get your hands dirty.</div>
        </div>
      </div>

      {/* newsprint grain, stepped — lives on the paper, not in the camera */}
      <div style={{
        position: 'absolute', inset: -8, opacity: 0.05, mixBlendMode: 'screen',
        backgroundImage: 'radial-gradient(circle, var(--color-neutral-900) 22%, transparent 24%)',
        backgroundSize: '3px 3px',
        backgroundPosition: `${grainStep * 0.7}px ${(grainStep * 1.3) % 3}px`,
      }} />
      {/* register slam — one frame of extra ink through the whole sheet */}
      <div style={{
        position: 'absolute', inset: 0, background: INK,
        opacity: flash * 0.055, mixBlendMode: 'screen',
      }} />
    </div>
  );
}
