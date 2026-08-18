import Reveal from './Reveal.jsx'

/**
 * No desktop este bloco emerge enquanto o cérebro em partículas desce — o
 * mesmo objeto conduz o olho do hero até o texto, e por isso ele vive dentro
 * do palco de scroll.
 *
 * @param {boolean} estatico  No celular não há palco: vira uma seção comum,
 *   revelada na entrada. A coreografia dependia de uma tela alta e de um
 *   canvas que ali nem existe.
 */
export default function Manifesto({ estatico = false }) {
  const conteudo = (
    <>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700 sm:text-[11px] sm:tracking-[0.24em]">
        O ponto de partida
      </span>

      <p className="mt-5 font-display text-[clamp(1.4rem,5vw,2.75rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink text-balance sm:mt-7">
        O som chega antes da palavra. Toda sessão começa por{' '}
        <em className="not-italic text-brand-700">escutar</em>.
      </p>

      <p className="mx-auto mt-5 max-w-xl text-[15px] font-normal leading-[1.68] text-ink-soft sm:mt-7 sm:text-[16.5px] sm:leading-[1.75]">
        A música ativa atenção, memória, linguagem e emoção ao mesmo tempo — e
        é por isso que ela abre caminhos de desenvolvimento onde outras
        abordagens ainda estão procurando a porta.
      </p>
    </>
  )

  if (estatico) {
    return (
      <section className="relative px-6 py-16 sm:px-8 sm:py-24">
        <Reveal className="mx-auto w-full max-w-3xl text-center">
          {conteudo}
        </Reveal>
      </section>
    )
  }

  return (
    <div className="manifesto-fade mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
      {conteudo}
    </div>
  )
}
