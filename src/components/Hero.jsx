import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor, Preload } from '@react-three/drei'
import * as THREE from 'three'

/* -------------------------------------------------------------------------- */
/*  Paleta                                                                     */
/* -------------------------------------------------------------------------- */

const GREEN_NEAR = '#009f45' // pontos da frente: verde-esmeralda profundo
const GREEN_FAR = '#7ed9a9' // pontos ao fundo: dissolvem no branco
const GREEN_GLOW = '#00e676' // realce sob o cursor

/* -------------------------------------------------------------------------- */
/*  Nuvem de pontos procedural em formato de cerebro                           */
/* -------------------------------------------------------------------------- */

/**
 * Lobos de UM hemisferio (lado +x). O hemisferio esquerdo e o espelho.
 * A silhueta do cerebro nasce da UNIAO dessas elipsoides: amostramos a
 * superficie de um lobo e descartamos o que cai dentro de outro, o que
 * produz as reentrancias entre lobos em vez de uma bola lisa.
 */
const LOBES = [
  { c: [0.16, 0.09, 0.4], r: [0.2, 0.27, 0.31], kind: 'cortex' }, // frontal
  { c: [0.18, 0.17, -0.04], r: [0.21, 0.26, 0.36], kind: 'cortex' }, // parietal
  { c: [0.15, 0.0, -0.44], r: [0.18, 0.24, 0.26], kind: 'cortex' }, // occipital
  { c: [0.22, -0.21, 0.04], r: [0.15, 0.16, 0.32], kind: 'cortex' }, // temporal
  { c: [0.13, -0.35, -0.42], r: [0.16, 0.12, 0.17], kind: 'cerebellum' },
]

