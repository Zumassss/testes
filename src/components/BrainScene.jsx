import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { buildBrainCloud } from '../lib/brainGeometry'

/* Verde da marca aplicado as particulas. */
const COLOR_NEAR = '#33452c' // pontos da frente: eucalipto escurecido
const COLOR_FAR = '#9cba99' // Passeio Ecologico: dissolve no Branco Gelo
const COLOR_GLOW = '#86a485' // Eucalipto — realce sob o cursor e nos disparos

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform float uZoom;
  uniform float uAspect;
  uniform vec2  uPointer;
  uniform float uPointerActive;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uMotion;
  uniform float uFadeNear;
  uniform float uFadeFar;
  uniform float uDissolve;

  attribute vec3  aNormal;
  attribute float aScale;
  attribute float aSeed;
  attribute float aTint;

  varying float vGlow;
  varying float vDepth;
  varying float vFront;
  varying float vTint;
  varying float vSpark;

  void main() {
    vec3 pos = position;

    // respiracao lenta ao longo da normal + micro-tremor: "rede viva"
    float ph = aSeed * 6.2831853;
    pos += aNormal * sin(uTime * 0.42 + ph) * 0.012 * uMotion;
    pos.x += sin(uTime * 0.7 + ph * 2.1) * 0.003 * uMotion;
    pos.y += cos(uTime * 0.62 + ph * 1.7) * 0.003 * uMotion;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Quanto o ponto encara a camera. E isto que faz a nuvem ler como um
    // objeto solido em vez de uma poeira: o que da as costas recua.
    // A rampa comeca em -0.45 de proposito — cortar em zero apagaria a
    // silhueta junto com o verso, e e a silhueta que desenha a forma.
    vec3 nv = normalize(normalMatrix * aNormal);
    vFront = smoothstep(-0.45, 0.18, dot(nv, normalize(-mv.xyz)));

    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;

    // repulsao calculada em espaco de tela: reage ao que o usuario ve
    vec2 delta = (ndc - uPointer) * vec2(uAspect, 1.0);
    float dist = length(delta);
    float infl = smoothstep(uRadius, 0.0, dist) * uPointerActive;
    mv.xy += normalize(delta + vec2(1e-4)) * infl * uStrength * (-mv.z);

    // disparos esparsos: 1 ponto em ~30 pulsa como uma sinapse
    float spark = step(0.966, aSeed) * pow(max(0.0, sin(uTime * 1.4 + aSeed * 210.0)), 9.0);
    vSpark = spark * uMotion;

    vGlow = infl;
    vDepth = -mv.z;
    vTint = aTint;

    gl_Position = projectionMatrix * mv;

    // pontos ao fundo encolhem junto com o fade: reforca a profundidade
    float depth = clamp((vDepth - uFadeNear) / (uFadeFar - uFadeNear), 0.0, 1.0);
    float shrink = mix(1.0, 0.68, depth) * mix(0.5, 1.0, vFront);

    gl_PointSize = clamp(
      uSize * uZoom * aScale * shrink * uDissolve
        * (1.0 + infl * 0.45 + vSpark * 1.6)
        * uScale / max(-mv.z, 0.001),
      1.4,
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
  varying float vFront;
  varying float vTint;
  varying float vSpark;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // queda suave num unico termo: glow sem post-processing
    // (bloom aditivo lavaria o fundo claro da pagina)
    float sprite = smoothstep(0.5, 0.13, d);

    float depth = clamp((vDepth - uFadeNear) / (uFadeFar - uFadeNear), 0.0, 1.0);
    depth = pow(depth, 1.15);

    // contraste forte entre frente e verso: e o que separa "objeto solido"
    // de "poeira" no fundo claro
    float facing = mix(0.09, 1.0, vFront);

    vec3 color = mix(uColorNear, uColorFar, depth);
    color = mix(color, uColorFar, (1.0 - facing) * 0.7);
    // topo do giro clareia um tico: da relevo a superficie
    color = mix(color, uColorGlow, vTint * 0.1);
    color = mix(color, uColorGlow, clamp(vGlow * 0.55 + vSpark, 0.0, 1.0));

    float alpha = sprite * uOpacity * facing;
    alpha *= mix(1.0, 0.3, depth);
    alpha *= 1.0 + vGlow * 0.4 + vSpark * 0.9;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`

/* smootherstep: derivada zero nas duas pontas — a entrada e a saida da
   coreografia nao "batem", elas assentam. */
const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10)

/* Vista de 3/4 tirando para o perfil: e o angulo em que a fissura de
   Sylvius e o cerebelo aparecem, ou seja, onde o objeto se le como cerebro. */
const REST_YAW = -1.6

/* folga entre o cerebro e a borda direita, em fracao da largura da janela */
const GUTTER = 0.055

function BrainParticles({ count, interactive, reducedMotion, pointSize, progressRef }) {
  const groupRef = useRef()
  const pointer = useRef(new THREE.Vector2(0, 0))
  const targetPointer = useRef(new THREE.Vector2(0, 0))
  const active = useRef(0)
  const targetActive = useRef(0)

  const { gl, size, camera } = useThree()

  const { positions, normals, scales, seeds, tints, drawCount, radiusXZ } = useMemo(
    () => buildBrainCloud(count),
    [count],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: pointSize },
      uScale: { value: 1000 },
      uZoom: { value: 1 },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerActive: { value: 0 },
      uRadius: { value: 0.2 },
      uStrength: { value: 0.012 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uDissolve: { value: 1 },
      uColorNear: { value: new THREE.Color(COLOR_NEAR) },
      uColorFar: { value: new THREE.Color(COLOR_FAR) },
      uColorGlow: { value: new THREE.Color(COLOR_GLOW) },
      uOpacity: { value: 1 },
      uFadeNear: { value: 3.5 },
      uFadeFar: { value: 5.8 },
    }),
    [reducedMotion, pointSize],
  )

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    g.setAttribute('aTint', new THREE.BufferAttribute(tints, 1))
    g.setDrawRange(0, drawCount)
    g.computeBoundingSphere()
    return g
  }, [positions, normals, scales, seeds, tints, drawCount])

  useEffect(() => () => geometry.dispose(), [geometry])

  /*
   * O ponteiro e lido da JANELA, nao do canvas. O texto do hero fica por
   * cima da tela 3D, entao eventos sobre ele nunca chegariam ao canvas — e o
   * efeito morreria justamente na metade da tela onde o cursor mais passa.
   */
  useEffect(() => {
    if (!interactive) return
    const el = gl.domElement

    const onMove = (event) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      targetPointer.current.set(
        ((event.clientX - r.left) / r.width) * 2 - 1,
        -(((event.clientY - r.top) / r.height) * 2 - 1),
      )
      targetActive.current =
        event.clientY >= r.top && event.clientY <= r.bottom ? 1 : 0
    }
    const onLeave = () => (targetActive.current = 0)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [gl, interactive])

  // Repouso: coluna da direita, centrado na vertical do hero.
  const restY = -0.3
  const baseScale = 1.0

  // destino no fim do scroll: desce para fora do enquadramento, deixando so
  // uma "linha do horizonte" de particulas embaixo do bloco de leitura
  const exitY = -1.85
  const maxZoom = 0.16

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const group = groupRef.current
    if (!group) return

    uniforms.uTime.value = t

    const fov = (camera.fov * Math.PI) / 180
    uniforms.uScale.value = (size.height * state.viewport.dpr) / (2 * Math.tan(fov / 2))
    uniforms.uAspect.value = size.width / Math.max(size.height, 1)

    if (interactive) {
      const k = Math.min(1, dt * 7)
      pointer.current.x += (targetPointer.current.x - pointer.current.x) * k
      pointer.current.y += (targetPointer.current.y - pointer.current.y) * k
      active.current += (targetActive.current - active.current) * Math.min(1, dt * 4)
      uniforms.uPointer.value.copy(pointer.current)
      uniforms.uPointerActive.value = active.current
    }

    // Coreografia de scroll. Tudo aqui e deliberadamente contido: o cerebro
    // apenas assenta e se dissolve, ele nao "voa" pela tela.
    const p = ease(progressRef?.current ?? 0)
    const zoom = baseScale * (1 + p * maxZoom)

    /*
     * X de repouso calculado da largura REAL da janela, nao fixo em unidades
     * de mundo. Uma unidade de mundo vale mais pixels quanto mais alta e a
     * tela, entao um valor fixo encostava na borda direita em telas altas e
     * sobrava espaco nas baixas. Aqui o cerebro fica sempre encostado a
     * direita, com a mesma folga proporcional.
     */
    const halfWorldH = Math.tan(fov / 2) * Math.abs(camera.position.z)
    const pxPorUnidade = size.height / 2 / halfWorldH
    const meiaLargura = radiusXZ * zoom
    const restX = Math.max(
      0.4,
      (size.width * (0.5 - GUTTER)) / pxPorUnidade - meiaLargura,
    )

    group.position.x = restX * (1 - p * 0.85)
    group.position.y = restY + (exitY - restY) * p
    group.position.z = -p * 0.2
    group.scale.setScalar(zoom)

    uniforms.uZoom.value = zoom
    // ao descer, os pontos encolhem e clareiam: o texto passa por cima sem
    // disputar leitura com as particulas
    uniforms.uDissolve.value = 1 - p * 0.3
    uniforms.uOpacity.value = 1 - p * 0.42

    // Oscilacao, nao giro completo. Uma volta inteira passa pela vista
    // frontal, onde o cerebro vira dois lobos lado a lado e deixa de ser
    // reconhecivel; esta faixa fica sempre entre o 3/4 e o perfil.
    if (!reducedMotion) {
      group.rotation.y = REST_YAW + Math.sin(t * 0.115) * 0.6 + p * 0.35
      group.rotation.x = -0.04 + Math.sin(t * 0.19) * 0.06 + p * 0.3
      group.rotation.z = Math.sin(t * 0.14) * 0.025 - p * 0.1
      group.position.y += Math.sin(t * 0.33) * 0.02
    } else {
      group.rotation.y = REST_YAW + p * 0.35
      group.rotation.x = -0.04 + p * 0.3
    }
  })

  return (
    <group ref={groupRef} rotation={[-0.04, REST_YAW, 0]}>
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

/**
 * Camada 3D presa (sticky) no topo enquanto o palco rola.
 *
 * So e montada no desktop — o App carrega este modulo com lazy(), entao o
 * three.js nem chega ao celular. O progresso do scroll chega por ref, logo
 * nada aqui re-renderiza o React.
 */
export default function BrainScene({ progressRef }) {
  const containerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(true)
  const [dpr, setDpr] = useState(1.5)

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setReducedMotion(mqMotion.matches)
      // acima de 2x o ganho visual e nulo e o custo por pixel quadruplica
      setDpr(Math.min(window.devicePixelRatio, 2))
    }
    sync()

    // A nuvem leva ~200ms para ser gerada. Montar depois da primeira pintura
    // tira esse custo do caminho critico: o texto do hero aparece antes.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMounted(true), { timeout: 600 })
      : setTimeout(() => setMounted(true), 90)

    mqMotion.addEventListener('change', sync)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      mqMotion.removeEventListener('change', sync)
    }
  }, [])

  // congela o render loop quando o palco sai da tela ou a aba perde o foco
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { threshold: 0 },
    )
    io.observe(el)

    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {mounted && (
        <Canvas
          dpr={dpr}
          frameloop={visible ? 'always' : 'never'}
          camera={{ position: [0, 0, 4.4], fov: 38, near: 0.1, far: 20 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: false,
          }}
          style={{ background: 'transparent', pointerEvents: 'auto' }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
            flipflops={3}
          />
          <BrainParticles
            count={20000}
            pointSize={0.0135}
            interactive
            reducedMotion={reducedMotion}
            progressRef={progressRef}
          />
        </Canvas>
      )}
    </div>
  )
}
