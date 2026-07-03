import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

if (import.meta.env.DEV) {
  // @ts-expect-error дебаг-хук для превью
  window.__ST = ScrollTrigger
}

const tick = (time: number) => lenis?.raf(time * 1000)

/* деликатный smooth-scroll: lerp 0.14 — почти нативный */
export function initLenis() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis
  lenis = new Lenis({ lerp: 0.14 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function getLenis() {
  return lenis
}
