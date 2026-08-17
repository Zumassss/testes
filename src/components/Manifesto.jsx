/**
 * Bloco de leitura que aparece enquanto o cerebro desce e cresce.
 * E a "continuacao" do hero: o mesmo objeto conduz o olho para o texto.
 */
const EFEITOS = [
  'Estimulação da fala',
  'Desenvolvimento cognitivo',
  'Melhora da comunicação',
  'Socialização',
  'Redução da ansiedade',
  'Alívio do estresse',
]

export default function Manifesto() {
  return (
    <div className="manifesto-fade mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
      <h2 className="font-display text-[1.9rem] font-light leading-[1.15] tracking-[-0.02em] text-ink text-balance sm:text-[2.6rem]">
        Toda sessão começa por escutar.
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-[16px] font-light leading-relaxed text-ink-soft sm:text-[17px]">
        O som chega antes da palavra. É por isso que a música abre caminhos de
        desenvolvimento que outras abordagens levam mais tempo para alcançar —
        e é nesse espaço que o trabalho acontece.
      </p>

      <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
        {EFEITOS.map((efeito) => (
          <li
            key={efeito}
            className="rounded-full border border-sage-200 bg-white/70 px-4 py-2 text-[13px] font-light text-ink-soft backdrop-blur-sm"
          >
            {efeito}
          </li>
        ))}
      </ul>
    </div>
  )
}
