import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../../i18n'

gsap.registerPlugin(ScrollTrigger)

/* свой ассет-кит (Gemini) + один Unsplash-кадр ателье для человеческого контекста */
const PHOTOS = [
  '/assets/kit/detail-movement.jpg',
  '/assets/kit/detail-dial.jpg',
  'https://images.unsplash.com/photo-1700649691091-81ef194ce346?q=80&w=1200&auto=format&fit=crop',
  '/assets/kit/detail-strap.jpg',
]

function Photo({
  src,
  index,
  caption,
  alt,
  className,
}: {
  src: string
  index: number
  caption: string
  alt: string
  className?: string
}) {
  return (
    <figure data-photo data-cursor="zoom" className={className}>
      <div className="group overflow-hidden">
        <img
          data-photo-img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full scale-[1.12] object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quart)] group-hover:scale-[1.18]"
        />
      </div>
      <figcaption className="mt-4 flex items-baseline gap-4 border-b border-line pb-3">
        <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
        <span className="font-mono text-xs tracking-[0.12em] text-fg-muted uppercase">
          {caption}
        </span>
      </figcaption>
    </figure>
  )
}

export default function Manufacture() {
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
      gsap.utils.toArray<HTMLElement>('[data-photo]').forEach((photo) => {
        gsap.fromTo(
          photo,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: photo, start: 'top 82%' },
          },
        )
        gsap.fromTo(
          photo.querySelector('[data-photo-img]'),
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const captions = t.sections.manufacture.photos

  return (
    <section
      ref={sectionRef}
      id="manufacture"
      className="relative overflow-hidden border-t border-line py-40"
    >
      <span className="watermark top-[6vmin] left-[2vw]" data-n="04" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
          {t.sections.manufacture.label}
        </p>
        <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-6">
          <h2 className="col-span-12 overflow-hidden font-display text-[clamp(28px,4vw,48px)] leading-[1.2] text-fg-strong md:col-span-7">
            <span data-title-line className="block">
              {t.sections.manufacture.title}
            </span>
          </h2>
          <p className="col-span-12 self-end text-fg-muted md:col-span-5">
            {t.sections.manufacture.copy}
          </p>
        </div>

        <div className="mt-24 grid grid-cols-12 gap-x-8 gap-y-20">
          <Photo
            src={PHOTOS[0]}
            index={0}
            caption={captions[0].caption}
            alt={captions[0].alt}
            className="col-span-12 aspect-[16/10] md:col-span-8"
          />
          <Photo
            src={PHOTOS[1]}
            index={1}
            caption={captions[1].caption}
            alt={captions[1].alt}
            className="col-span-12 aspect-[4/5] md:col-span-4 md:mt-32"
          />
          <Photo
            src={PHOTOS[2]}
            index={2}
            caption={captions[2].caption}
            alt={captions[2].alt}
            className="col-span-12 aspect-[4/3] md:col-span-5 md:-mt-12"
          />
          <Photo
            src={PHOTOS[3]}
            index={3}
            caption={captions[3].caption}
            alt={captions[3].alt}
            className="col-span-12 aspect-[16/9] md:col-span-7 md:mt-20"
          />
        </div>
      </div>
    </section>
  )
}
