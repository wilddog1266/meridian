import { useEffect, useId, useRef } from 'react'
import { useI18n } from '../../i18n'

const C = 300
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
const HOURS = Array.from({ length: 12 }, (_, i) => i)

export default function Dial({
  className,
  variant,
}: {
  className?: string
  variant?: 'gmt'
}) {
  const { t } = useI18n()
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `${uid}-${name}`
  const ref = (name: string) => `url(#${uid}-${name})`

  const hourRef = useRef<SVGGElement>(null)
  const minuteRef = useRef<SVGGElement>(null)
  const secondRef = useRef<SVGGElement>(null)
  const gmtRef = useRef<SVGGElement>(null)

  useEffect(() => {
    let rafId = 0
    const tick = () => {
      const now = new Date()
      // секундная стрелка шагает 6 раз в секунду — как механика 21 600 пк/ч
      const s = now.getSeconds() + Math.floor(now.getMilliseconds() / (1000 / 6)) / 6
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60
      secondRef.current!.style.transform = `rotate(${s * 6}deg)`
      minuteRef.current!.style.transform = `rotate(${m * 6}deg)`
      hourRef.current!.style.transform = `rotate(${h * 30}deg)`
      if (gmtRef.current) {
        const h24 = now.getHours() + m / 60
        gmtRef.current.style.transform = `rotate(${(h24 / 24) * 360}deg)`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const origin = { transformOrigin: `${C}px ${C}px` }

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      role="img"
      aria-label={t.hero.dialAria}
    >
      <defs>
        {/* clous de Paris: пирамидки 11×11 с четырёхгранной подсветкой */}
        <pattern id={id('clous')} width="11" height="11" patternUnits="userSpaceOnUse">
          <rect width="11" height="11" fill="var(--color-bg-2)" />
          <path d="M0 0 L5.5 5.5 L11 0 Z" fill="#fff" opacity="0.07" />
          <path d="M0 0 L5.5 5.5 L0 11 Z" fill="#fff" opacity="0.025" />
          <path d="M11 0 L5.5 5.5 L11 11 Z" fill="#000" opacity="0.12" />
          <path d="M0 11 L5.5 5.5 L11 11 Z" fill="#000" opacity="0.28" />
        </pattern>
        <radialGradient id={id('dialLight')} cx="0.38" cy="0.32" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </radialGradient>
        <linearGradient id={id('goldBaton')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-accent-strong)" />
          <stop offset="0.5" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-dim)" />
        </linearGradient>
        <linearGradient id={id('steelHand')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-fg-strong)" />
          <stop offset="0.5" stopColor="var(--color-fg-muted)" />
          <stop offset="1" stopColor="var(--color-fg-strong)" />
        </linearGradient>
        <filter id={id('handShadow')} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <linearGradient id={id('sweepGrad')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.13" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id('dialClip')}>
          <circle cx={C} cy={C} r="292" />
        </clipPath>
      </defs>

      {/* тарелка циферблата */}
      <circle cx={C} cy={C} r="292" fill="var(--color-bg-1)" />
      <circle cx={C} cy={C} r="292" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />

      {/* минутная дорожка */}
      <g>
        {MINUTES.map((i) => {
          const major = i % 5 === 0
          return (
            <line
              key={i}
              x1={C}
              y1={C - 282}
              x2={C}
              y2={C - (major ? 264 : 273)}
              stroke={major ? 'var(--color-accent)' : 'var(--color-fg-muted)'}
              strokeWidth={major ? 2.5 : 1}
              opacity={major ? 1 : 0.55}
              transform={`rotate(${i * 6} ${C} ${C})`}
            />
          )
        })}
      </g>
      <circle cx={C} cy={C} r="256" fill="none" stroke="var(--color-line)" strokeWidth="1" />

      {/* часовые накладные меты */}
      <g>
        {HOURS.map((i) => (
          <g key={i} transform={`rotate(${i * 30} ${C} ${C})`}>
            {i === 0 ? (
              <>
                <rect x={C - 9} y={C - 248} width="7" height="38" rx="1.5" fill={ref('goldBaton')} />
                <rect x={C + 2} y={C - 248} width="7" height="38" rx="1.5" fill={ref('goldBaton')} />
              </>
            ) : (
              <rect x={C - 3.5} y={C - 248} width="7" height="38" rx="1.5" fill={ref('goldBaton')} />
            )}
          </g>
        ))}
      </g>

      {/* центральное поле — гильоше */}
      <circle cx={C} cy={C} r="192" fill={ref('clous')} />
      <circle cx={C} cy={C} r="192" fill={ref('dialLight')} />
      <circle cx={C} cy={C} r="192" fill="none" stroke="var(--color-accent-dim)" strokeWidth="1" opacity="0.6" />

      {/* wordmark */}
      <text
        x={C}
        y={C - 96}
        textAnchor="middle"
        fill="var(--color-fg-strong)"
        fontFamily="var(--font-display)"
        fontSize="30"
        fontWeight="500"
        letterSpacing="7"
      >
        MERIDIAN
      </text>
      <text
        x={C}
        y={C - 72}
        textAnchor="middle"
        fill="var(--color-fg-muted)"
        fontFamily="var(--font-sans)"
        fontSize="10"
        letterSpacing="3.5"
      >
        MANUFACTURE
      </text>
      <text
        x={C}
        y={C + 128}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontFamily="var(--font-sans)"
        fontSize="9"
        letterSpacing="3"
      >
        {variant === 'gmt' ? 'GMT · DEUX FUSEAUX' : 'AUTOMATIQUE · 21 600 A/H'}
      </text>

      {/* стрелки */}
      {variant === 'gmt' && (
        <g ref={gmtRef} style={origin} filter={ref('handShadow')}>
          <line
            x1={C}
            y1={C}
            x2={C}
            y2={C - 200}
            stroke="var(--color-accent-strong)"
            strokeWidth="3"
          />
          <path
            d={`M${C - 8} ${C - 196} L${C} ${C - 218} L${C + 8} ${C - 196} Z`}
            fill="var(--color-accent-strong)"
          />
        </g>
      )}
      <g ref={hourRef} style={origin} filter={ref('handShadow')}>
        <path
          d={`M${C - 8} ${C + 20} L${C} ${C - 150} L${C + 8} ${C + 20} Z`}
          fill={ref('steelHand')}
        />
      </g>
      <g ref={minuteRef} style={origin} filter={ref('handShadow')}>
        <path
          d={`M${C - 5.5} ${C + 26} L${C} ${C - 236} L${C + 5.5} ${C + 26} Z`}
          fill={ref('steelHand')}
        />
      </g>
      <g ref={secondRef} style={origin} filter={ref('handShadow')}>
        <line
          x1={C}
          y1={C + 48}
          x2={C}
          y2={C - 252}
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <circle cx={C} cy={C + 48} r="8" fill="var(--color-accent)" />
      </g>

      {/* центральный колпачок */}
      <circle cx={C} cy={C} r="9" fill={ref('goldBaton')} />
      <circle cx={C} cy={C} r="3.5" fill="var(--color-bg-0)" />

      {/* блик по стеклу */}
      <g clipPath={ref('dialClip')}>
        <rect className="dial-sweep" x="-40" y="-40" width="220" height="680" fill={ref('sweepGrad')} />
      </g>
    </svg>
  )
}
