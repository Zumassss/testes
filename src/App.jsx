import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

import Nav from './components/Nav.jsx'
import BrainScene from './components/BrainScene.jsx'
import Hero from './components/Hero.jsx'
import Manifesto from './components/Manifesto.jsx'
import Beneficios from './components/Beneficios.jsx'
import Sobre from './components/Sobre.jsx'
import Trajetoria from './components/Trajetoria.jsx'
import Espaco from './components/Espaco.jsx'
import ComoFunciona from './components/ComoFunciona.jsx'
import Contato from './components/Contato.jsx'
import Footer from './components/Footer.jsx'

const NAV_OFFSET = -76

export default function App() {
  const stageRef = useRef(null)
  const progressRef = useRef(0)

  /**
   * Scroll suave. O Lenis nao troca o scroll nativo por um transform: ele
   * continua chamando window.scrollTo, entao IntersectionObserver, sticky,
   * ancoras e o listener de progresso abaixo seguem funcionando.
   */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.7,
    })

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    // ancoras precisam passar pelo Lenis, senao o salto e instantaneo
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return
      const link = event.target.closest?.('a[href^="#"]')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href || href.length < 2) return

      const target = document.querySelector(href)
      if (!target) return

      event.preventDefault()
      lenis.scrollTo(href === '#topo' ? 0 : target, { offset: NAV_OFFSET })
    }

    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  /**
   * Um unico listener alimenta as duas pontas da coreografia: a variavel CSS
   * --p (fades do HTML, sem re-render do React) e o progressRef, lido dentro
   * do useFrame da cena 3D.
   */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    let ticking = false
    let past = null

    const update = () => {
      ticking = false
      const travel = el.offsetHeight - window.innerHeight
      if (travel <= 0) return

      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel))
      progressRef.current = p
      el.style.setProperty('--p', p.toFixed(4))

      // o hero fica invisivel bem antes do fim do palco; sem isto os links
      // dele continuariam clicaveis por baixo do bloco seguinte
      const isPast = p > 0.35
      if (isPast !== past) {
        past = isPast
        el.dataset.past = String(isPast)
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      {/* fundo ambiente: manchas difusas + grao, atras de todo o conteudo */}
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="orb orb-4" />
        <span className="aurora" />
        <span className="vinheta" />
      </div>
      <div className="grain" aria-hidden="true" />

      <Nav />

      <main className="relative z-10">
        {/* Palco: o cerebro fica preso no topo enquanto estas ~2,3 telas rolam */}
        <div ref={stageRef} className="stage relative h-[230svh]">
          <div className="sticky top-0 h-svh overflow-hidden">
            <BrainScene progressRef={progressRef} />

            <div className="relative z-10 h-full">
              <Hero />
            </div>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center pb-[8svh]">
              <Manifesto />
            </div>
          </div>
        </div>

        <Beneficios />
        <Sobre />
        <Trajetoria />
        <Espaco />
        <ComoFunciona />
        <Contato />
      </main>

      <Footer />
    </>
  )
}
