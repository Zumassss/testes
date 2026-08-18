import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Manifesto from './components/Manifesto.jsx'
import Beneficios from './components/Beneficios.jsx'
import Sobre from './components/Sobre.jsx'
import Trajetoria from './components/Trajetoria.jsx'
import Espaco from './components/Espaco.jsx'
import ComoFunciona from './components/ComoFunciona.jsx'
import Contato from './components/Contato.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'

/*
 * A cena 3D so e BAIXADA no desktop. Antes o bundle do three.js (~700 KB)
 * ia para o celular junto com o resto, mesmo sem nunca ser usado la.
 */
const BrainScene = lazy(() => import('./components/BrainScene.jsx'))

const NAV_OFFSET = -72

/** Ponto em que o layout deixa de empilhar e o cerebro 3D entra. */
const consultarDesktop = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches

export default function App() {
  const stageRef = useRef(null)
  const progressRef = useRef(0)
  const barraRef = useRef(null)

  /* lido ja na primeira renderizacao: se comecasse falso, o desktop pintaria
     a versao mobile por um quadro antes de trocar */
  const [desktop, setDesktop] = useState(consultarDesktop)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const sync = () => setDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  /**
   * Scroll suave — SO no desktop.
   *
   * No celular o Lenis rodava um rAF por quadro para reimplementar um scroll
   * que o sistema ja faz nativamente melhor (e com a rolagem entregue a
   * thread de composicao). Era custo puro, e uma das causas do travamento.
   */
  useEffect(() => {
    if (!desktop) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let lenis
    let frame
    let cancelado = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelado) return
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      frame = requestAnimationFrame(function raf(time) {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      })
    })

    return () => {
      cancelado = true
      if (frame) cancelAnimationFrame(frame)
      if (lenis) lenis.destroy()
    }
  }, [desktop])

  /**
   * Progresso do scroll: alimenta a barra do topo sempre, e — quando existe
   * palco — a variavel CSS --p e o progressRef lido dentro do useFrame da
   * cena 3D. Um listener so, sempre em rAF.
   */
  useEffect(() => {
    let ticking = false
    let past = null

    const update = () => {
      ticking = false

      const barra = barraRef.current
      if (barra) {
        const total = document.documentElement.scrollHeight - window.innerHeight
        const sp = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0
        barra.style.setProperty('--sp', sp.toFixed(4))
      }

      const el = stageRef.current
      if (!el) return
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
  }, [desktop])

  /* ancoras precisam de compensacao pela barra fixa; com Lenis ativo o
     proprio scroll-behavior suave do CSS fica desligado, entao o scrollIntoView
     nativo continua valendo nos dois casos */
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey)
        return
      const link = event.target.closest?.('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.length < 2) return
      const alvo = document.querySelector(href)
      if (!alvo) return

      event.preventDefault()
      const y =
        href === '#topo'
          ? 0
          : alvo.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
      window.scrollTo({ top: y, behavior: 'smooth' })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      {/* fundo ambiente: manchas difusas atras de todo o conteudo */}
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <div className="grain" aria-hidden="true" />

      <div ref={barraRef} className="progresso" aria-hidden="true" />

      <Nav />

      <main className="relative z-10">
        {desktop ? (
          /* Palco: o cerebro fica preso no topo enquanto ~2,3 telas rolam */
          <div ref={stageRef} className="stage relative h-[230svh]">
            <div className="sticky top-0 h-svh overflow-hidden">
              <Suspense fallback={null}>
                <BrainScene progressRef={progressRef} />
              </Suspense>

              <div className="relative z-10 h-full">
                <Hero />
              </div>

              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center pb-[8svh]">
                <Manifesto />
              </div>
            </div>
          </div>
        ) : (
          <>
            <Hero mobile />
            <Manifesto estatico />
          </>
        )}

        <Beneficios />
        <Sobre />
        <Trajetoria />
        <Espaco />
        <ComoFunciona />
        <Contato />
      </main>

      <Footer />

      <WhatsAppFloat />
    </>
  )
}
