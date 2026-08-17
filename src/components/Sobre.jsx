import janaFoto from '../assets/jana.webp'

/**
 * A trajetoria da Janaina e mesmo uma sequencia — por isso os marcos
 * aparecem datados. Todos os fatos vem do texto que ela escreveu.
 */
const TRAJETORIA = [
  {
    marco: '5 anos',
    texto:
      'Começa a tocar piano. É a terceira geração de musicistas da família.',
  },
  {
    marco: '15 anos',
    texto:
      'Dá a primeira aula e faz o primeiro atendimento — uma jovem paraplégica e neurodivergente. Torna-se sócia da mãe, Lúcia Maria Lima Silva, no Centro Musical Beethoven.',
  },
  {
    marco: '29 anos',
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

export default function Sobre() {
  return (
    <section id="janaina" className="relative bg-page py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* retrato */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div
                className="absolute -inset-4 -z-10 rounded-[2rem] bg-sage-100"
                aria-hidden="true"
              />
              <img
                src={janaFoto}
                alt="Janaína Lima Zumach sorrindo, segurando um chocalho, sentada atrás de um atabaque no espaço Music'art"
                width={880}
                height={1100}
                loading="lazy"
                decoding="async"
                className="w-full rounded-[1.5rem] object-cover shadow-sm"
              />
            </div>
          </div>

          {/* texto */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-600">
              Quem conduz
            </span>

            <h2 className="mt-5 font-display text-[2.1rem] font-light leading-[1.08] tracking-[-0.025em] text-ink text-balance sm:text-[2.9rem]">
              Janaína Lima Zumach
            </h2>

            <p className="mt-3 text-[15px] font-light text-ink-mute">
              Musicoterapeuta, educadora musical, pianista e multi-instrumentista
            </p>

            <div className="mt-7 space-y-5 text-[16px] font-light leading-relaxed text-ink-soft sm:text-[17px]">
              <p>
                Formada em teoria musical e piano pelo Conservatório Brasileiro
                do Rio de Janeiro e pós-graduada em musicoterapia pelo Instituto
                Fênix — Facetc, Janaína construiu sua trajetória dentro da sala
                de aula antes de chegar ao atendimento clínico.
              </p>
              <p>
                Ao longo dos anos à frente da Music’art, percebeu que a maior
                parte de quem procurava o espaço eram crianças e adolescentes
                neurodivergentes. Foi o que a levou de volta aos estudos — e ao
                trabalho que faz hoje.
              </p>
            </div>

            <blockquote className="mt-9 border-l-2 border-brand-300 pl-6">
              <p className="font-display text-[1.15rem] font-light italic leading-relaxed text-ink sm:text-[1.3rem]">
                “Não são somente atendimentos técnicos. É uma troca de
                conhecimento, de desenvolvimento humano — onde a melodia que se
                escuta, o instrumento que se toca, é o amor.”
              </p>
              <cite className="mt-3 block text-[13px] not-italic text-ink-mute">
                Janaína Lima Zumach
              </cite>
            </blockquote>
          </div>
        </div>

        {/* trajetoria */}
        <ol className="mt-20 grid gap-x-8 gap-y-10 border-t border-sage-200 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {TRAJETORIA.map(({ marco, texto }) => (
            <li key={marco}>
              <div className="font-display text-[1.6rem] font-light text-brand-600 tabular-nums">
                {marco}
              </div>
              <p className="mt-2 text-[15px] font-light leading-relaxed text-ink-soft">
                {texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
