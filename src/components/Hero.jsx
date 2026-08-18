import Mascote from './Mascote.jsx'

/**
 * @param {boolean} mobile  Abaixo de lg o hero e uma secao normal, com o
 *   mascote empilhado embaixo do texto. Antes o cerebro 3D ficava numa camada
 *   absoluta ATRAS do texto — no celular isso virava um borrao por baixo das
 *   letras. Aqui os dois ocupam espaco proprio e nao se sobrepoem.
 */
export default function Hero({ mobile = false }) {
  const texto = (
    <div className={mobile ? 'w-full' : 'hero-fade w-full lg:w-[52%]'}>
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute sm:text-[11px] sm:tracking-[0.24em]">
          Musicoterapia clínica &middot; desde 2011
        </span>
      </div>

      <h1 className="mt-5 font-display text-[clamp(1.85rem,7.6vw,4.2rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink text-balance sm:mt-7 lg:text-[clamp(2.4rem,min(6vw,8svh),4.2rem)] lg:leading-[1.03]">
        A música alcança onde as{' '}
        <em className="not-italic text-brand-700">palavras</em> ainda não
        chegam.
      </h1>

      {/* Uma linha so. A explicacao do metodo vive nas secoes seguintes;
          aqui o trabalho e convidar, e texto longo no hero afasta. */}
      <p className="mt-4 max-w-lg text-[16px] font-medium leading-[1.55] text-ink-soft sm:mt-6 sm:text-[18px] lg:text-[19px]">
        Musicoterapia clínica para crianças e adolescentes.
        <br className="hidden sm:block" />{' '}
        <span className="text-ink">A primeira conversa é só para escutar.</span>
      </p>

      <div className="mt-7 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-5 lg:mt-10">
        <a
          href="#contato"
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-700 px-7 py-3.5 text-[15px] font-semibold text-cream-50 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-900/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 sm:px-8 sm:py-4"
        >
          Agende uma conversa
          <svg
            className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.5 8h11M9.5 4l4 4-4 4" />
          </svg>
        </a>

        <a
          href="#janaina"
          className="group inline-flex items-center justify-center gap-2 py-2 text-[15px] text-ink-soft transition-colors duration-300 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-4 focus-visible:ring-offset-page sm:justify-start"
        >
          <span className="border-b border-brand-400 pb-0.5 transition-colors duration-300 group-hover:border-brand-700">
            Conheça a Janaina
          </span>
        </a>
      </div>
    </div>
  )

  /* ---------------- celular / tablet ---------------- */
  if (mobile) {
    return (
      <section
        id="topo"
        className="relative mx-auto max-w-3xl px-6 pb-4 pt-28 sm:px-8 sm:pt-32"
      >
        {texto}

        <div className="relative mt-12 flex justify-center sm:mt-14">
          {/* disco de cor atras do personagem: separa ele do fundo */}
          <span
            className="absolute bottom-[6%] left-1/2 -z-10 h-[72%] w-[82%] max-w-[340px] -translate-x-1/2 rounded-full bg-brand-300/55"
            aria-hidden="true"
          />
          <Mascote largura={230} prioridade className="sm:!w-[280px]" />
        </div>
      </section>
    )
  }

  /* ---------------- desktop ---------------- */
  return (
    <section
      id="topo"
      className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pb-10 pt-24 sm:px-8 lg:px-12"
    >
      {texto}

      <div className="scroll-cue pointer-events-none absolute bottom-9 left-6 hidden items-center gap-4 lg:left-12 lg:flex">
        <span className="scroll-cue-line h-10 w-px overflow-hidden bg-brand-300" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-mute">
          Role para continuar
        </span>
      </div>
    </section>
  )
}
