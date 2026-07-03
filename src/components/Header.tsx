import { useEffect, useState } from 'react'
import { useI18n, type Lang } from '../i18n'

type Theme = 'light' | 'dark'

export default function Header() {
  const { lang, setLang, t } = useI18n()
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('meridian-theme') === 'dark' ? 'dark' : 'light',
  )
  const [hidden, setHidden] = useState(false)
  const [scrimmed, setScrimmed] = useState(false)

  useEffect(() => {
    localStorage.setItem('meridian-theme', theme)
    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark'
    } else {
      delete document.documentElement.dataset.theme
    }
  }, [theme])

  /* прячется при скролле вниз, возвращается при скролле вверх */
  useEffect(() => {
    let lastY = window.scrollY
    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        if (Math.abs(y - lastY) > 4) {
          setHidden(y > lastY && y > 140)
          lastY = y
        }
        setScrimmed(y > 40)
        rafId = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const langButton = (code: Lang) => (
    <button
      type="button"
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-accent ${
        lang === code ? 'text-fg-strong' : 'text-fg-muted hover:text-accent'
      }`}
    >
      {code}
    </button>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 transition-[transform,background-color,border-color] duration-500 [transition-timing-function:var(--ease-out-quart)] sm:px-10 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrimmed ? 'border-b border-line bg-bg-0/80 backdrop-blur-md' : 'border-b border-transparent'}`}
    >
      <a
        href="#hero"
        className="font-display text-lg tracking-[0.3em] text-fg-strong focus-visible:outline focus-visible:outline-accent"
      >
        MERIDIAN
      </a>
      <div className="flex items-center gap-6">
        <a
          href="#collection"
          className="hidden font-mono text-xs tracking-[0.2em] text-fg-muted uppercase transition-colors duration-300 hover:text-accent focus-visible:outline focus-visible:outline-accent sm:inline"
        >
          {t.header.preorder}
        </a>
        <div className="flex items-center gap-2">
          {langButton('ru')}
          <span className="text-fg-muted/50">/</span>
          {langButton('en')}
        </div>
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={t.header.themeToggle}
          className="text-fg-muted transition-colors duration-300 hover:text-accent focus-visible:outline focus-visible:outline-accent"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
