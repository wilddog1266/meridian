import { useEffect, useState } from 'react'

const KNURLS = Array.from({ length: 24 }, (_, i) => i)

export default function Preloader() {
  const [hidden, setHidden] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hideAt = setTimeout(() => setHidden(true), reduce ? 0 : 1400)
    const goneAt = setTimeout(() => setGone(true), reduce ? 50 : 2000)
    return () => {
      clearTimeout(hideAt)
      clearTimeout(goneAt)
    }
  }, [])

  if (gone) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-bg-0 transition-opacity duration-500 ${
        hidden ? 'pointer-events-none opacity-0' : ''
      }`}
    >
      {/* заводная головка: пол-оборота — и сайт «заведён» */}
      <svg width="72" height="72" viewBox="0 0 72 72" className="crown-wind">
        <circle cx="36" cy="36" r="24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        {KNURLS.map((i) => (
          <line
            key={i}
            x1="36"
            y1="8"
            x2="36"
            y2="14"
            stroke="var(--color-accent-dim)"
            strokeWidth="1.5"
            transform={`rotate(${i * 15} 36 36)`}
          />
        ))}
        <circle cx="36" cy="36" r="5" fill="var(--color-accent)" />
        <line x1="36" y1="36" x2="36" y2="16" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
