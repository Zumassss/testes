import Reveal from './Reveal.jsx'

/**
 * Nenhum dado de contato real foi informado ainda — WhatsApp, e-mail,
 * endereco e redes estao como placeholder marcado, para nao publicar
 * informacao inventada. Trocar o href antes de ir ao ar (ver README).
 */
const WHATSAPP = '#TROCAR-WHATSAPP'

export default function Contato() {
  return (
    <section id="contato" className="relative pb-24 pt-8 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-sage-200/80 px-7 py-16 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-20 lg:py-24">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(160deg, rgba(240,247,244,0.95), rgba(246,236,231,0.85))',
              }}
            />

            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-brand-600">
              Primeiro passo
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.6vw,3rem)] font-light leading-[1.08] tracking-[-0.03em] text-ink text-balance">
              Vamos conversar sobre o que você precisa.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-[16.5px] font-light leading-[1.75] text-ink-soft sm:text-[17.5px]">
              A primeira conversa serve para entender a história, o momento e os
              objetivos de quem chega. A partir dela, o plano de atendimento é
              construído junto.
            </p>

            <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <a
                href={WHATSAPP}
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 text-[15px] font-medium text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-800/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                Falar com a Janaína
                <svg
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 8h11M9.5 4l4 4-4 4" />
                </svg>
              </a>
            </div>

            <p className="mt-10 text-[13.5px] font-light text-ink-mute">
              Atendimento presencial, a domicílio e online.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
