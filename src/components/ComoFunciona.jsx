import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

/*
 * Os tres passos descrevem o percurso de quem chega, sem afirmar duracao,
 * frequencia ou preco — nada disso veio no material. Confirmar com a
 * Janaina antes de publicar (ver pendencias no README).
 */
const PASSOS = [
  {
    titulo: 'A primeira conversa',
    texto:
      'Serve para entender a história, o momento e os objetivos de quem chega. Sem compromisso e sem instrumento na mão.',
  },
  {
    titulo: 'O plano de atendimento',
    texto:
      'Construído junto, a partir do que foi conversado. É ele que define o foco do trabalho — e ele muda quando precisa mudar.',
  },
  {
    titulo: 'As sessões',
    texto:
      'O encontro acontece no ritmo da pessoa. O que se toca, se canta ou se escuta é escolhido a cada dia.',
  },
]

const MODALIDADES = [
  {
    titulo: 'No espaço',
    texto: 'Sala preparada, com os instrumentos todos ao alcance.',
    icone: (
      <>
        <path d="M12 21s7-5.6 7-10.5a7 7 0 1 0-14 0C5 15.4 12 21 12 21Z" />
        <circle cx="12" cy="10.4" r="2.4" />
      </>
    ),
  },
  {
    titulo: 'A domicílio',
    texto: 'Quando o ambiente de casa é o que dá segurança para começar.',
    icone: (
      <>
        <path d="M3.5 10.8 12 4.2l8.5 6.6V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-9.2Z" />
        <path d="M9.6 21v-5.4h4.8V21" />
      </>
    ),
  },
  {
    titulo: 'Online',
    texto: 'Para quem está longe ou não pode se deslocar naquele período.',
    icone: (
      <>
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
]

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative py-16 sm:py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHead
          align="center"
          label="Como funciona"
          title="Do primeiro contato à primeira sessão."
          lead="Nada aqui começa por técnica. Começa por entender quem chegou."
        />

        <ol className="relative mt-10 grid gap-8 sm:mt-14 sm:gap-10 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {/* fio que costura os tres passos no desktop */}
          <span
            className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent lg:block"
            aria-hidden="true"
          />

          {PASSOS.map(({ titulo, texto }, i) => (
            <Reveal as="li" key={titulo} delay={i * 100} className="relative lg:px-6 lg:text-center">
              <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-400 bg-page font-display text-[14px] font-semibold tabular-nums text-brand-800 sm:h-[52px] sm:w-[52px] sm:text-[15px]">
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3 className="mt-4 font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.012em] text-ink sm:mt-6 sm:text-[1.32rem]">
                {titulo}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-[1.65] text-ink-soft sm:mt-3 sm:text-[15.5px] sm:leading-[1.72]">
                {texto}
              </p>
            </Reveal>
          ))}
        </ol>

        {/* modalidades */}
        <div className="mt-14 border-t border-cream-300/80 pt-10 sm:mt-24 sm:pt-16">
          <Reveal>
            <h3 className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute sm:text-[11px] sm:tracking-[0.24em]">
              Modalidades de atendimento
            </h3>
          </Reveal>

          <ul className="mt-6 grid gap-3.5 sm:mt-10 sm:grid-cols-3 sm:gap-5">
            {MODALIDADES.map(({ titulo, texto, icone }, i) => (
              <Reveal as="li" key={titulo} delay={i * 80}>
                <div className="flex h-full items-start gap-3.5 rounded-2xl border border-cream-300/70 bg-cream-100/70 p-4 transition-colors duration-500 hover:border-brand-400/70 hover:bg-cream-100 sm:gap-4 sm:p-6">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {icone}
                  </svg>
                  <div>
                    <h4 className="text-[15px] font-semibold text-ink sm:text-[15.5px]">
                      {titulo}
                    </h4>
                    <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-soft sm:mt-1.5 sm:text-[14.5px] sm:leading-[1.65]">
                      {texto}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
