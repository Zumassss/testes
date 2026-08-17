import { fbm3, noise3 } from './noise.js'

/**
 * Nuvem de pontos do cerebro.
 *
 * A forma vem de um SDF (campo de distancia) montado por uniao SUAVE de
 * elipsoides — nao por interseccao/descarte. Uniao suave e o que produz as
 * transicoes organicas entre lobos; descarte produzia degraus.
 *
 * As duas fissuras que fazem o objeto ser lido como cerebro na hora — a de
 * Sylvius e a central — sao ESCULPIDAS: uma capsula e subtraida do campo,
 * abrindo um vale de verdade na superficie.
 *
 * Os giros vem de um campo de dobramento (ruido deformado) fatiado em
 * faixas. O ponto e o vazio: os pontos do fundo do sulco sao removidos, e
 * e esse vazio que desenha a circunvolucao.
 *
 * Eixos: +x lateral direito, +y cima, +z frente (anterior).
 */

/* ------------------------------------------------------------------ *
 * primitivas                                                          *
 * ------------------------------------------------------------------ */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** uniao suave (polinomial) — a "cola" organica entre os lobos */
function smin(a, b, k) {
  const h = clamp01(0.5 + (0.5 * (b - a)) / k)
  return b + (a - b) * h - k * h * (1 - h)
}

/** subtracao suave: abre um vale em vez de um corte reto */
function smaxSub(d, cut, k) {
  const h = clamp01(0.5 + (0.5 * (d + cut)) / k)
  return -cut + (d + cut) * h + k * h * (1 - h)
}

/** elipsoide (aproximacao de iq — gradiente estavel o bastante) */
function sdEllipsoid(px, py, pz, cx, cy, cz, rx, ry, rz) {
  const ax = px - cx
  const ay = py - cy
  const az = pz - cz
  const dx = ax / rx
  const dy = ay / ry
  const dz = az / rz
  const k0 = Math.sqrt(dx * dx + dy * dy + dz * dz)
  if (k0 < 1e-6) return -Math.min(rx, ry, rz)
  const ex = ax / (rx * rx)
  const ey = ay / (ry * ry)
  const ez = az / (rz * rz)
  const k1 = Math.sqrt(ex * ex + ey * ey + ez * ez)
  return (k0 * (k0 - 1)) / k1
}

/** cone arredondado: tronco encefalico e as capsulas que esculpem sulcos */
function sdCone(px, py, pz, ax, ay, az, bx, by, bz, ra, rb) {
  const vx = bx - ax
  const vy = by - ay
  const vz = bz - az
  const wx = px - ax
  const wy = py - ay
  const wz = pz - az
  const vv = vx * vx + vy * vy + vz * vz
  const t = clamp01((wx * vx + wy * vy + wz * vz) / vv)
  const cx = wx - vx * t
  const cy = wy - vy * t
  const cz = wz - vz * t
  return Math.sqrt(cx * cx + cy * cy + cz * cz) - (ra + (rb - ra) * t)
}

/* ------------------------------------------------------------------ *
 * anatomia                                                            *
 * ------------------------------------------------------------------ */

/* Lobos de UM hemisferio. O outro lado e o espelho em x. */
const CORTEX = [
  [0.245, 0.045, 0.0, 0.3, 0.375, 0.55], // massa central
  [0.215, 0.02, 0.335, 0.275, 0.325, 0.36], // polo frontal
  [0.245, 0.145, -0.155, 0.285, 0.335, 0.415], // parietal
  [0.195, -0.085, -0.44, 0.235, 0.265, 0.295], // occipital
]

const TEMPORAL = [0.315, -0.275, 0.1, 0.175, 0.155, 0.34]
const CEREBELLUM = [0.2, -0.375, -0.44, 0.245, 0.185, 0.245]

