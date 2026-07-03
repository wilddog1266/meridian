import { useI18n } from '../../i18n'

const C = 300

function pt(cx: number, cy: number, angle: number, r: number) {
  return `${(cx + Math.sin(angle) * r).toFixed(2)} ${(cy - Math.cos(angle) * r).toFixed(2)}`
}

function gearPath(cx: number, cy: number, r: number, teeth: number) {
  const inner = r * 0.88
  const step = (Math.PI * 2) / teeth
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    d += `${i === 0 ? 'M' : 'L'}${pt(cx, cy, a, inner)} L${pt(cx, cy, a + step * 0.22, r)} L${pt(cx, cy, a + step * 0.5, r)} L${pt(cx, cy, a + step * 0.72, inner)} `
  }
  return d + 'Z'
}

function circleSub(cx: number, cy: number, r: number) {
  return `M${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} Z`
}

function spiralPath(cx: number, cy: number) {
  let d = `M${cx} ${cy}`
  for (let t = 0; t <= Math.PI * 10; t += 0.15) {
    const r = 2 + 1.42 * t
    d += ` L${(cx + Math.cos(t) * r).toFixed(2)} ${(cy + Math.sin(t) * r).toFixed(2)}`
  }
  return d
}

function Gear({
  cx,
  cy,
  r,
  teeth,
  spinClass,
  windows = 4,
}: {
  cx: number
  cy: number
  r: number
  teeth: number
  spinClass: string
  windows?: number
}) {
  let d = gearPath(cx, cy, r, teeth) + circleSub(cx, cy, r * 0.13)
  for (let i = 0; i < windows; i++) {
    const a = (i / windows) * Math.PI * 2
    d += circleSub(cx + Math.sin(a) * r * 0.5, cy - Math.cos(a) * r * 0.5, r * 0.19)
  }
  return (
    <g className={spinClass} style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
      <path d={d} fill="url(#gearGold)" fillRule="evenodd" stroke="rgb(0 0 0 / 0.35)" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={r * 0.13 + 2.5} fill="none" stroke="var(--color-accent-dim)" strokeWidth="1" />
    </g>
  )
}

