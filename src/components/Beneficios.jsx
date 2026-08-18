import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'
import Equalizador from './Equalizador.jsx'
import Mascote from './Mascote.jsx'

/* posicao do cursor -> variaveis CSS que movem o brilho do cartao */
const seguirCursor = (event) => {
  const r = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - r.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - r.top}px`)
}

/*
 * Os seis efeitos vem do material que a Janaina enviou sobre o trabalho da
 * Music'art. O texto de apoio de cada um descreve o efeito, sem prometer
 * resultado clinico — nada aqui foi inventado alem disso.
 */
const EFEITOS = [
  {
    titulo: 'Estimulação da fala',
    texto:
      'Ritmo, melodia e respiração sustentam a emissão da voz. Cantar costuma abrir passagem onde falar ainda custa.',
    icone: (
      <>
        <path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4 20l1.3-4.1A7.5 7.5 0 1 1 20 12Z" />
        <path d="M9 11v2M12 9.5v5M15 11v2" />
      </>
    ),
  },
  {
    titulo: 'Desenvolvimento cognitivo',
    texto:
      'Atenção, memória e organização do pensamento são exigidas ao mesmo tempo por uma única atividade musical.',
    icone: (
      <>
        <circle cx="6" cy="8" r="2" />
        <circle cx="17.5" cy="6.5" r="2" />
        <circle cx="12" cy="16.5" r="2" />
        <path d="M7.7 9.4 10.7 15M15.9 8.1 13.2 15M8 8.4l7.5-1.5" />
      </>
    ),
  },
  {
    titulo: 'Melhora da comunicação',
    texto:
      'Tocar é revezar, esperar a vez e responder. A conversa acontece no som antes de acontecer na frase.',
    icone: (
      <>
        <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h6A2.5 2.5 0 0 1 15 8.5v3A2.5 2.5 0 0 1 12.5 14H8l-4 3v-8.5Z" />
        <path d="M17 10h.5A2.5 2.5 0 0 1 20 12.5v3A2.5 2.5 0 0 1 17.5 18H16l-2.5 2.5" />
      </>
    ),
  },
  {
    titulo: 'Socialização',
    texto:
      'Tocar junto é conviver. O encontro com o outro não é consequência do tratamento — faz parte dele.',
    icone: (
      <>
        <circle cx="9" cy="8" r="2.6" />
        <path d="M3.8 19a5.2 5.2 0 0 1 10.4 0" />
        <circle cx="17" cy="9.5" r="2.1" />
        <path d="M15 15.4a4.4 4.4 0 0 1 5.9 3.1" />
      </>
    ),
  },
  {
    titulo: 'Redução da ansiedade',
    texto:
      'Andamento lento e som previsível dão ao corpo um lugar onde se apoiar. A respiração acompanha.',
    icone: (
      <>
        <path d="M3 15c1.8 0 1.8-4 3.6-4s1.8 4 3.6 4 1.8-6 3.6-6 1.8 6 3.6 6c1.1 0 1.5-1.5 2.6-2.4" />
        <path d="M3 19.5h18" />
      </>
    ),
  },
  {
    titulo: 'Alívio do estresse',
    texto:
      'Um ambiente que não cobra desempenho. Chegar, escutar e ser escutado já é o trabalho começando.',
    icone: (
      <>
        <path d="M12 20s-7-4.4-7-9.1A4 4 0 0 1 12 8.4a4 4 0 0 1 7 2.5C19 15.6 12 20 12 20Z" />
      </>
    ),
  },
]

export default function Beneficios() {
  return (
    <section id="musicoterapia" className="relative py-16 sm:py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-6">
          <SectionHead
            label="O que a música desenvolve"
            title="Um estímulo só, muitos caminhos abertos ao mesmo tempo."
            lead="Cada encontro é montado a partir do que a pessoa traz naquele dia — o instrumento, a canção e o andamento mudam, o cuidado não."
          />
          <Mascote largura={150} className="hidden shrink-0 lg:block" alt="" />
        </div>

        <Equalizador className="mt-8 !justify-start sm:mt-10" />

        <ul className="mt-8 grid gap-3.5 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {EFEITOS.map(({ titulo, texto, icone }, i) => (
            <Reveal as="li" key={titulo} delay={i * 70} className="h-full">
              <div
                onPointerMove={seguirCursor}
                className="spot group flex h-full items-start gap-4 rounded-2xl border border-cream-300/70 bg-cream-100/70 p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-brand-400/70 hover:bg-cream-100 hover:shadow-[0_20px_44px_-26px_rgba(58,39,18,0.35)] sm:block sm:p-6 lg:p-7"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-200/70 text-brand-800 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-cream-50 sm:h-11 sm:w-11">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {icone}
                  </svg>
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-[16.5px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:mt-5 sm:text-[1.2rem] lg:text-[1.26rem]">
                    {titulo}
                  </h3>

                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-soft sm:mt-3 sm:text-[14.5px] sm:leading-[1.7] lg:text-[15px]">
                    {texto}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
