import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Calibre from '../watch/Calibre'
import Tilt from '../Tilt'
import { useI18n } from '../../i18n'

gsap.registerPlugin(ScrollTrigger)

/* false — вернуть процедурный SVG-калибр вместо видео */
const USE_VIDEO = true
const VIDEO_SRC = '/assets/movement-explode.mp4'

export default function Movement() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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

      const video = videoRef.current
      let videoTarget = 0

      const onUpdate = (self: ScrollTrigger) => {
        setActive(Math.min(3, Math.floor(self.progress * 4)))
        if (video?.duration) {
          videoTarget = self.progress * (video.duration - 0.05)
        }
      }

      if (USE_VIDEO && video) {
        /* плавная перемотка: currentTime догоняет цель через lerp,
           это сглаживает редкие ключевые кадры h264 */
        const seek = () => {
          if (!video.duration) return
          const delta = videoTarget - video.currentTime
          if (Math.abs(delta) > 0.02) {
            video.currentTime = video.currentTime + delta * 0.18
          }
        }
        gsap.ticker.add(seek)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=340%',
          pin: pinRef.current,
          onUpdate,
        })
        return () => gsap.ticker.remove(seek)
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=340%',
          scrub: 0.6,
          pin: pinRef.current,
          onUpdate,
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

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 px-6 md:grid md:grid-cols-[minmax(0,1fr)_19rem] md:gap-16">
          {USE_VIDEO ? (
            <Tilt max={5} data-cursor="zoom" className="relative w-[min(78vmin,620px)] md:w-full">
              {/* тёплое свечение вписывает кадр в фон */}
              <div
                aria-hidden="true"
                className="absolute inset-[-14%] rounded-full bg-[radial-gradient(circle,rgb(161_98_7/0.13),transparent_65%)] blur-2xl"
              />
              {/* края растворяются маской — видео лежит в среде, а не в рамке */}
              <div className="relative overflow-hidden [mask-image:radial-gradient(72%_64%_at_48%_53%,#000_52%,transparent_90%)]">
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  aria-label={t.sections.movement.calibreAria}
                  className="w-full scale-[1.07] [filter:saturate(0.9)_contrast(1.02)_brightness(1.03)]"
                />
              </div>
            </Tilt>
          ) : (
            <Tilt max={6} data-cursor="zoom" className="w-[min(56vmin,480px)] justify-self-center">
              <Calibre className="dial-shadow w-full" />
            </Tilt>
          )}

          <div className="relative h-44 w-full md:h-60">
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
