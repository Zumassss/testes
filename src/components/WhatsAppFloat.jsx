import { useEffect, useState } from 'react'
import { WHATSAPP_LINK } from '../lib/contato.js'

/**
 * Atalho permanente para o WhatsApp, no canto inferior direito.
 *
 * So aparece depois que o hero sai da tela: no topo o CTA principal ja esta
 * ali do lado, e dois botoes competindo pelo mesmo clique atrapalham mais do
 * que ajudam.
 */
export default function WhatsAppFloat() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="zap" data-visivel={visivel}>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Janaína no WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25a86c] text-white shadow-[0_14px_34px_-10px_rgba(20,80,55,0.55)] transition-all duration-500 ease-out hover:w-[13.5rem] hover:bg-[#1f9560] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:h-15 sm:w-15"
      >
        {visivel && <span className="zap-anel" aria-hidden="true" />}

        <svg
          className="relative h-7 w-7 shrink-0 transition-all duration-500 ease-out group-hover:ml-[-8.5rem]"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24Zm-2.6 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.76-1.8-.2-.47-.4-.41-.55-.41h-.47Z" />
        </svg>

        <span className="pointer-events-none absolute right-6 whitespace-nowrap text-[14.5px] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-200">
          Falar no WhatsApp
        </span>
      </a>
    </div>
  )
}
