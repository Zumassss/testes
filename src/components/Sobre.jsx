import janaFoto from '../assets/jana.webp'
import Reveal from './Reveal.jsx'

const CREDENCIAIS = [
  ['Formação', 'Teoria musical e piano — Conservatório Brasileiro do Rio de Janeiro'],
  ['Pós-graduação', 'Musicoterapia — Instituto Fênix / Facetc'],
  ['Também atua como', 'Educadora musical, pianista e multi-instrumentista'],
]

export default function Sobre() {
  return (
    <section id="janaina" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* retrato */}
          <Reveal className="lg:col-span-5">
            <figure className="relative">
              <div
                className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-brand-300/50"
                aria-hidden="true"
              />
              <img
                src={janaFoto}
                alt="Janaína Lima Zumach sorrindo, segurando um chocalho, sentada atrás de um atabaque no espaço Music'art"
                width={880}
                height={1100}
                loading="lazy"
                decoding="async"
                className="relative w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-35px_rgba(13,38,32,0.5)]"
              />
              <figcaption className="absolute -bottom-6 right-4 rounded-2xl border border-sage-200/80 bg-page/90 px-5 py-4 shadow-[0_18px_40px_-28px_rgba(13,38,32,0.6)] backdrop-blur-sm sm:right-6">
                <span className="block font-display text-[1.7rem] font-light leading-none text-brand-600 tabular-nums">
                  2011
                </span>
                <span className="mt-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-ink-mute">
                  Music&rsquo;art nasce
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* texto */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-brand-600">
                <span className="h-px w-6 bg-brand-400/70" aria-hidden="true" />
                Quem conduz
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3rem)] font-light leading-[1.08] tracking-[-0.03em] text-ink text-balance">
                Janaína Lima Zumach
              </h2>
              <p className="mt-4 text-[15px] font-light text-ink-mute">
                Musicoterapeuta &middot; terceira geração de musicistas da
                família
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-8 space-y-5 text-[16.5px] font-light leading-[1.78] text-ink-soft sm:text-[17.5px]">
                <p>
                  Janaína começou a tocar piano aos cinco anos e deu a primeira
                  aula aos quinze — no mesmo ano em que fez seu primeiro
                  atendimento, com uma jovem paraplégica e neurodivergente. A
                  trajetória dela se construiu dentro da sala de aula, muito
                  antes de chegar ao atendimento clínico.
                </p>
                <p>
                  Ao longo dos anos à frente da Music&rsquo;art, percebeu que a
                  maior parte de quem procurava o espaço eram crianças e
                  adolescentes neurodivergentes. Foi o que a levou de volta aos
                  estudos — e ao trabalho que faz hoje.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <dl className="mt-10 space-y-4 border-t border-sage-200/80 pt-8">
                {CREDENCIAIS.map(([termo, desc]) => (
                  <div key={termo} className="sm:flex sm:gap-6">
                    <dt className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-mute sm:w-40 sm:shrink-0 sm:pt-1">
                      {termo}
                    </dt>
                    <dd className="mt-1 text-[15px] font-light leading-relaxed text-ink-soft sm:mt-0">
                      {desc}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* citacao */}
        <Reveal>
          <blockquote className="relative mx-auto mt-24 max-w-4xl text-center sm:mt-32">
            <span
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[7rem] leading-none text-brand-300/35"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="relative font-display text-[clamp(1.35rem,3.2vw,2.1rem)] font-light italic leading-[1.4] tracking-[-0.015em] text-ink text-balance">
              Não são somente atendimentos técnicos. É uma troca de
              conhecimento, de desenvolvimento humano — onde a melodia que se
              escuta, o instrumento que se toca, é o amor.
            </p>
            <footer className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-sage-300" aria-hidden="true" />
              <cite className="text-[13px] not-italic tracking-wide text-ink-mute">
                Janaína Lima Zumach
              </cite>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
