import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#musicoterapia', label: 'Musicoterapia' },
  { href: '#janaina', label: 'A Janaina' },
  { href: '#espaco', label: 'O espaço' },
  { href: '#como-funciona', label: 'Como funciona' },
]

function Marca({ dark }) {
  return (
    <span className="flex items-center gap-2.5">
      {/* barras de equalizador: o som, reduzido ao minimo legivel */}
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition-colors duration-500 ${
          dark ? 'text-brand-300' : 'text-brand-600'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M3 10.5v3M8 6.5v11M13 9v6M18 4.5v15" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[17px] font-semibold tracking-[-0.01em] transition-colors duration-500 ${
            dark ? 'text-white' : 'text-ink'
          }`}
        >
          Music&rsquo;art
        </span>
        <span
          className={`mt-1 text-[9.5px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${
            dark ? 'text-brand-200/70' : 'text-ink-mute'
          }`}
        >
          Espaço terapêutico
        </span>
      </span>
    </span>
  )
}

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Sobre a secao escura a barra clara ficaria como uma tarja colada na
    // tela. Em vez de esconder a barra, ela inverte.
    const onScroll = () => {
      setSolid(window.scrollY > 40)
      const escura = document.getElementById('espaco')
      if (!escura) return
      const r = escura.getBoundingClientRect()
      setDark(r.top <= 38 && r.bottom >= 38)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // o painel mobile trava o corpo; fechar no Esc evita ficar preso nele
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ease-out ${
        solid
          ? dark
            ? 'border-white/10 bg-brand-950/75 backdrop-blur-md'
            : 'border-sage-200/70 bg-page/80 backdrop-blur-md'
          : 'border-transparent'
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12"
      >
        <a
          href="#topo"
          className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 focus-visible:ring-offset-page"
        >
          <Marca dark={dark} />
          <span className="sr-only">Music&rsquo;art — início</span>
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`link-sub relative text-[14.5px] font-light transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 focus-visible:ring-offset-page ${
                  dark
                    ? 'text-brand-100/75 hover:text-white'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contato"
            className={`hidden rounded-full border px-5 py-2.5 text-[14px] font-medium transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:inline-flex ${
              dark
                ? 'border-white/25 text-white hover:border-white/60 hover:bg-white hover:text-brand-900'
                : 'border-brand-600/25 text-brand-700 hover:border-brand-600/50 hover:bg-brand-600 hover:text-white'
            }`}
          >
            Agendar conversa
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 lg:hidden ${
              dark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-sage-100'
            }`}
          >
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3.5 8h17M3.5 16h17" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* painel mobile: grid-rows animado evita medir altura no JS */}
      <div
        id="menu-mobile"
        className={`grid overflow-hidden border-t border-sage-200/70 bg-page/95 backdrop-blur-md transition-[grid-template-rows,opacity] duration-500 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <ul className="min-h-0 px-6 sm:px-8">
          {LINKS.map(({ href, label }) => (
            <li key={href} className="border-b border-sage-200/60 last:border-0">
              <a
                href={href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="block py-4 font-display text-[19px] font-medium text-ink"
              >
                {label}
              </a>
            </li>
          ))}
          <li className="py-5">
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-[15px] font-medium text-white"
            >
              Agendar conversa
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
