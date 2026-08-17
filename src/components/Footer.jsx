import { WHATSAPP_LINK, WHATSAPP_NUMERO } from '../lib/contato.js'

const NAVEGACAO = [
  { href: '#musicoterapia', label: 'Musicoterapia' },
  { href: '#janaina', label: 'A Janaína' },
  { href: '#espaco', label: 'O espaço' },
  { href: '#como-funciona', label: 'Como funciona' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-sage-200/80">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <span className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-brand-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 10.5v3M8 6.5v11M13 9v6M18 4.5v15" />
              </svg>
              <span className="font-display text-[19px] font-normal tracking-[-0.01em] text-ink">
                Music&rsquo;art
              </span>
            </span>

            <p className="mt-5 max-w-xs text-[14.5px] font-light leading-[1.7] text-ink-soft">
              Espaço terapêutico de musicoterapia clínica e educação musical,
              conduzido por Janaína Lima Zumach.
            </p>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-3">
            <h2 className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink-mute">
              Navegação
            </h2>
            <ul className="mt-5 space-y-3">
              {NAVEGACAO.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[14.5px] font-light text-ink-soft transition-colors duration-300 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 focus-visible:ring-offset-page"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink-mute">
              Atendimento
            </h2>
            <ul className="mt-5 space-y-3 text-[14.5px] font-light text-ink-soft">
              <li>Presencial, no espaço</li>
              <li>A domicílio</li>
              <li>Online</li>
            </ul>
            {/* E-mail, endereco e redes ainda nao foram informados. */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[14.5px] text-brand-700 transition-colors duration-300 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 focus-visible:ring-offset-page"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24Zm-2.6 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.76-1.8-.2-.47-.4-.41-.55-.41h-.47Z" />
              </svg>
              <span className="border-b border-brand-300 pb-0.5 tabular-nums">
                {WHATSAPP_NUMERO}
              </span>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-sage-200/70 pt-7 text-[13px] font-light text-ink-mute sm:flex-row sm:items-center">
          <span>
            &copy; {new Date().getFullYear()} Music&rsquo;art Espaço Terapêutico
          </span>
          <span>Janaína Lima Zumach &middot; Musicoterapeuta</span>
        </div>
      </div>
    </footer>
  )
}