/** Distancia ao cerebro. Vale para x >= 0; o lado esquerdo e espelhado. */
export function brainSDF(x, y, z) {
  /* cortex: uniao bem suave — os lobos sao um continuo, nao pecas coladas */
  let d = sdEllipsoid(x, y, z, ...CORTEX[0])
  for (let i = 1; i < CORTEX.length; i++) {
    d = smin(d, sdEllipsoid(x, y, z, ...CORTEX[i]), 0.17)
  }

  /* temporal entra com k pequeno: precisa sobrar a dobra que vira Sylvius */
  d = smin(d, sdEllipsoid(x, y, z, ...TEMPORAL), 0.05)

  /* cerebelo: massa propria, quase destacada */
  d = smin(d, sdEllipsoid(x, y, z, ...CEREBELLUM), 0.032)

  /* fissura longitudinal: aberta em cima, fechando em direcao ao corpo
     caloso — por isso a folga cresce com a altura */
  const gap = 0.032 * clamp01((y + 0.2) / 0.34)
  d = Math.max(d, gap - x)

  /* tronco encefalico depois do corte medial: ele fica NA linha media */
  d = smin(d, sdCone(x, y, z, 0, -0.12, -0.04, 0, -0.62, -0.28, 0.115, 0.062), 0.07)

  /* Fissura de Sylvius — o vale que separa o temporal do resto. A capsula
     precisa correr RENTE a superficie lateral (x alto), senao ela passa por
     dentro da massa e nao abre nada. */
  /* as duas pontas passam PARA FORA da massa: se terminassem dentro, a
     ponta arredondada da capsula viraria uma cratera circular na lateral */
  d = smaxSub(
    d,
    sdCone(x, y, z, 0.5, -0.17, 0.5, 0.3, 0.07, -0.46, 0.062, 0.048),
    0.04,
  )

  /* sulco central — desce da linha media para a frente e para o lado */
  d = smaxSub(
    d,
    sdCone(x, y, z, 0.07, 0.45, -0.12, 0.45, -0.03, 0.1, 0.042, 0.036),
    0.03,
  )

  return d
}

function normalAt(x, y, z, out) {
  const e = 0.0035
  const nx = brainSDF(x + e, y, z) - brainSDF(x - e, y, z)
  const ny = brainSDF(x, y + e, z) - brainSDF(x, y - e, z)
  const nz = brainSDF(x, y, z + e) - brainSDF(x, y, z - e)
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
  out[0] = nx / len
  out[1] = ny / len
  out[2] = nz / len
}

/* ------------------------------------------------------------------ *
 * dobramento cortical                                                 *
 * ------------------------------------------------------------------ */

/**
 * Campo de giros. Um ruido de baixa frequencia deformado por outro ruido
 * gera um potencial; fatiar esse potencial em faixas da circunvolucoes que
 * serpenteiam em vez de listras retas.
 *
 * @returns 0 no fundo do sulco, 1 no topo do giro
 */
function gyriField(x, y, z) {
  /* deformacao de baixa frequencia: e ela que faz a faixa serpentear */
  const w = fbm3(x * 1.5 + 11.3, y * 1.5 - 4.1, z * 1.5 + 7.7)

  /* UMA oitava so no potencial. Com fbm cheio as isolinhas picotam e o
     resultado le como ruido; com ruido liso elas viram vales continuos. */
  const n = noise3(x * 2.4 + w * 0.9, y * 2.2 + w * 0.9 + 20.5, z * 2.4 + w * 0.9)

  /* rampa em y: da aos giros a direcao antero-posterior dominante do
     cortex, com o ruido por cima quebrando a regularidade */
  const g = n * 0.72 + y * 0.62 - z * 0.12

  return Math.pow(Math.abs(Math.sin(g * 31)), 0.55)
}

/** Folias do cerebelo: estrias muito mais finas e paralelas que os giros. */
function foliaField(x, y, z) {
  const jitter = noise3(x * 6, y * 6, z * 6) * 0.5
  return Math.pow(Math.abs(Math.sin(y * 78 + z * 12 + jitter)), 0.6)
}

/* ------------------------------------------------------------------ *
 * geracao da nuvem                                                    *
 * ------------------------------------------------------------------ */

