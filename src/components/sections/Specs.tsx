import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../../i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Specs() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-title-line]',
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        },
      )
      gsap.fromTo(
        '[data-spec-row]',
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="relative overflow-hidden border-t border-line py-40"
    >
      <span className="watermark top-[4vmin] right-[2vw]" data-n="05" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-6">
        <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
          {t.sections.specs.label}
        </p>
        <h2 className="mt-10 overflow-hidden font-display text-[clamp(28px,4vw,48px)] leading-[1.2] text-fg-strong">
          <span data-title-line className="block">
            {t.sections.specs.title}
          </span>
        </h2>

        <dl className="mt-16">
          {t.sections.specs.rows.map((row) => (
            <div
              key={row.k}
              data-spec-row
              className="flex items-baseline justify-between gap-6 border-b border-line py-5"
            >
              <dt className="text-sm tracking-[0.06em] text-fg-muted uppercase">{row.k}</dt>
              <dd className="text-right font-mono text-sm tracking-[0.08em] text-fg-strong tabular-nums">
                {row.v}
              </dd>
            </div>
          ))}
        </dl>

        <p
          data-spec-row
          className="mt-12 text-center font-mono text-xs tracking-[0.3em] text-accent uppercase"
        >
          {t.sections.specs.serial}
        </p>
      </div>
    </section>
  )
}
