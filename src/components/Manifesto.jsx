/**
 * Bloco de leitura que emerge enquanto o cerebro desce e se dissolve.
 * E a "continuacao" do hero: o mesmo objeto conduz o olho ate o texto, por
 * isso ele vive dentro do palco e nao numa secao propria.
 */
export default function Manifesto() {
  return (
    <div className="manifesto-fade mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
      <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-brand-600">
        O ponto de partida
      </span>

      <p className="mt-7 font-display text-[clamp(1.6rem,4.2vw,2.75rem)] font-semibold leading-[1.22] tracking-[-0.02em] text-ink text-balance">
        O som chega antes da palavra. Toda sessão começa por{' '}
        <em className="not-italic text-brand-600">escutar</em>.
      </p>

      <p className="mx-auto mt-7 max-w-xl text-[16px] font-light leading-[1.75] text-ink-soft sm:text-[17px]">
        A música ativa atenção, memória, linguagem e emoção ao mesmo tempo — e
        é por isso que ela abre caminhos de desenvolvimento onde outras
        abordagens ainda estão procurando a porta.
      </p>
    </div>
  )
}
