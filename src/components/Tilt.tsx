import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'

export default function Tilt({
  children,
  max = 8,
  className,
  ...rest
}: {
  children: ReactNode
  max?: number
  className?: string
} & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let rafId = 0
    let running = false

    const loop = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      el.style.transform = `perspective(1100px) rotateX(${(-current.y * max).toFixed(3)}deg) rotateY(${(current.x * max).toFixed(3)}deg)`
      if (Math.hypot(target.x - current.x, target.y - current.y) < 0.001) {
        running = false
        return
      }
      rafId = requestAnimationFrame(loop)
    }

    const start = () => {
      if (!running) {
        running = true
        rafId = requestAnimationFrame(loop)
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1
      start()
    }

    const onLeave = () => {
      target.x = 0
      target.y = 0
      start()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(rafId)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [max])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }} {...rest}>
      {children}
    </div>
  )
}
