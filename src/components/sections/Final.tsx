import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../../i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Final() {
  const { t, lang } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.fromTo(
          '[data-final-line]',
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          },
        )
      }
      // магнитная кнопка
      if (!reduce && window.matchMedia('(pointer: fine)').matches) {
        const zone = zoneRef.current!
        const btn = btnRef.current!
        const onMove = (e: PointerEvent) => {
          const r = zone.getBoundingClientRect()
          const x = (e.clientX - r.left - r.width / 2) * 0.3
          const y = (e.clientY - r.top - r.height / 2) * 0.3
          gsap.to(btn, { x, y, duration: 0.5, ease: 'power3.out' })
        }
        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' })
        }
        zone.addEventListener('pointermove', onMove)
        zone.addEventListener('pointerleave', onLeave)
        return () => {
          zone.removeEventListener('pointermove', onMove)
          zone.removeEventListener('pointerleave', onLeave)
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      id="final"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-line pt-48 pb-10"
    >
      <span className="watermark bottom-[2vmin] left-[2vw]" data-n="06" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
          {t.sections.final.label}
        </p>
        <h2 className="mt-12 font-display text-[clamp(40px,7.5vw,104px)] leading-[1.04] text-fg-strong">
          <span className="block overflow-hidden">
            <span data-final-line className="block">
              {t.sections.final.line1}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-final-line className="block text-accent">
              {t.sections.final.line2}
            </span>
          </span>
        </h2>

        <div ref={zoneRef} className="mt-20 flex justify-center py-10">
          <a
            ref={btnRef}
            href="mailto:atelier@meridian-manufacture.ch"
            className="inline-block rounded-full border border-accent-dim px-12 py-5 font-mono text-sm tracking-[0.25em] text-fg-strong uppercase transition-colors duration-300 hover:bg-accent hover:text-bg-0 focus-visible:outline focus-visible:outline-accent"
          >
            {t.sections.final.button}
          </a>
        </div>

        <p className="mt-10 font-mono text-xs tracking-[0.15em] text-fg-muted">
          {t.sections.final.note}
        </p>

        <footer className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <span className="font-display tracking-[0.3em] text-fg-strong">MERIDIAN</span>
          <span className="font-mono text-xs tracking-[0.15em] text-fg-muted">
            {t.sections.final.rights}
          </span>
        </footer>
      </div>
    </section>
  )
}
