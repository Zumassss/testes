import { useEffect, useRef } from 'react'

/**
 * Revela um titulo palavra a palavra: cada uma sobe de dentro da propria
 * janela, em cascata. Toda a transicao vive no CSS — aqui so cai a classe,
 * entao nao ha trabalho por frame nem re-render.
 *
 * Recebe `text` como string (nao children) porque precisa fatiar em palavras.
 */
export default function SplitReveal({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  step = 55,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-in')
        io.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  const palavras = String(text).split(' ')

  return (
    <Tag ref={ref} className={`split ${className}`}>
      {palavras.map((palavra, i) => (
        <span key={`${palavra}-${i}`}>
          <span className="split-w">
            <span
              className="split-i"
              style={{ transitionDelay: `${delay + i * step}ms` }}
            >
              {palavra}
            </span>
          </span>
          {i < palavras.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
