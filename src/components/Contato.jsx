import Reveal from './Reveal.jsx'
import { WHATSAPP_LINK, WHATSAPP_NUMERO } from '../lib/contato.js'

/**
 * O WhatsApp e real. E-mail, endereco e redes ainda nao foram informados,
 * entao nao aparecem — nada foi preenchido por suposicao (ver README).
 */

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

            <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink text-balance">
              Vamos conversar sobre o que você precisa.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-[16.5px] font-light leading-[1.75] text-ink-soft sm:text-[17.5px]">
              A primeira conversa serve para entender a história, o momento e os
              objetivos de quem chega. A partir dela, o plano de atendimento é
              construído junto.
            </p>

            <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 text-[15px] font-medium text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-800/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24Zm-2.6 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.76-1.8-.2-.47-.4-.41-.55-.41h-.47Z" />
                </svg>
                Falar com a Janaina
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-light tabular-nums text-ink-soft transition-colors duration-300 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4"
              >
                {WHATSAPP_NUMERO}
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
