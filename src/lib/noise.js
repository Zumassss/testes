/**
 * Ruido de valor 3D com interpolacao suave + fbm de 3 oitavas.
 *
 * Existe para uma coisa so: dar um campo continuo e organico ao dobramento
 * cortical. Seno puro daria listras de camisa de futebol; o ruido faz as
 * faixas serpentearem como giros de verdade.
 */

const hash = (i, j, k) => {
  let n =
    Math.imul(i | 0, 374761393) +
    Math.imul(j | 0, 668265263) +
    Math.imul(k | 0, 1274126177)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}

export function noise3(x, y, z) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const fx = x - xi
  const fy = y - yi
  const fz = z - zi

  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)

  const c000 = hash(xi, yi, zi)
  const c100 = hash(xi + 1, yi, zi)
  const c010 = hash(xi, yi + 1, zi)
  const c110 = hash(xi + 1, yi + 1, zi)
  const c001 = hash(xi, yi, zi + 1)
  const c101 = hash(xi + 1, yi, zi + 1)
  const c011 = hash(xi, yi + 1, zi + 1)
  const c111 = hash(xi + 1, yi + 1, zi + 1)

  const x00 = c000 + (c100 - c000) * ux
  const x10 = c010 + (c110 - c010) * ux
  const x01 = c001 + (c101 - c001) * ux
  const x11 = c011 + (c111 - c011) * ux

  const y0 = x00 + (x10 - x00) * uy
  const y1 = x01 + (x11 - x01) * uy

  return (y0 + (y1 - y0) * uz) * 2 - 1
}

export function fbm3(x, y, z) {
  let v = 0
  let amp = 0.5
  let freq = 1
  for (let o = 0; o < 3; o++) {
    v += amp * noise3(x * freq, y * freq, z * freq)
    freq *= 2.03
    amp *= 0.5
  }
  return v
}
