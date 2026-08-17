import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

/**
 * Secao do espaco. O texto que a Janaina enviou sobre a Music'art chegou
 * incompleto (corta em "uma pratica de ensino que utiliza..."), entao aqui
 * esta escrito so o que o material sustenta. Falta fechar: o metodo proprio,
 * como sao as sessoes, para quem, e onde fica.
 */
const PILARES = [
  {
    titulo: 'Saúde mental e emocional',
    texto:
      'Um ambiente que acolhe antes de propor. Reduzir estresse e ansiedade é parte do trabalho, não um efeito colateral dele.',
  },
  {
    titulo: 'Desenvolvimento cognitivo',
    texto:
      'Atividades musicais que exercitam atenção, memória e organização do pensamento sem parecer exercício.',
  },
  {
    titulo: 'Comunicação e fala',
    texto:
      'O som como ponte: estimulação da fala e ampliação das formas de se expressar, com ou sem palavras.',
  },
  {
    titulo: 'Socialização',
    texto:
      'Tocar junto é conviver. O encontro com o outro faz parte do tratamento desde o primeiro dia.',
  },
]

export default function Espaco() {
  return (
    <section
      id="espaco"
      className="relative isolate overflow-hidden bg-brand-950 py-24 text-white sm:py-32 lg:py-40"
    >
      {/* brilho difuso: tira o chapado do bloco escuro */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(45rem 32rem at 78% 6%, rgba(74,157,129,0.24), transparent 62%),' +
            'radial-gradient(38rem 30rem at 8% 92%, rgba(188,157,145,0.14), transparent 65%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHead
              tone="dark"
              label="O espaço"
              title="Music’art Espaço Terapêutico"
              lead="Educação musical e abordagem terapêutica no mesmo lugar. A sala é preparada para que instrumento, som e silêncio estejam sempre à mão — e para que ninguém precise chegar pronto."
            />
          </div>

          <Reveal delay={120} className="lg:col-span-6 lg:pt-24">
            <p className="font-display text-[clamp(1.25rem,2.6vw,1.65rem)] font-light italic leading-[1.5] text-brand-100/90">
              A técnica entra depois. Primeiro é preciso que a pessoa queira
              estar ali.
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {PILARES.map(({ titulo, texto }, i) => (
            <Reveal as="li" key={titulo} delay={i * 80}>
              <div className="flex items-baseline gap-3 border-t border-white/15 pt-6">
                <span className="font-display text-[13px] font-light tabular-nums text-brand-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[1.22rem] font-normal leading-snug tracking-[-0.01em] text-white">
                  {titulo}
                </h3>
              </div>
              <p className="mt-4 text-[15px] font-light leading-[1.72] text-brand-100/70">
                {texto}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
