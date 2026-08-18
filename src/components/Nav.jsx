import { useEffect, useState } from 'react'
import logo from '../assets/logo.webp'

const LINKS = [
  { href: '#musicoterapia', label: 'Musicoterapia' },
  { href: '#janaina', label: 'A Janaina' },
  { href: '#espaco', label: 'O espaço' },
  { href: '#como-funciona', label: 'Como funciona' },
]

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
      setDark(r.top <= 36 && r.bottom >= 36)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-out ${
        solid
          ? dark
            ? 'border-cream-50/10 bg-brand-950/85 lg:backdrop-blur-md'
            : 'border-cream-300/70 bg-page/90 lg:backdrop-blur-md'
          : 'border-transparent'
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4 lg:px-12"
      >
        <a
          href="#topo"
          className="shrink-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-4 focus-visible:ring-offset-page"
        >
          {/* a logo tem o marrom escuro cravado, entao sobre o fundo escuro
              ela inverte para clara em vez de sumir */}
          <img
            src={logo}
            alt="Music’art — Espaço Terapêutico"
            width={880}
            height={335}
            className={`h-11 w-auto transition-all duration-500 sm:h-12 ${
              dark ? 'brightness-0 invert' : ''
            }`}
          />
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`link-sub relative text-[14.5px] font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-4 focus-visible:ring-offset-page ${
                  dark
                    ? 'text-cream-200/80 hover:text-cream-50'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href="#contato"
            className={`hidden rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 sm:inline-flex ${
              dark
                ? 'border-cream-50/30 text-cream-50 hover:bg-cream-50 hover:text-brand-900'
                : 'border-brand-600/40 text-brand-800 hover:bg-brand-700 hover:text-cream-50'
            }`}
          >
            Agendar conversa
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 lg:hidden ${
              dark ? 'text-cream-50' : 'text-ink'
            }`}
          >
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
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
        className={`grid overflow-hidden border-t border-cream-300/70 bg-page transition-[grid-template-rows,opacity] duration-400 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <ul className="min-h-0 px-5 sm:px-8">
          {LINKS.map(({ href, label }) => (
            <li key={href} className="border-b border-cream-300/60 last:border-0">
              <a
                href={href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="block py-3.5 font-display text-[17px] font-semibold text-ink"
              >
                {label}
              </a>
            </li>
          ))}
          <li className="py-4">
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-700 px-6 py-3.5 text-[15px] font-semibold text-cream-50"
            >
              Agendar conversa
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
