export default function Hero() {
  return (
    <section className="mx-auto flex h-full max-w-7xl items-start px-6 pt-[11svh] sm:px-8 lg:items-center lg:px-12 lg:pt-0">
      <div className="hero-fade w-full lg:w-[54%]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-mute">
            Music&rsquo;art &middot; Espaço Terapêutico
          </span>
        </div>

        <h1 className="mt-7 font-display text-[2.5rem] font-light leading-[1.04] tracking-[-0.025em] text-ink text-balance sm:text-[3.4rem] lg:text-[4.2rem]">
          A música alcança onde as{' '}
          <span className="text-brand-600">palavras</span> ainda não chegam.
        </h1>

        <p className="mt-7 max-w-xl text-[17px] font-light leading-relaxed text-ink-soft sm:text-lg">
          Musicoterapia clínica e educação musical com abordagem terapêutica.
          Um espaço acolhedor para desenvolver fala, comunicação, socialização
          e equilíbrio emocional — sempre no tempo de cada pessoa.
        </p>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          <a
            href="#contato"
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 text-[15px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            Agende uma conversa
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

          <a
            href="#janaina"
            className="inline-flex items-center px-1 py-2 text-[15px] text-ink-soft underline-offset-8 transition-colors duration-300 hover:text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            Conheça a Janaína
          </a>
        </div>

        <div className="scroll-cue mt-14 hidden items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-ink-mute lg:flex">
          <span className="h-px w-8 bg-sage-400" />
          role para continuar
        </div>
      </div>
    </section>
  )
}
