import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { buildBrainCloud } from '../lib/brainGeometry'

/* Verde da marca aplicado as particulas. */
const GREEN_NEAR = '#1d6a56' // pontos da frente: esmeralda profundo do logo
const GREEN_FAR = '#a9d8c5' // pontos ao fundo: dissolvem no off-white
const GREEN_GLOW = '#3fbf90' // realce sob o cursor

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
      uSize * uZoom * aScale * shrink * (1.0 + infl * 0.9) * uScale / max(-mv.z, 0.001),
      1.0,
      30.0
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
    // (bloom aditivo lavaria o fundo claro da pagina)
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

const smoothstep01 = (t) => t * t * (3 - 2 * t)

function BrainParticles({ count, interactive, reducedMotion, pointSize, compact, progressRef }) {
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
      uZoom: { value: 1 },
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
      uFadeNear: { value: 3.55 },
      uFadeFar: { value: 5.7 },
    }),
    [reducedMotion, pointSize],
  )

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

  // Posicao de repouso no hero. No desktop o cerebro ocupa a coluna da
  // direita; no mobile ele desce para o terco inferior — a tela e estreita
  // demais para dividir espaco com o texto — e encolhe para nao ser cortado.
  const restX = compact ? 0 : 0.95
  const restY = compact ? -1.02 : 0.12
  const baseScale = compact ? 0.62 : 1

  // destino no fim do scroll: desce para fora do enquadramento, deixando so
  // uma "linha do horizonte" de particulas embaixo do bloco de leitura
  const exitY = compact ? -1.95 : -1.95
  const maxZoom = compact ? 0.3 : 0.35

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
      pointer.current.x += (state.pointer.x - pointer.current.x) * Math.min(1, dt * 8)
      pointer.current.y += (state.pointer.y - pointer.current.y) * Math.min(1, dt * 8)
      active.current += (targetActive.current - active.current) * Math.min(1, dt * 5)
      uniforms.uPointer.value.copy(pointer.current)
      uniforms.uPointerActive.value = active.current
    }

    // coreografia de scroll: o cerebro sai da coluna, cresce, gira mais
    // rapido e desce, emendando na secao de leitura seguinte
    const p = smoothstep01(progressRef?.current ?? 0)
    const zoom = baseScale * (1 + p * maxZoom)

    group.position.x = restX * (1 - p)
    group.position.y = restY + (exitY - restY) * p
    group.position.z = -p * 0.25
    group.scale.setScalar(zoom)
    uniforms.uZoom.value = zoom
    // alivia o contraste na descida para o texto de leitura respirar por cima
    uniforms.uOpacity.value = 1 - p * 0.28

    if (!reducedMotion) {
      group.rotation.y += dt * (0.16 + p * 0.7)
      group.rotation.x = -0.05 + Math.sin(t * 0.23) * 0.07 + p * 0.42
      group.rotation.z = Math.sin(t * 0.17) * 0.03 - p * 0.16
      group.position.y += Math.sin(t * 0.4) * 0.025
    } else {
      group.rotation.y = -0.5 + p * 1.4
      group.rotation.x = -0.05 + p * 0.42
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

/**
 * Camada 3D que fica presa (sticky) no topo enquanto o palco rola.
 * O progresso do scroll chega por ref, entao nada aqui re-renderiza o React.
 */
export default function BrainScene({ progressRef }) {
  const containerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(true)
  const [dpr, setDpr] = useState(1.5)

  useEffect(() => {
    setMounted(true)

    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqCoarse = window.matchMedia('(pointer: coarse)')

    const sync = () => {
      setIsMobile(mqMobile.matches)
      setReducedMotion(mqMotion.matches)
      setDpr(
        mqMobile.matches || mqCoarse.matches
          ? 1.25
          : Math.min(window.devicePixelRatio, 2),
      )
    }
    sync()

    mqMobile.addEventListener('change', sync)
    mqMotion.addEventListener('change', sync)
    return () => {
      mqMobile.removeEventListener('change', sync)
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

  // densidade: -68% em telas < 768px para nao derrubar o framerate no celular
  const count = isMobile ? 4500 : 14000
  const frameloop = visible ? 'always' : 'never'

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {mounted && (
        <Canvas
          dpr={dpr}
          frameloop={frameloop}
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
            count={count}
            pointSize={isMobile ? 0.019 : 0.0085}
            interactive={!isMobile}
            reducedMotion={reducedMotion}
            compact={isMobile}
            progressRef={progressRef}
          />
          <Preload all />
        </Canvas>
      )}
    </div>
  )
}