// peso de amostragem proporcional a area aproximada de cada elipsoide
const LOBE_WEIGHTS = (() => {
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
 * Gera a nuvem de pontos do cerebro proceduralmente — sem depender de
 * nenhum modelo 3D externo. Cortex (uniao de lobos) + cerebelo + tronco
 * encefalico, com os pontos presos a casca para dar a leitura de
 * "superficie neural" e nao de volume solido.
 */
function buildBrainCloud(count) {
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const seeds = new Float32Array(count)

  const SCALE = 1.5
  const STEM_SHARE = 0.05

  let i = 0
  let guard = 0

  while (i < count && guard < count * 60) {
    guard++
    let x, y, z

    if (Math.random() < STEM_SHARE) {
      /* --- tronco encefalico: cilindro curto e afunilado --- */
      const t = Math.random()
      const radius = (0.095 - 0.04 * t) * (0.72 + 0.28 * Math.random())
      const a = Math.random() * Math.PI * 2
      x = Math.cos(a) * radius
      y = -0.22 - 0.36 * t
      z = -0.1 - 0.14 * t + Math.sin(a) * radius
      if (insideOtherLobe(Math.abs(x), y, z, -1)) continue
    } else {
      /* --- cortex / cerebelo: superficie da uniao de elipsoides --- */
      const pick = Math.random()
      let li = 0
      while (li < LOBE_WEIGHTS.length - 1 && pick > LOBE_WEIGHTS[li]) li++
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
      const gl = Math.hypot(gx, gy, gz) || 1
      gx /= gl
      gy /= gl
      gz /= gl

      if (lobe.kind === 'cerebellum') {
        // folia: estrias horizontais finas e apertadas
        const folia = 0.018 * Math.sin(46 * y + 8 * z)
        x += gx * folia
        y += gy * folia
        z += gz * folia
      } else {
        // giros e sulcos do cortex
        const fold =
          0.02 * Math.sin(8.3 * z + 2.1) * Math.sin(7.1 * y + 0.7) * Math.sin(6.2 * x) +
          0.013 * Math.sin(14.7 * y + 4.0) * Math.cos(11.9 * z + 1.3) +
          0.007 * Math.sin(21.3 * x + 2.6)
        x += gx * fold
        y += gy * fold
        z += gz * fold
      }

      // parede medial: achata o que invade a linha media (fissura longitudinal)
      if (x < 0.03) {
        if (Math.random() > 0.4) continue
        x = 0.03 + Math.random() * 0.012
      }

      // espessura da casca — quase tudo na superficie
      const inset = 1 - 0.06 * Math.pow(Math.random(), 2)
      x *= inset
      y *= inset
      z *= inset

      // espelha metade dos pontos para o hemisferio oposto
      if (Math.random() < 0.5) x = -x
    }

    const idx = i * 3
    positions[idx] = x * SCALE
    positions[idx + 1] = (y + 0.06) * SCALE
    positions[idx + 2] = z * SCALE

    scales[i] = 0.7 + Math.pow(Math.random(), 1.5) * 0.65
    seeds[i] = Math.random()
    i++
  }

  return { positions, scales, seeds, drawCount: i }
}

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                    */
/* -------------------------------------------------------------------------- */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform float uAspect;
  uniform vec2  uPointer;
  uniform float uPointerActive;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uMotion;
  uniform float uFadeNear;
  uniform float uFadeFar;

  attribute float aScale;
  attribute float aSeed;

  varying float vGlow;
  varying float vDepth;

  void main() {
    vec3 pos = position;

    // respiracao lenta + micro-tremor: "rede neural viva"
    float ph = aSeed * 6.2831853;
    pos += normalize(pos + 0.0001) * sin(uTime * 0.55 + ph) * 0.013 * uMotion;
    pos.x += sin(uTime * 0.9 + ph * 2.1) * 0.004 * uMotion;
    pos.y += cos(uTime * 0.8 + ph * 1.7) * 0.004 * uMotion;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;

    // repulsao calculada em espaco de tela: reage ao que o usuario ve
    vec2 delta = (ndc - uPointer) * vec2(uAspect, 1.0);
    float dist = length(delta);
    float infl = smoothstep(uRadius, 0.0, dist) * uPointerActive;
    mv.xy += normalize(delta + vec2(1e-4)) * infl * uStrength * (-mv.z);

    vGlow = infl;
    vDepth = -mv.z;

    gl_Position = projectionMatrix * mv;

    // pontos ao fundo encolhem junto com o fade: reforca a profundidade
    float depth = clamp((vDepth - uFadeNear) / (uFadeFar - uFadeNear), 0.0, 1.0);
    float shrink = mix(1.0, 0.72, depth);

    gl_PointSize = clamp(
      uSize * aScale * shrink * (1.0 + infl * 0.9) * uScale / max(-mv.z, 0.001),
      1.0,
      26.0
    );
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3  uColorNear;
  uniform vec3  uColorFar;
  uniform vec3  uColorGlow;
  uniform float uOpacity;
  uniform float uFadeNear;
  uniform float uFadeFar;

  varying float vGlow;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // nucleo nitido + halo suave = glow sem post-processing
    // (bloom aditivo lavaria o fundo branco da pagina)
    float core = smoothstep(0.5, 0.14, d);
    float halo = smoothstep(0.5, 0.0, d);

    float depth = clamp((vDepth - uFadeNear) / (uFadeFar - uFadeNear), 0.0, 1.0);
    depth = pow(depth, 1.25);

    vec3 color = mix(uColorNear, uColorFar, depth);
    color = mix(color, uColorGlow, clamp(vGlow * 1.4, 0.0, 1.0));

    float alpha = (core * 0.9 + halo * 0.28) * uOpacity;
    alpha *= mix(1.0, 0.18, depth);
    alpha *= 1.0 + vGlow * 0.9;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`

/* -------------------------------------------------------------------------- */
/*  Sistema de particulas                                                      */
/* -------------------------------------------------------------------------- */

function BrainParticles({ count, interactive, reducedMotion, pointSize }) {
  const groupRef = useRef()
  const pointer = useRef(new THREE.Vector2(0, 0))
  const active = useRef(0)
  const targetActive = useRef(0)

  const { gl, size, camera } = useThree()

  const { positions, scales, seeds, drawCount } = useMemo(
    () => buildBrainCloud(count),
    [count],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: pointSize },
      uScale: { value: 1000 },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerActive: { value: 0 },
      uRadius: { value: 0.17 },
      uStrength: { value: 0.012 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uColorNear: { value: new THREE.Color(GREEN_NEAR) },
      uColorFar: { value: new THREE.Color(GREEN_FAR) },
      uColorGlow: { value: new THREE.Color(GREEN_GLOW) },
      uOpacity: { value: 1.0 },
      uFadeNear: { value: 2.85 },
      uFadeFar: { value: 4.6 },
    }),
    [reducedMotion, pointSize],
  )

  // geometria e reconstruida somente quando a densidade muda
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    g.setDrawRange(0, drawCount)
    g.computeBoundingSphere()
    return g
  }, [positions, scales, seeds, drawCount])

  useEffect(() => () => geometry.dispose(), [geometry])

  // presenca do cursor sobre o canvas
  useEffect(() => {
    if (!interactive) return
    const el = gl.domElement
    const enter = () => (targetActive.current = 1)
    const leave = () => (targetActive.current = 0)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [gl, interactive])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    uniforms.uTime.value = t

    // tamanho do ponto em pixels de dispositivo, independente de viewport/DPR
    const fov = (camera.fov * Math.PI) / 180
    uniforms.uScale.value =
      (size.height * state.viewport.dpr) / (2 * Math.tan(fov / 2))
    uniforms.uAspect.value = size.width / Math.max(size.height, 1)

    if (interactive) {
      // amortece o cursor para uma reacao suave, nunca nervosa
      pointer.current.x += (state.pointer.x - pointer.current.x) * Math.min(1, dt * 8)
      pointer.current.y += (state.pointer.y - pointer.current.y) * Math.min(1, dt * 8)
      active.current += (targetActive.current - active.current) * Math.min(1, dt * 5)
      uniforms.uPointer.value.copy(pointer.current)
      uniforms.uPointerActive.value = active.current
    }

    if (!reducedMotion && groupRef.current) {
      // rotacao autonoma continua
      groupRef.current.rotation.y += dt * 0.16
      groupRef.current.rotation.x = -0.05 + Math.sin(t * 0.23) * 0.07
      groupRef.current.rotation.z = Math.sin(t * 0.17) * 0.03
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.025
    }
  })

  return (
    <group ref={groupRef} rotation={[-0.05, -0.5, 0]}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/*  Wrapper da cena                                                            */
/* -------------------------------------------------------------------------- */

function BrainScene() {
  const containerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(true)
  const [dpr, setDpr] = useState(1.5)

  // matchMedia so existe no cliente: evita quebrar em SSR
  useEffect(() => {
    setMounted(true)

    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqCoarse = window.matchMedia('(pointer: coarse)')

    const sync = () => {
      setIsMobile(mqMobile.matches)
      setReducedMotion(mqMotion.matches)
      setDpr(mqMobile.matches || mqCoarse.matches ? 1.25 : Math.min(window.devicePixelRatio, 2))
    }
    sync()

    mqMobile.addEventListener('change', sync)
    mqMotion.addEventListener('change', sync)
    return () => {
      mqMobile.removeEventListener('change', sync)
      mqMotion.removeEventListener('change', sync)
    }
  }, [])

  // congela o render loop quando a secao sai da tela ou a aba perde o foco
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { threshold: 0.05 },
    )
    io.observe(el)

    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // densidade: -62% em telas < 768px para nao derrubar o framerate no celular
  const count = isMobile ? 3400 : 9000

  // 'demand' com prefers-reduced-motion: desenha um quadro e para de renderizar
  const frameloop = reducedMotion ? 'demand' : visible ? 'always' : 'never'

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {mounted && (
        <Canvas
          dpr={dpr}
          frameloop={frameloop}
          camera={{ position: [0, 0, 3.6], fov: 38, near: 0.1, far: 20 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: false,
          }}
          style={{ background: 'transparent' }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
            flipflops={3}
          />
          <BrainParticles
            count={count}
            pointSize={isMobile ? 0.0115 : 0.009}
            interactive={!isMobile}
            reducedMotion={reducedMotion}
          />
          <Preload all />
        </Canvas>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white font-sans">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex min-h-[100svh] flex-col items-center gap-8 py-16 sm:gap-10 sm:py-20 lg:flex-row lg:gap-8 lg:py-0">
          {/* ---------- coluna esquerda: 55% ---------- */}
          <div className="flex w-full flex-col justify-center lg:w-[55%] lg:pr-12">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sonora-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sonora-600" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Clínica de Musicoterapia
              </span>
            </div>

            <h1 className="mt-6 text-[2.6rem] font-light leading-[1.06] tracking-[-0.03em] text-neutral-900 sm:text-6xl lg:text-[4.1rem]">
              O som que{' '}
              <span className="relative inline-block text-sonora-600">
                reorganiza
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-sonora-500/40" />
              </span>{' '}
              a mente.
            </h1>

            <p className="mt-6 max-w-xl text-[17px] font-light leading-relaxed text-neutral-600 sm:text-lg">
              Sessões de musicoterapia clínica que unem neurociência e escuta
              sensível para tratar ansiedade, estresse crônico e distúrbios do
              sono — no seu ritmo, com acompanhamento individual.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#agendar"
                className="group inline-flex items-center gap-2.5 rounded-full bg-sonora-600 px-8 py-4 text-[15px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-sonora-700 hover:shadow-lg hover:shadow-sonora-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sonora-600 focus-visible:ring-offset-2"
              >
                Agende uma sessão
                <svg
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 8h11M9.5 4l4 4-4 4" />
                </svg>
              </a>

              <a
                href="#como-funciona"
                className="inline-flex items-center px-2 py-2 text-[15px] font-normal text-neutral-500 underline-offset-8 transition-colors duration-300 hover:text-neutral-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sonora-600 focus-visible:ring-offset-2"
              >
                Como funciona a terapia
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-light text-neutral-400 lg:mt-12 lg:flex-nowrap lg:gap-x-4 lg:whitespace-nowrap lg:text-[12px]">
              <span>Atendimento presencial e online</span>
              <span className="hidden h-3 w-px bg-neutral-200 sm:block" />
              <span>Primeira avaliação sem custo</span>
              <span className="hidden h-3 w-px bg-neutral-200 sm:block" />
              <span>Equipe certificada</span>
            </div>
          </div>

          {/* ---------- coluna direita: 45% ---------- */}
          <div className="relative w-full lg:w-[45%]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] sm:aspect-square lg:mx-0 lg:ml-auto lg:aspect-[4/5] lg:max-h-[80svh]">
              {/* brilho quase imperceptivel para dar corpo ao "bloom" */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,200,83,0.09),transparent_62%)]" />
              <BrainScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
