import janaFoto from '../assets/jana.webp'
import selo from '../assets/selo-musicoterapia.webp'
import Reveal from './Reveal.jsx'
import useParallax from '../lib/useParallax.js'

const CREDENCIAIS = [
  ['Formação', 'Teoria musical e piano — Conservatório Brasileiro do Rio de Janeiro'],
  ['Pós-graduação', 'Musicoterapia — Instituto Fênix / Facetc'],
  ['Também atua como', 'Educadora musical, pianista e multi-instrumentista'],
]

export default function Sobre() {
  const retrato = useParallax(40)

  return (
    <section id="janaina" className="relative py-16 sm:py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-20">
          {/* retrato */}
          <Reveal className="lg:col-span-5">
            <figure ref={retrato} className="paralaxe relative">
              <div
                className="absolute -left-3 -top-3 h-full w-full rounded-[1.75rem] border border-brand-400/50 sm:-left-4 sm:-top-4 sm:rounded-[2rem]"
                aria-hidden="true"
              />
              <img
                src={janaFoto}
                alt="Janaina Lima Zumach sorrindo, segurando um chocalho, sentada atrás de um atabaque no espaço Music'art"
                width={880}
                height={1100}
                loading="lazy"
                decoding="async"
                className="relative w-full rounded-[1.75rem] object-cover shadow-[0_28px_58px_-34px_rgba(58,39,18,0.5)] sm:rounded-[2rem]"
              />
              <figcaption className="absolute -bottom-5 right-3 rounded-2xl border border-cream-300/80 bg-cream-50/95 px-4 py-3 shadow-[0_16px_36px_-26px_rgba(58,39,18,0.6)] sm:right-6 sm:px-5 sm:py-4">
                <span className="block font-display text-[1.4rem] font-semibold leading-none text-brand-700 tabular-nums sm:text-[1.7rem]">
                  2011
                </span>
                <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-mute sm:text-[11px]">
                  Music&rsquo;art nasce
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* texto */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700 sm:gap-3 sm:text-[11px] sm:tracking-[0.24em]">
                <span className="h-px w-5 bg-brand-500/80 sm:w-6" aria-hidden="true" />
                Quem conduz
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-4 font-display text-[clamp(1.6rem,6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.028em] text-ink text-balance sm:mt-6">
                Janaina Lima Zumach
              </h2>
              <p className="mt-3 text-[14px] text-ink-mute sm:mt-4 sm:text-[15px]">
                Musicoterapeuta &middot; terceira geração de musicistas da
                família
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-ink-soft sm:mt-8 sm:space-y-5 sm:text-[16.5px] sm:leading-[1.78] lg:text-[17.5px]">
                <p>
                  Janaina começou a tocar piano aos cinco anos e deu a primeira
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
              <div className="mt-8 flex flex-col gap-6 border-t border-cream-300/80 pt-6 sm:mt-10 sm:pt-8 lg:flex-row lg:gap-10">
                <dl className="flex-1 space-y-3.5 sm:space-y-4">
                  {CREDENCIAIS.map(([termo, desc]) => (
                    <div key={termo} className="sm:flex sm:gap-6">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-mute sm:w-36 sm:shrink-0 sm:pt-1 sm:text-[10.5px]">
                        {termo}
                      </dt>
                      <dd className="mt-1 text-[14px] leading-relaxed text-ink-soft sm:mt-0 sm:text-[15px]">
                        {desc}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/*
                  Emblema da musicoterapia: e o simbolo da PROFISSAO, nao da
                  Music'art. Fica aqui, junto das credenciais, com legenda —
                  no lugar onde diz o que a Janaina e, nao onde diz de quem
                  e a marca.
                */}
                <figure className="flex shrink-0 items-center gap-3 rounded-2xl border border-cream-300/80 bg-cream-100/60 px-4 py-3 lg:w-44 lg:flex-col lg:gap-2 lg:px-4 lg:py-5 lg:text-center">
                  <img
                    src={selo}
                    alt="Emblema da musicoterapia"
                    width={400}
                    height={399}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 lg:h-16 lg:w-16"
                  />
                  <figcaption className="text-[11px] leading-snug text-ink-mute">
                    Emblema oficial da musicoterapia
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          </div>
        </div>

        {/* citacao */}
        <Reveal>
          <blockquote className="relative mx-auto mt-16 max-w-4xl text-center sm:mt-24 lg:mt-32">
            <span
              className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 font-display text-[4.5rem] leading-none text-brand-400/40 sm:-top-10 sm:text-[7rem]"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="relative font-display text-[clamp(1.15rem,4.4vw,2.1rem)] font-medium italic leading-[1.4] tracking-[-0.015em] text-ink text-balance">
              Não são somente atendimentos técnicos. É uma troca de
              conhecimento, de desenvolvimento humano — onde a melodia que se
              escuta, o instrumento que se toca, é o amor.
            </p>
            <footer className="mt-6 flex items-center justify-center gap-3 sm:mt-8">
              <span className="h-px w-8 bg-brand-400" aria-hidden="true" />
              <cite className="text-[12.5px] not-italic tracking-wide text-ink-mute sm:text-[13px]">
                Janaina Lima Zumach
              </cite>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
