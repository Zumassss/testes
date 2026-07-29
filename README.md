# Hero — Clínica de Musicoterapia

Seção hero de landing page com cérebro 3D em partículas, feita em **React + Tailwind CSS + React Three Fiber**.

O entregável é o componente único `src/components/Hero.jsx`. O resto do repositório
é apenas o mínimo (Vite) para rodar e visualizar a seção.

```bash
npm install
npm run dev
```

## O componente

`src/components/Hero.jsx` é autocontido — basta importá-lo no topo da página:

```jsx
import Hero from './components/Hero'

export default function Page() {
  return <Hero />
}
```

Dependências: `react`, `three`, `@react-three/fiber`, `@react-three/drei` e Tailwind.

### Layout

- Fundo branco puro, tipografia Inter, bastante respiro.
- Desktop: duas colunas — texto à esquerda (55%, centralizado verticalmente) e
  cena 3D à direita (45%). Abaixo de `lg` as colunas empilham.
- Verde-esmeralda (`--color-sonora-*`, definido em `src/index.css`) usado só nos
  detalhes: destaque da headline, CTA, marcador do eyebrow.

### O cérebro de partículas

Gerado **proceduralmente** — nenhum modelo 3D externo é necessário:

- A silhueta nasce da **união** de elipsoides (frontal, parietal, occipital,
  temporal, cerebelo) mais o tronco encefálico. Amostramos a superfície de um
  lobo e descartamos o que cai dentro de outro, o que produz as reentrâncias
  entre lobos em vez de uma bola lisa.
- Giros/sulcos e as fólias do cerebelo vêm de senoides aplicadas na normal.
- Os pontos ficam presos à casca, para a leitura ser de "superfície neural" e
  não de volume sólido. A fissura longitudinal separa os dois hemisférios.

### Movimento e interação

- Rotação autônoma contínua em Y, com oscilação leve em X/Z e uma respiração
  sutil por vértice — o cérebro nunca fica parado, mesmo sem interação.
- No hover, as partículas próximas ao cursor sofrem uma repulsão suave e ganham
  brilho. O cálculo é feito **no vertex shader, em espaço de tela**, então
  milhares de pontos reagem sem custo de CPU.
- O glow é fake por design: núcleo nítido + halo suave no fragment shader.
  Bloom aditivo de pós-processamento lavaria o fundo branco da página.
- Profundidade em fundo branco é resolvida com fade de cor, alpha e tamanho —
  pontos ao fundo encolhem e se dissolvem no branco.

### Performance

- < 768px: densidade reduzida em ~62% (9.000 → 3.400 pontos), DPR limitado a
  1.25 e interação de ponteiro desligada.
- `PerformanceMonitor` (drei) reduz o DPR se o framerate cair.
- `IntersectionObserver` + `visibilitychange` congelam o render loop quando a
  seção sai da tela ou a aba perde o foco.
- `prefers-reduced-motion` desliga a animação e coloca o canvas em `demand`:
  desenha um quadro e para de renderizar.
- Um único draw call: `THREE.Points` com `ShaderMaterial`, sem antialias e sem
  depth buffer.
