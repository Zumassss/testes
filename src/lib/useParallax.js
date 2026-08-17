import { useEffect, useRef } from 'react'

/**
 * Paralaxe leve num elemento: ele anda um pouco mais devagar que a página.
 *
 * Escreve numa variável CSS (--py) em vez de mexer no style.transform direto,
 * assim a classe .paralaxe continua dona do transform e nada aqui provoca
 * re-render. O listener só trabalha quando o elemento está na tela.
 *
 * @param {number} forca deslocamento máximo, em px
 */
export default function useParallax(forca = 60) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let visivel = false
    let ticking = false

    const update = () => {
      ticking = false
      const r = el.getBoundingClientRect()
      const meio = window.innerHeight / 2
      /* -1 quando o elemento esta bem abaixo, +1 quando ja subiu */
      const t = (meio - (r.top + r.height / 2)) / (window.innerHeight / 2 + r.height / 2)
      el.style.setProperty('--py', `${(-t * forca).toFixed(1)}px`)
    }

    const onScroll = () => {
      if (!visivel || ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visivel = entry.isIntersecting
        if (visivel) update()
      },
      { rootMargin: '20% 0px' },
    )
    io.observe(el)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [forca])

  return ref
}
