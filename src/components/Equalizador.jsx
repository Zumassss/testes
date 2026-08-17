/**
 * Ornamento de equalizador — as mesmas barras da marca, animadas.
 * Serve de separador entre seções: um respiro sonoro no lugar de uma linha.
 */
const ALTURAS = [0.35, 0.7, 1, 0.55, 0.85, 0.45, 0.95, 0.6, 0.3]

export default function Equalizador({ className = '' }) {
  return (
    <div
      className={`eq text-brand-400/70 ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {ALTURAS.map((h, i) => (
        <span
          key={i}
          style={{
            animationDelay: `${i * 0.13}s`,
            animationDuration: `${1.6 + (i % 3) * 0.35}s`,
            opacity: h,
          }}
        />
      ))}
    </div>
  )
}
