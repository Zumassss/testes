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
    <section className="relative pb-16 sm:pb-24 lg:pb-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="rounded-[1.5rem] border border-cream-300/70 bg-cream-100/60 px-5 py-10 sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-16 lg:py-20">
          <SectionHead
            label="Trajetória"
            title="Quase quatro décadas entre o ensino e o cuidado."
          />

          <ol className="relative mt-9 max-w-3xl sm:mt-12">
            <span
              className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-brand-500 via-brand-300 to-transparent"
              aria-hidden="true"
            />

            {MARCOS.map(({ marco, texto }, i) => (
              <Reveal as="li" key={marco} delay={i * 60} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-8 sm:pb-11">
                <span
                  className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border border-brand-500 bg-page"
                  aria-hidden="true"
                >
                  <span className="absolute inset-[3.5px] rounded-full bg-brand-600" />
                </span>

                <div>
                  <h3 className="font-display text-[1.15rem] font-semibold leading-none tracking-[-0.01em] text-brand-800 tabular-nums sm:text-[1.4rem]">
                    {marco}
                  </h3>
                  <p className="mt-2 max-w-xl text-[13.5px] leading-[1.62] text-ink-soft sm:mt-3 sm:text-[15px] sm:leading-[1.72]">
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
