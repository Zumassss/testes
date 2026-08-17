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
      'Um ambiente acolhedor para reduzir estresse e ansiedade, com escuta antes de qualquer técnica.',
  },
  {
    titulo: 'Desenvolvimento cognitivo',
    texto:
      'Atividades musicais que estimulam atenção, memória e organização do pensamento.',
  },
  {
    titulo: 'Comunicação e fala',
    texto:
      'O som como ponte: estimulação da fala e ampliação das formas de se expressar.',
  },
  {
    titulo: 'Socialização',
    texto:
      'Tocar junto é conviver. O encontro com o outro faz parte do tratamento.',
  },
]

export default function Espaco() {
  return (
    <section id="espaco" className="relative overflow-hidden bg-brand-900 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-300">
            O espaço
          </span>
          <h2 className="mt-5 font-display text-[2.1rem] font-light leading-[1.08] tracking-[-0.025em] text-balance sm:text-[2.9rem]">
            Music’art Espaço Terapêutico
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-brand-100 sm:text-[17px]">
            Um espaço acolhedor que une educação musical e abordagem
            terapêutica, com método próprio para desenvolver a potência de cada
            pessoa que chega.
          </p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map(({ titulo, texto }) => (
            <div key={titulo}>
              <div className="h-px w-10 bg-brand-400" aria-hidden="true" />
              <h3 className="mt-5 text-[17px] font-normal">{titulo}</h3>
              <p className="mt-3 text-[15px] font-light leading-relaxed text-brand-200">
                {texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
