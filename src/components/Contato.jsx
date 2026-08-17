/**
 * Nenhum dado de contato real foi informado ainda — telefone, e-mail,
 * WhatsApp, endereco e redes estao como placeholder marcado para nao
 * publicar informacao inventada. Trocar os href antes de ir ao ar.
 */
export default function Contato() {
  return (
    <section id="contato" className="relative bg-page py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-600">
          Primeiro passo
        </span>

        <h2 className="mt-5 font-display text-[2.1rem] font-light leading-[1.08] tracking-[-0.025em] text-ink text-balance sm:text-[2.9rem]">
          Vamos conversar sobre o que você precisa.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-[16px] font-light leading-relaxed text-ink-soft sm:text-[17px]">
          A primeira conversa serve para entender a história, o momento e os
          objetivos de quem chega. A partir dela, o plano de atendimento é
          construído junto.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
          <a
            href="#TROCAR-WHATSAPP"
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 text-[15px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
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

        <p className="mt-12 text-[13px] font-light text-ink-mute">
          Atendimento presencial, a domicílio e online.
        </p>
      </div>

      <footer className="mx-auto mt-20 max-w-7xl border-t border-sage-200 px-6 pt-8 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-3 text-[13px] font-light text-ink-mute sm:flex-row">
          <span>Music’art Espaço Terapêutico</span>
          <span>Janaína Lima Zumach &middot; Musicoterapeuta</span>
        </div>
      </footer>
    </section>
  )
}
