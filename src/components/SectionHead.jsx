import Reveal from './Reveal.jsx'
import SplitReveal from './SplitReveal.jsx'

/**
 * Cabeçalho padrão das seções: etiqueta, título e (opcional) linha de apoio.
 * Centraliza a escala tipográfica num lugar só — se ela mudar, muda aqui.
 */
export default function SectionHead({
  label,
  title,
  lead,
  align = 'left',
  tone = 'light',
  className = '',
}) {
  const dark = tone === 'dark'
  const centered = align === 'center'

  return (
    <div
      className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}
    >
      <Reveal>
        <span
          className={`flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] sm:gap-3 sm:text-[11px] sm:tracking-[0.24em] ${
            centered ? 'justify-center' : ''
          } ${dark ? 'text-brand-300' : 'text-brand-700'}`}
        >
          <span
            className={`h-px w-5 sm:w-6 ${dark ? 'bg-brand-400/70' : 'bg-brand-500/80'}`}
            aria-hidden="true"
          />
          {label}
        </span>
      </Reveal>

      <SplitReveal
        text={title}
        delay={90}
        className={`mt-4 font-display text-[clamp(1.5rem,5.6vw,2rem)] font-semibold leading-[1.14] tracking-[-0.025em] text-balance sm:mt-6 sm:text-[2.4rem] sm:leading-[1.1] lg:text-[2.9rem] ${
          dark ? 'text-cream-50' : 'text-ink'
        }`}
      />

      {lead && (
        <Reveal delay={150}>
          <p
            className={`mt-4 text-[15px] leading-[1.68] sm:mt-6 sm:text-[16.5px] sm:leading-[1.75] lg:text-[17.5px] ${
              dark ? 'text-cream-200/85' : 'text-ink-soft'
            }`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  )
}
