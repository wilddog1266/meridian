import { useId } from 'react'
import Dial from './Dial'

const CX = 365
const CY = 350
const KNURLS = Array.from({ length: 7 }, (_, i) => i)

/* Корпус: фланк → полированная фаска → безель → золотая кромка → реоут → циферблат */
export default function Watch({
  className,
  variant,
}: {
  className?: string
  variant?: 'gmt'
}) {
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `${uid}-${name}`
  const ref = (name: string) => `url(#${uid}-${name})`

  return (
    <svg viewBox="0 0 730 700" className={className}>
      <defs>
        <linearGradient id={id('caseMetal')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-fg-muted)" />
          <stop offset="0.28" stopColor="var(--color-bg-2)" />
          <stop offset="0.52" stopColor="var(--color-fg-muted)" />
          <stop offset="0.62" stopColor="var(--color-fg-base)" />
          <stop offset="1" stopColor="var(--color-bg-2)" />
        </linearGradient>
        <linearGradient id={id('bezelMetal')} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--color-fg-muted)" />
          <stop offset="0.4" stopColor="var(--color-bg-2)" />
          <stop offset="0.75" stopColor="var(--color-fg-base)" />
          <stop offset="1" stopColor="var(--color-bg-2)" />
        </linearGradient>
      </defs>

      {/* заводная головка */}
      <g>
        <rect x={CX + 328} y={CY - 9} width="14" height="18" fill={ref('caseMetal')} />
        <rect x={CX + 338} y={CY - 17} width="18" height="34" rx="7" fill={ref('bezelMetal')} stroke="rgb(0 0 0 / 0.45)" strokeWidth="1" />
        {KNURLS.map((i) => (
          <line
            key={i}
            x1={CX + 341 + i * 2.1}
            y1={CY - 15}
            x2={CX + 341 + i * 2.1}
            y2={CY + 15}
            stroke="rgb(0 0 0 / 0.35)"
            strokeWidth="0.9"
          />
        ))}
      </g>

      {/* фланк корпуса */}
      <circle cx={CX} cy={CY} r="340" fill={ref('caseMetal')} stroke="rgb(0 0 0 / 0.5)" strokeWidth="1.2" />
      {/* полированная фаска */}
      <circle cx={CX} cy={CY} r="327" fill="none" stroke={ref('bezelMetal')} strokeWidth="17" />
      {/* безель */}
      <circle cx={CX} cy={CY} r="311" fill="none" stroke={ref('caseMetal')} strokeWidth="15" />
      {/* золотая кромка безеля */}
      <circle cx={CX} cy={CY} r="303" fill="none" stroke="var(--color-accent-dim)" strokeWidth="1.6" opacity="0.9" />
      {/* реоут — колодец между безелем и циферблатом */}
      <circle cx={CX} cy={CY} r="302" fill="var(--color-bg-0)" />

      {/* блик на фаске сверху-слева */}
      <path
        d={`M ${CX - 233} ${CY - 233} A 330 330 0 0 1 ${CX + 100} ${CY - 314}`}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.16"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* тень на фланке снизу-справа */}
      <path
        d={`M ${CX + 236} ${CY + 236} A 334 334 0 0 1 ${CX - 90} ${CY + 322}`}
        fill="none"
        stroke="#000"
        strokeOpacity="0.3"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* циферблат */}
      <svg x={CX - 295} y={CY - 295} width="590" height="590" viewBox="0 0 600 600">
        <Dial variant={variant} className="" />
      </svg>
    </svg>
  )
}
