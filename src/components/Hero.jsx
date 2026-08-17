export default function Hero() {
  return (
    <section
      id="topo"
      className="mx-auto flex h-full max-w-7xl items-start px-6 pt-[15svh] sm:px-8 lg:items-center lg:px-12 lg:pt-0"
    >
      <div className="hero-fade w-full lg:w-[53%]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-ink-mute">
            Musicoterapia clínica &middot; desde 2011
          </span>
        </div>

        <h1 className="mt-8 font-display text-[clamp(2.6rem,7vw,4.5rem)] font-light leading-[1.02] tracking-[-0.032em] text-ink text-balance">
          A música alcança onde as{' '}
          <em className="not-italic text-brand-600">palavras</em> ainda não
          chegam.
        </h1>

        <p className="mt-8 max-w-lg text-[17px] font-light leading-[1.75] text-ink-soft sm:text-[18px]">
          Um espaço acolhedor onde som, escuta e vínculo trabalham juntos —
          desenvolvendo fala, comunicação, socialização e equilíbrio emocional,
          sempre no tempo de cada pessoa.
        </p>

        <div className="mt-11 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a
            href="#contato"
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 text-[15px] font-medium text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-800/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
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
            className="group inline-flex items-center gap-2 py-2 text-[15px] text-ink-soft transition-colors duration-300 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 focus-visible:ring-offset-page"
          >
            <span className="border-b border-sage-300 pb-0.5 transition-colors duration-300 group-hover:border-brand-600">
              Conheça a Janaína
            </span>
          </a>
        </div>

        <dl className="mt-14 hidden max-w-md gap-8 border-t border-sage-200/80 pt-7 sm:flex">
          {[
            ['Atendimento', 'Presencial, a domicílio e online'],
            ['Foco', 'Crianças e adolescentes neurodivergentes'],
          ].map(([termo, desc]) => (
            <div key={termo} className="flex-1">
              <dt className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink-mute">
                {termo}
              </dt>
              <dd className="mt-2 text-[14px] font-light leading-snug text-ink-soft">
                {desc}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="scroll-cue absolute bottom-10 left-6 hidden items-center gap-4 sm:px-2 lg:left-12 lg:flex">
        <span className="scroll-cue-line h-10 w-px overflow-hidden bg-sage-200" />
        <span className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-ink-mute">
          Role para continuar
        </span>
      </div>
    </section>
  )
}
