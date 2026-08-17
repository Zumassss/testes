import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

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
    <section
      id="musicoterapia"
      className="relative py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHead
          label="O que a música desenvolve"
          title="Um estímulo só, muitos caminhos abertos ao mesmo tempo."
          lead="Cada encontro é montado a partir do que a pessoa traz naquele dia — o instrumento, a canção e o andamento mudam, o cuidado não."
        />

        <ul className="mt-16 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {EFEITOS.map(({ titulo, texto, icone }, i) => (
            <Reveal as="li" key={titulo} delay={i * 70}>
              <div className="group h-full rounded-2xl border border-sage-200/70 bg-white/55 p-7 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-brand-300/70 hover:bg-white/80 hover:shadow-[0_18px_40px_-24px_rgba(20,61,51,0.35)] sm:p-8">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-500 group-hover:bg-brand-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[22px] w-[22px]"
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

                <h3 className="mt-6 font-display text-[1.28rem] font-normal leading-snug tracking-[-0.01em] text-ink">
                  {titulo}
                </h3>

                <p className="mt-3 text-[15px] font-light leading-[1.7] text-ink-soft">
                  {texto}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
