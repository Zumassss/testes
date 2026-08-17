import { useEffect, useRef } from 'react'
import BrainScene from './components/BrainScene.jsx'
import Hero from './components/Hero.jsx'
import Manifesto from './components/Manifesto.jsx'
import Sobre from './components/Sobre.jsx'
import Espaco from './components/Espaco.jsx'
import Contato from './components/Contato.jsx'

export default function App() {
  const stageRef = useRef(null)
  const progressRef = useRef(0)

  /**
   * Um unico listener de scroll alimenta as duas pontas da coreografia:
   * a variavel CSS --p (fades do HTML, sem re-render do React) e o
   * progressRef, lido dentro do useFrame da cena 3D.
   */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    let ticking = false

    const update = () => {
      ticking = false
      const travel = el.offsetHeight - window.innerHeight
      if (travel <= 0) return
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel))
      progressRef.current = p
      el.style.setProperty('--p', p.toFixed(4))
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
    <main className="relative bg-page">
      {/* Palco: o cerebro fica preso no topo enquanto estas ~2,2 telas rolam */}
      <div ref={stageRef} className="stage relative h-[240svh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <BrainScene progressRef={progressRef} />

          <div className="relative z-10 h-full">
            <Hero />
          </div>

          <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-[15svh]">
            <Manifesto />
          </div>
        </div>
      </div>

      <Sobre />
      <Espaco />
      <Contato />
    </main>
  )
}
