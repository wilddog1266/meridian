import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../../i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const { t, lang } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const words = t.sections.manifesto.title.split(' ')

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.47 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            end: 'top 22%',
            scrub: true,
          },
        },
      )
      gsap.fromTo(
        '[data-manifesto-copy]',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            end: 'top 18%',
            scrub: true,
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative overflow-hidden border-t border-line py-48"
    >
      <span className="watermark -top-[4vmin] right-[2vw]" data-n="01" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6">
        <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
          {t.sections.manifesto.label}
        </p>
        <h2 className="mt-12 font-display text-[clamp(34px,5.5vw,72px)] leading-[1.12] text-fg-strong">
          {words.map((word, i) => (
            <span key={`${lang}-${i}`} data-word className="inline">
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>
        <p data-manifesto-copy className="mt-14 max-w-xl text-lg leading-relaxed text-fg-muted">
          {t.sections.manifesto.copy}
        </p>
      </div>
      <figure className="mt-28">
        <img
          src="/assets/kit/hero-watch.jpg"
          alt={t.sections.manifesto.photoAlt}
          loading="lazy"
          className="aspect-[21/9] w-full object-cover"
        />
      </figure>
    </section>
  )
}
