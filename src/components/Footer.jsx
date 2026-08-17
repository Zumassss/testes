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
            {/*
              Slot dos dados reais: WhatsApp, e-mail, endereco e redes.
              Nada foi preenchido porque nada foi informado.
            */}
            <a
              href="#contato"
              className="mt-6 inline-flex items-center gap-2 text-[14.5px] text-brand-700 transition-colors duration-300 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 focus-visible:ring-offset-page"
            >
              <span className="border-b border-brand-300 pb-0.5">
                Agendar uma conversa
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
