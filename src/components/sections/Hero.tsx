import Watch from '../watch/Watch'
import Tilt from '../Tilt'
import { useI18n } from '../../i18n'

export default function Hero() {
  const { t } = useI18n()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* амбиентное свечение за часами */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-[56%]">
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgb(161_98_7/0.1),transparent_62%)] blur-2xl" />
      </div>

      <p className="hero-fade relative font-mono text-xs tracking-[0.35em] text-accent uppercase [animation-delay:1.4s]">
        {t.hero.label}
      </p>
      <Tilt
        max={7}
        data-cursor="zoom"
        className="hero-fade relative mt-6 w-[min(64vmin,540px)] [animation-delay:1.3s]"
      >
        <Watch className="dial-shadow w-full" />
      </Tilt>
      <h1 className="relative z-10 -mt-[9vmin] overflow-hidden text-center font-display text-[clamp(44px,8vw,110px)] leading-[1.04] font-medium text-fg-strong">
        <span className="hero-rise block [animation-delay:1.6s]">{t.hero.line1}</span>
        <span className="hero-rise block [animation-delay:1.75s]">{t.hero.line2}</span>
      </h1>
      <p className="hero-fade relative mt-6 max-w-md text-center text-fg-muted [animation-delay:2.2s]">
        {t.hero.lead}
      </p>

      {/* скролл-кью */}
      <div className="hero-fade absolute bottom-6 left-1/2 -translate-x-1/2 [animation-delay:2.8s]">
        <div className="relative h-14 w-px overflow-hidden bg-line">
          <div className="cue-drop absolute top-0 left-0 h-5 w-px bg-accent" />
        </div>
      </div>
    </section>
  )
}