function Screw({ cx, cy, angle }: { cx: number; cy: number; angle: number }) {
  return (
    <g transform={`rotate(${angle} ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r="6.5" fill="url(#screwSteel)" stroke="rgb(0 0 0 / 0.4)" strokeWidth="0.6" />
      <line x1={cx - 4.2} y1={cy} x2={cx + 4.2} y2={cy} stroke="rgb(0 0 0 / 0.55)" strokeWidth="1.5" />
    </g>
  )
}

function Jewel({ cx, cy, r = 5.5 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="var(--color-accent-dim)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r} fill="url(#ruby)" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.28} fill="#fff" opacity="0.4" />
    </g>
  )
}

const BALANCE = { x: 192, y: 208 }
const TIMING_SCREWS = Array.from({ length: 6 }, (_, i) => i)

export default function Calibre({ className }: { className?: string }) {
  const { t } = useI18n()

  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label={t.sections.movement.calibreAria}>
      <defs>
        <linearGradient id="gearGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-accent-strong)" />
          <stop offset="0.55" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-dim)" />
        </linearGradient>
        <radialGradient id="screwSteel" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="var(--color-fg-strong)" />
          <stop offset="1" stopColor="var(--color-fg-muted)" />
        </radialGradient>
        <radialGradient id="ruby" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="#c65a6a" />
          <stop offset="1" stopColor="#7c2434" />
        </radialGradient>
        {/* перляж: перекрывающиеся шлифованные круги */}
        <pattern id="perlage" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="13" cy="13" r="12" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="6" />
          <circle cx="0" cy="0" r="12" fill="none" stroke="#fff" strokeOpacity="0.04" strokeWidth="6" />
          <circle cx="26" cy="0" r="12" fill="none" stroke="#000" strokeOpacity="0.08" strokeWidth="6" />
        </pattern>
        {/* côtes de Genève */}
        <pattern id="cotes" width="30" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <rect width="30" height="60" fill="url(#cotesStripe)" />
        </pattern>
        <linearGradient id="cotesStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id="plateShade" cx="0.4" cy="0.35" r="0.95">
          <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* ── слой 1: основная плата ── */}
      <g className="cal-layer" data-layer="plate">
        <circle cx={C} cy={C} r="232" fill="var(--color-bg-2)" />
        <circle cx={C} cy={C} r="232" fill="url(#perlage)" />
        <circle cx={C} cy={C} r="232" fill="url(#plateShade)" />
        <circle cx={C} cy={C} r="232" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
        <Screw cx={300} cy={78} angle={20} />
        <Screw cx={112} cy={390} angle={-40} />
        <Screw cx={488} cy={390} angle={75} />
        <Jewel cx={300} cy={330} />
        <Jewel cx={398} cy={262} r={4.5} />
        <Jewel cx={400} cy={352} r={4.5} />
        <Jewel cx={BALANCE.x} cy={BALANCE.y} />
      </g>

      {/* ── слой 2: колёсная передача ── */}
      <g className="cal-layer" data-layer="train">
        <Gear cx={300} cy={208} r={74} teeth={84} spinClass="cal-spin-90" windows={5} />
        <Gear cx={300} cy={330} r={58} teeth={68} spinClass="cal-spin-45r" />
        <Gear cx={398} cy={262} r={40} teeth={48} spinClass="cal-spin-22" />
        <Gear cx={400} cy={352} r={27} teeth={22} spinClass="cal-esc" windows={3} />
      </g>

      {/* ── слой 3: мосты ── */}
      <g className="cal-layer" data-layer="bridges">
        {/* мост барабана */}
        <g>
          <path
            id="barrelBridge"
            d="M132 150 Q300 62 468 150 L442 236 Q300 168 158 236 Z"
            fill="var(--color-bg-1)"
          />
          <use href="#barrelBridge" fill="url(#cotes)" />
          <use href="#barrelBridge" fill="none" stroke="var(--color-accent-dim)" strokeWidth="1" opacity="0.5" />
          <Screw cx={170} cy={186} angle={50} />
          <Screw cx={430} cy={186} angle={-15} />
        </g>
        {/* мост колёсной передачи */}
        <g>
          <path
            id="trainBridge"
            d="M472 250 Q500 330 448 404 Q400 452 342 420 Q310 396 336 340 Q356 296 340 262 Q396 218 472 250 Z"
            fill="var(--color-bg-1)"
          />
          <use href="#trainBridge" fill="url(#cotes)" />
          <use href="#trainBridge" fill="none" stroke="var(--color-accent-dim)" strokeWidth="1" opacity="0.5" />
          <Screw cx={452} cy={286} angle={10} />
          <Screw cx={372} cy={398} angle={-60} />
          <Jewel cx={398} cy={262} r={4.5} />
          <Jewel cx={400} cy={352} r={4.5} />
        </g>
        {/* ростверк центральной оси */}
        <g>
          <circle cx={300} cy={330} r="30" fill="var(--color-bg-1)" />
          <circle cx={300} cy={330} r="30" fill="url(#cotes)" />
          <circle cx={300} cy={330} r="30" fill="none" stroke="var(--color-accent-dim)" strokeWidth="1" opacity="0.5" />
          <Jewel cx={300} cy={330} />
        </g>
      </g>

      {/* ── слой 4: баланс ── */}
      <g className="cal-layer" data-layer="balance">
        {/* мост баланса */}
        <path
          id="balanceCock"
          d={`M96 96 L150 82 Q${BALANCE.x} 130 ${BALANCE.x + 14} ${BALANCE.y - 10} L${BALANCE.x - 12} ${BALANCE.y + 14} Q110 150 96 96 Z`}
          fill="var(--color-bg-1)"
        />
        <use href="#balanceCock" fill="url(#cotes)" />
        <use href="#balanceCock" fill="none" stroke="var(--color-accent-dim)" strokeWidth="1" opacity="0.5" />
        <Screw cx={118} cy={104} angle={30} />
        {/* спираль */}
        <path
          d={spiralPath(BALANCE.x, BALANCE.y)}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.1"
          opacity="0.85"
        />
        {/* колесо баланса — осциллирует; вложенный translate даёт надёжный центр вращения */}
        <g transform={`translate(${BALANCE.x} ${BALANCE.y})`}>
          <g className="cal-balance" style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
            <circle cx="0" cy="0" r="54" fill="none" stroke="url(#gearGold)" strokeWidth="7" />
            <line x1="-50" y1="0" x2="50" y2="0" stroke="url(#gearGold)" strokeWidth="5" />
            <line x1="0" y1="-50" x2="0" y2="50" stroke="url(#gearGold)" strokeWidth="3" />
            {TIMING_SCREWS.map((i) => {
              const a = (i / 6) * Math.PI * 2 + 0.26
              return (
                <circle
                  key={i}
                  cx={Math.sin(a) * 54}
                  cy={-Math.cos(a) * 54}
                  r="3.2"
                  fill="var(--color-accent-strong)"
                />
              )
            })}
          </g>
        </g>
        <Jewel cx={BALANCE.x} cy={BALANCE.y} r={4} />
      </g>
    </svg>
  )
}
