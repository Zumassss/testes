/**
 * Geracao procedural da nuvem de pontos do cerebro.
 *
 * A silhueta nasce da UNIAO de elipsoides (um lobo cada): amostramos a
 * superficie de um lobo e descartamos o que cai dentro de outro, o que
 * produz as reentrancias entre lobos em vez de uma bola lisa.
 *
 * Sobre essa base vem o que realmente faz o objeto ser lido como cerebro:
 * giros e sulcos coerentes (faixas paralelas, nao ruido) e as duas
 * fissuras marcantes — a de Sylvius, que separa o lobo temporal do resto,
 * e a longitudinal, que separa os hemisferios.
 */

/** Lobos de UM hemisferio (lado +x). O hemisferio esquerdo e o espelho. */
const LOBES = [
  { c: [0.17, 0.1, 0.44], r: [0.21, 0.27, 0.3], kind: 'cortex' }, // frontal
  { c: [0.19, 0.21, 0.06], r: [0.22, 0.28, 0.3], kind: 'cortex' }, // pre-central
  { c: [0.19, 0.16, -0.26], r: [0.21, 0.27, 0.31], kind: 'cortex' }, // parietal
  { c: [0.16, -0.04, -0.5], r: [0.19, 0.23, 0.24], kind: 'cortex' }, // occipital
  { c: [0.24, -0.24, 0.06], r: [0.15, 0.16, 0.34], kind: 'cortex' }, // temporal
  { c: [0.14, -0.38, -0.44], r: [0.17, 0.13, 0.18], kind: 'cerebellum' },
]

// peso de amostragem proporcional a area aproximada de cada elipsoide
const LOBE_CDF = (() => {
  const w = LOBES.map(({ r }) => r[0] * r[1] + r[1] * r[2] + r[0] * r[2])
  const total = w.reduce((a, b) => a + b, 0)
  let acc = 0
  return w.map((v) => (acc += v / total))
})()

function insideOtherLobe(x, y, z, skip) {
  for (let k = 0; k < LOBES.length; k++) {
    if (k === skip) continue
    const { c, r } = LOBES[k]
    const dx = (x - c[0]) / r[0]
    const dy = (y - c[1]) / r[1]
    const dz = (z - c[2]) / r[2]
    if (dx * dx + dy * dy + dz * dz < 0.97) return true
  }
  return false
}

/**
 * Campo de giros: faixas paralelas que serpenteiam pela superficie.
 * Retorna 0 no fundo do sulco e 1 no topo do giro.
 */
function gyriField(x, y, z) {
  const wander =
    0.55 * Math.sin(5.3 * x + 1.7) +
    0.42 * Math.sin(4.1 * z - 0.6) +
    0.3 * Math.sin(6.7 * y + 2.4)
  const band = Math.sin(15.5 * (0.72 * z + 0.52 * y - 0.2 * x) + wander)
  return Math.pow(Math.abs(band), 0.65)
}

/**
 * Fissura de Sylvius: sulco profundo que corre pela lateral, separando o
 * lobo temporal do frontal/parietal. E a marca que faz o perfil ser lido
 * como cerebro na hora.
 */
function sylvianDepth(x, y, z) {
  const line = y + 0.1 + 0.16 * z - 0.1 * Math.sin(3.2 * z)
  const lateral = Math.min(1, Math.max(0, (Math.abs(x) - 0.1) / 0.16))
  return Math.exp(-(line * line) / 0.0022) * lateral
}

/**
 * @param {number} count numero alvo de pontos
 * @returns {{positions: Float32Array, scales: Float32Array, seeds: Float32Array, drawCount: number}}
 */
export function buildBrainCloud(count) {
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const seeds = new Float32Array(count)

  const SCALE = 1.5
  const STEM_SHARE = 0.045

  let i = 0
  let guard = 0

  while (i < count && guard < count * 80) {
    guard++
    let x, y, z
    let onCortex = false

    if (Math.random() < STEM_SHARE) {
      /* --- tronco encefalico: cilindro curto e afunilado --- */
      const t = Math.random()
      const radius = (0.095 - 0.04 * t) * (0.72 + 0.28 * Math.random())
      const a = Math.random() * Math.PI * 2
      x = Math.cos(a) * radius
      y = -0.26 - 0.34 * t
      z = -0.12 - 0.14 * t + Math.sin(a) * radius
      if (insideOtherLobe(Math.abs(x), y, z, -1)) continue
    } else {
      /* --- cortex / cerebelo: superficie da uniao de elipsoides --- */
      const pick = Math.random()
      let li = 0
      while (li < LOBE_CDF.length - 1 && pick > LOBE_CDF[li]) li++
      const lobe = LOBES[li]

      // direcao uniforme na esfera -> superficie da elipsoide
      const u = Math.random() * 2 - 1
      const theta = Math.random() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const nx = s * Math.cos(theta)
      const ny = u
      const nz = s * Math.sin(theta)

      x = lobe.c[0] + nx * lobe.r[0]
      y = lobe.c[1] + ny * lobe.r[1]
      z = lobe.c[2] + nz * lobe.r[2]

      if (insideOtherLobe(x, y, z, li)) continue

      // normal externa aproximada da elipsoide
      let gx = (x - lobe.c[0]) / (lobe.r[0] * lobe.r[0])
      let gy = (y - lobe.c[1]) / (lobe.r[1] * lobe.r[1])
      let gz = (z - lobe.c[2]) / (lobe.r[2] * lobe.r[2])
      const glen = Math.hypot(gx, gy, gz) || 1
      gx /= glen
      gy /= glen
      gz /= glen

      if (lobe.kind === 'cerebellum') {
        // folia: estrias horizontais bem mais finas que os giros do cortex
        const folia = 0.02 * Math.sin(52 * y + 9 * z) - 0.008
        x += gx * folia
        y += gy * folia
        z += gz * folia
      } else {
        onCortex = true

        // giros e sulcos
        const gyri = gyriField(x, y, z)
        let depth = -0.055 * (1 - gyri)

        // fissura de Sylvius, bem mais profunda que um sulco comum
        const sylvian = sylvianDepth(x, y, z)
        depth -= 0.085 * sylvian
        // o fundo da fissura fica vazio: e o vazio que desenha o sulco
        if (sylvian > 0.55 && Math.random() < 0.75) continue

        x += gx * depth
        y += gy * depth
        z += gz * depth
      }

      // parede medial: achata o que invade a linha media (fissura longitudinal)
      if (x < 0.032) {
        if (Math.random() > 0.38) continue
        x = 0.032 + Math.random() * 0.012
      }

      // espessura da casca — quase tudo na superficie
      const inset = 1 - 0.055 * Math.pow(Math.random(), 2)
      x *= inset
      y *= inset
      z *= inset

      // espelha metade dos pontos para o hemisferio oposto
      if (Math.random() < 0.5) x = -x
    }

    const idx = i * 3
    positions[idx] = x * SCALE
    positions[idx + 1] = (y + 0.08) * SCALE
    positions[idx + 2] = z * SCALE

    // pontos no topo dos giros ficam um tico maiores: da relevo a superficie
    const relief = onCortex ? 0.85 + 0.35 * gyriField(x, y, z) : 1
    scales[i] = (0.7 + Math.pow(Math.random(), 1.5) * 0.6) * relief
    seeds[i] = Math.random()
    i++
  }

  return { positions, scales, seeds, drawCount: i }
}