const BOX = { x0: 0, x1: 0.68, y0: -0.76, y1: 0.62, z0: -0.84, z1: 0.8 }
const SHELL = 0.03
const SCALE = 1.42

/**
 * @param {number} count numero alvo de pontos
 * @returns {{positions: Float32Array, normals: Float32Array, scales: Float32Array,
 *            seeds: Float32Array, tints: Float32Array, drawCount: number,
 *            radiusXZ: number}}
 *
 * `radiusXZ` e o raio no plano horizontal. Como o cerebro so gira em torno
 * de Y, e ele — nao a largura lateral — que define quanto espaco o objeto
 * ocupa na tela em qualquer instante da animacao.
 */
export function buildBrainCloud(count) {
  const positions = new Float32Array(count * 3)
  const normals = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const seeds = new Float32Array(count)
  const tints = new Float32Array(count)

  const n = [0, 0, 0]
  const bx = BOX.x1 - BOX.x0
  const by = BOX.y1 - BOX.y0
  const bz = BOX.z1 - BOX.z0

  let i = 0
  let guard = 0
  let radiusXZ = 0
  const maxTries = count * 260

  while (i < count && guard < maxTries) {
    guard++

    /* amostragem volumetrica: garante densidade uniforme por AREA, coisa
       que projetar raios do centro nao daria (o polo perto do centro
       ficaria com pontos demais) */
    let x = BOX.x0 + Math.random() * bx
    let y = BOX.y0 + Math.random() * by
    let z = BOX.z0 + Math.random() * bz

    const d = brainSDF(x, y, z)
    if (d < -SHELL || d > SHELL) continue

    /* gruda exatamente na superficie */
    normalAt(x, y, z, n)
    x -= n[0] * d
    y -= n[1] * d
    z -= n[2] * d

    /* regiao: o cerebelo dobra diferente do cortex */
    const cd = Math.hypot(
      (x - CEREBELLUM[0]) / 0.34,
      (y - CEREBELLUM[1]) / 0.26,
      (z - CEREBELLUM[2]) / 0.34,
    )
    const isCerebellum = cd < 1
    const isStem = y < -0.5 && Math.abs(x) < 0.13 && z < 0.05

    let crest = 1
    let depth = 0

    if (isStem) {
      crest = 0.7
    } else if (isCerebellum) {
      crest = foliaField(x, y, z)
      if (crest < 0.3 && Math.random() < 0.8) continue
      depth = -0.016 * (1 - crest)
    } else {
      crest = gyriField(x, y, z)
      /* o vazio e que desenha o sulco: o fundo precisa abrir de verdade,
         senao de longe a superficie vira ruido uniforme */
      if (crest < 0.68 && Math.random() < 0.93) continue
      depth = -0.06 * (1 - crest)
    }

    x += n[0] * depth
    y += n[1] * depth
    z += n[2] * depth

    /* espessura minima da casca — tira o aspecto de papel de parede */
    const inset = -0.012 * Math.pow(Math.random(), 2)
    x += n[0] * inset
    y += n[1] * inset
    z += n[2] * inset

    let sx = x
    let snx = n[0]
    if (Math.random() < 0.5) {
      sx = -sx
      snx = -snx
    }

    const idx = i * 3
    const px = sx * SCALE
    const pz = z * SCALE
    positions[idx] = px
    positions[idx + 1] = (y + 0.11) * SCALE
    positions[idx + 2] = pz

    const r = Math.sqrt(px * px + pz * pz)
    if (r > radiusXZ) radiusXZ = r

    normals[idx] = snx
    normals[idx + 1] = n[1]
    normals[idx + 2] = n[2]

    /* topo do giro pega mais luz: ponto maior e mais claro */
    scales[i] = (0.62 + Math.pow(Math.random(), 1.6) * 0.5) * (0.78 + crest * 0.44)
    seeds[i] = Math.random()
    tints[i] = crest * 0.7 + Math.random() * 0.3

    i++
  }

  return { positions, normals, scales, seeds, tints, drawCount: i, radiusXZ }
}
