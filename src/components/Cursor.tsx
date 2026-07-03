import { useEffect, useState } from 'react'

export default function Cursor() {
  const [enabled] = useState(
    () =>
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    const dot = document.querySelector<HTMLElement>('.cursor-dot')!
    const ring = document.querySelector<HTMLElement>('.cursor-ring')!
    document.documentElement.classList.add('custom-cursor')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const trail = { ...pos }
    let mode = ''
    let rafId = 0

    const onMove = (e: PointerEvent) => {
      if (!dot.classList.contains('cursor-visible')) {
        trail.x = e.clientX
        trail.y = e.clientY
        dot.classList.add('cursor-visible')
        ring.classList.add('cursor-visible')
      }
      pos.x = e.clientX
      pos.y = e.clientY
      const interactive = (e.target as Element).closest?.('a, button, [data-cursor]')
      const next = interactive?.getAttribute('data-cursor') ?? (interactive ? 'link' : '')
      if (next !== mode) {
        mode = next
        ring.dataset.mode = mode
      }
    }

    const loop = () => {
      trail.x += (pos.x - trail.x) * 0.16
      trail.y += (pos.y - trail.y) * 0.16
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      ring.style.transform = `translate(${trail.x}px, ${trail.y}px)`
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    rafId = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
    </>
  )
}
