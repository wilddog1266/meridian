import { useEffect, useRef } from 'react'

/* дуга «запаса хода» — прогресс скролла на 270° */
export default function PowerReserve() {
  const arcRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    let rafId = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      arcRef.current!.setAttribute('stroke-dasharray', `${(p * 75).toFixed(2)} 100`)
      rafId = 0
    }
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="fixed right-6 bottom-6 z-40 hidden sm:block" aria-hidden="true">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-[225deg]">
        <circle
          cx="22"
          cy="22"
          r="17"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="1.5"
          pathLength="100"
          strokeDasharray="75 100"
        />
        <circle
          ref={arcRef}
          cx="22"
          cy="22"
          r="17"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          pathLength="100"
          strokeDasharray="0 100"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
