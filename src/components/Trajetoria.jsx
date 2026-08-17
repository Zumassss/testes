import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

/**
 * A trajetoria da Janaina e mesmo uma sequencia — por isso os marcos
 * aparecem datados. Todos os fatos vem do texto que ela escreveu.
 */
const MARCOS = [
  {
    marco: '5 anos',
    texto:
      'Começa a tocar piano, seguindo a mãe e a avó. É a terceira geração de musicistas da família.',
  },
  {
    marco: '15 anos',
    texto:
      'Dá a primeira aula e faz o primeiro atendimento — uma jovem paraplégica e neurodivergente. No mesmo período torna-se sócia da mãe, Lúcia Maria Lima Silva, no Centro Musical Beethoven.',
  },
  {
    marco: '29 anos de escola',
    texto:
      'É o tempo de estrada do Centro Musical Beethoven, que chegou a mais de 200 alunos em diversos instrumentos.',
  },
  {
    marco: '2011',
    texto: 'Abre a Music’art, sua própria empresa.',
  },
  {
    marco: '2016',
    texto:
      'Inicia a pós-graduação em musicoterapia e estagia na AMAES — Associação dos Amigos Artistas do Espírito Santo.',
  },
  {
    marco: 'Hoje',
    texto:
      'Atende presencialmente, a domicílio e online, com foco em crianças e adolescentes neurodivergentes.',
  },
]

export default function Trajetoria() {
  return (
    <section className="relative pb-24 sm:pb-32 lg:pb-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-sage-200/70 bg-white/50 px-7 py-12 backdrop-blur-sm sm:rounded-[2.5rem] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <SectionHead
            label="Trajetória"
            title="Quase quatro décadas entre o ensino e o cuidado."
          />

          <ol className="relative mt-14 max-w-3xl">
            <span
              className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-brand-400/70 via-sage-300 to-transparent"
              aria-hidden="true"
            />

            {MARCOS.map(({ marco, texto }, i) => (
              <Reveal as="li" key={marco} delay={i * 60} className="relative flex gap-6 pb-11 last:pb-0 sm:gap-8">
                <span
                  className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border border-brand-400 bg-page"
                  aria-hidden="true"
                >
                  <span className="absolute inset-[3.5px] rounded-full bg-brand-500" />
                </span>

                <div>
                  <h3 className="font-display text-[1.45rem] font-semibold leading-none tracking-[-0.01em] text-brand-600 tabular-nums">
                    {marco}
                  </h3>
                  <p className="mt-3 max-w-xl text-[15.5px] font-light leading-[1.72] text-ink-soft">
                    {texto}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
