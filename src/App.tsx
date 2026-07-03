import { useEffect } from 'react'
import { I18nProvider } from './i18n'
import { initLenis } from './lenis'
import Header from './components/Header'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import PowerReserve from './components/PowerReserve'
import Hero from './components/sections/Hero'
import Manifesto from './components/sections/Manifesto'
import Movement from './components/sections/Movement'
import Collection from './components/sections/Collection'
import Manufacture from './components/sections/Manufacture'
import Specs from './components/sections/Specs'
import Final from './components/sections/Final'

function App() {
  useEffect(() => {
    initLenis()
  }, [])

  return (
    <I18nProvider>
      <Preloader />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Cursor />
      <PowerReserve />
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Movement />
        <Collection />
        <Manufacture />
        <Specs />
        <Final />
      </main>
    </I18nProvider>
  )
}

export default App
