import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Watch from '../watch/Watch'
import Tilt from '../Tilt'
import { getLenis } from '../../lenis'
import { useI18n, type Dict } from '../../i18n'

gsap.registerPlugin(ScrollTrigger)

const CHAPTER_THEMES = ['light', 'dark', 'gmt'] as const
const PRODUCT_PHOTOS = [
  '/assets/kit/product-noon.jpg',
  '/assets/kit/product-midnight.jpg',
  '/assets/kit/product-gmt.jpg',
]
type Chapter = Dict['sections']['collection']['chapters'][number]

function ModelCard({
  chapter,
  theme,
  index,
  onClose,
}: {
  chapter: Chapter
  theme: (typeof CHAPTER_THEMES)[number]
  index: number
  onClose: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const c = t.sections.collection

  return (
    <div
      data-theme={theme}
      role="dialog"
      aria-modal="true"
      aria-label={chapter.name}
      className="overlay-in fixed inset-0 z-50 overflow-y-auto bg-bg-0 text-fg-base"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={c.close}
        className="fixed top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-muted transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-accent"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M2 2 L14 14 M14 2 L2 14" />
        </svg>
      </button>

      <div className="mx-auto grid min-h-full w-full max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:gap-20">
        <Tilt max={8} data-cursor="zoom" className="mx-auto w-[min(70vmin,480px)]">
          <Watch variant={theme === 'gmt' ? 'gmt' : undefined} className="dial-shadow w-full" />
        </Tilt>

        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-accent">
            0{index + 1} / 03 · MERIDIAN
          </p>
          <h3 className="mt-4 font-display text-[clamp(40px,6vw,84px)] leading-[1.02] text-fg-strong">
            {chapter.name}
          </h3>
          <p className="mt-6 max-w-md leading-relaxed">{chapter.description}</p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {chapter.materials.map((m) => (
              <li
                key={m}
                className="rounded-full border border-line px-4 py-1.5 font-mono text-xs tracking-[0.1em]"
              >
                {m}
              </li>
            ))}
          </ul>

          <dl className="mt-10 border-t border-line">
            {chapter.specs.map((s) => (
              <div key={s.k} className="flex justify-between gap-6 border-b border-line py-3">
                <dt className="text-sm text-fg-muted">{s.k}</dt>
                <dd className="font-mono text-sm text-fg-strong tabular-nums">{s.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-display text-4xl text-fg-strong">{chapter.price}</span>
            <span className="text-sm text-fg-muted">{c.delivery}</span>
          </div>

          <a
            href={`mailto:atelier@meridian-manufacture.ch?subject=${encodeURIComponent(`${c.preorder} — ${chapter.name}`)}`}
            className="mt-8 inline-block rounded-xl bg-fg-strong px-10 py-4 font-mono text-sm tracking-[0.2em] text-bg-0 uppercase transition-colors duration-300 hover:bg-accent focus-visible:outline focus-visible:outline-accent"
          >
            {c.preorder}
          </a>
          <p className="mt-4 font-mono text-xs tracking-[0.1em] text-fg-muted">{c.deposit}</p>
        </div>
      </div>
    </div>
  )
}

export default function Collection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-card]',
        { autoAlpha: 0, y: 44 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const c = t.sections.collection

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative overflow-hidden border-t border-line py-40"
    >
      <span className="watermark -top-[3vmin] right-[2vw]" data-n="03" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">{c.label}</p>
        <h2 className="mt-10 max-w-2xl font-display text-[clamp(28px,4vw,48px)] leading-[1.2] text-fg-strong">
          {c.title}
        </h2>

        <div className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-3">
          {c.chapters.map((chapter, i) => (
            <button
              key={chapter.name}
              type="button"
              data-card
              onClick={() => setOpen(i)}
              className="group text-left focus-visible:outline focus-visible:outline-accent"
            >
              <div className="overflow-hidden rounded-2xl border border-line transition-colors duration-500 group-hover:border-accent-dim">
                <img
                  src={PRODUCT_PHOTOS[i]}
                  alt={chapter.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quart)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <span className="font-display text-2xl text-fg-strong">{chapter.name}</span>
                <span className="font-mono text-sm text-fg-muted tabular-nums">
                  {chapter.price}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{chapter.tag}</p>
              <span className="mt-5 inline-block font-mono text-xs tracking-[0.25em] text-accent uppercase transition-colors duration-300 group-hover:text-accent-strong">
                {c.open} →
              </span>
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <ModelCard
          chapter={c.chapters[open]}
          theme={CHAPTER_THEMES[open]}
          index={open}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  )
}
