import { useEffect, useRef } from 'react'

/**
 * Revela o conteudo quando ele entra na tela — uma vez so, e o observer se
 * desliga. Toda a transicao vive no CSS (.reveal / .is-in); aqui so cai a
 * classe, entao nao ha re-render nem trabalho por frame.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  ...rest
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
