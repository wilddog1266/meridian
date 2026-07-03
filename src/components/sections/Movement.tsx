import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Calibre from '../watch/Calibre'
import Tilt from '../Tilt'
import { useI18n } from '../../i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Movement() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]')
      /* активный шаг — по классу, а не по твинам: состояние не портится
         рефрешами ScrollTrigger, HMR и сменой языка */
      const setActive = (idx: number) => {
        steps.forEach((el, i) => el.classList.toggle('step-active', i === idx))
      }
      setActive(0)

      if (reduce) return

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=340%',
          scrub: 0.6,
          pin: pinRef.current,
          onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4))),
        },
      })

      tl.to('[data-layer="balance"]', { y: -240, scale: 1.05, duration: 4 }, 0)
        .to('[data-layer="bridges"]', { y: -100, duration: 4 }, 0)
        .to('[data-layer="train"]', { y: 70, duration: 4 }, 0)
        .to(
          '[data-layer="plate"]',
          { y: 220, scale: 0.93, opacity: 0.55, filter: 'blur(3px)', duration: 4 },
          0,
        )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="movement" className="relative border-t border-line">
      <div ref={pinRef} className="relative flex h-screen flex-col overflow-hidden">
        <span className="watermark bottom-[2vmin] left-[2vw]" data-n="02" aria-hidden="true" />
        <div className="mx-auto w-full max-w-6xl px-6 pt-28">
          <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
            {t.sections.movement.label}
          </p>
          <h2 className="mt-4 font-display text-[clamp(26px,3.5vw,44px)] leading-[1.15] text-fg-strong">
            {t.sections.movement.title}
          </h2>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <Tilt max={6} data-cursor="zoom" className="w-[min(56vmin,480px)]">
            <Calibre className="dial-shadow w-full" />
          </Tilt>

          <div className="absolute inset-x-6 bottom-6 h-44 md:inset-x-auto md:top-1/2 md:right-[7%] md:bottom-auto md:h-56 md:w-80 md:-translate-y-1/2">
            {t.sections.movement.steps.map((step, i) => (
              <div key={step.title} data-step className="absolute inset-0">
                <p className="font-mono text-xs tracking-[0.3em] text-accent">
                  0{i + 1} / 04
                </p>
                <p className="mt-3 font-display text-2xl text-fg-strong md:text-3xl">
                  {step.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
