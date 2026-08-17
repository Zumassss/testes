import Reveal from './Reveal.jsx'

/**
 * Cabecalho padrao das secoes: etiqueta, titulo e (opcional) linha de apoio.
 * Centraliza a escala tipografica num lugar so — se ela mudar, muda aqui.
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
          className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] ${
            centered ? 'justify-center' : ''
          } ${dark ? 'text-brand-300' : 'text-brand-600'}`}
        >
          <span
            className={`h-px w-6 ${dark ? 'bg-brand-400/60' : 'bg-brand-400/70'}`}
            aria-hidden="true"
          />
          {label}
        </span>
      </Reveal>

      <Reveal delay={80}>
        <h2
          className={`mt-6 font-display text-[2rem] font-light leading-[1.1] tracking-[-0.028em] text-balance sm:text-[2.6rem] lg:text-[3rem] ${
            dark ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
      </Reveal>

      {lead && (
        <Reveal delay={150}>
          <p
            className={`mt-6 text-[16.5px] font-light leading-[1.75] sm:text-[17.5px] ${
              dark ? 'text-brand-100/85' : 'text-ink-soft'
            }`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  )
}
