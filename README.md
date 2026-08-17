# Music'art — Espaço Terapêutico

Site do espaço de musicoterapia da Janaína Lima Zumach.

**Stack:** React 18 + Vite + Tailwind CSS 4 + React Three Fiber (Three.js).

```bash
npm install
npm run dev     # desenvolvimento
npm run build   # gera dist/
```

## Deploy na Vercel

O projeto é um Vite padrão, detectado automaticamente. Se precisar configurar
à mão:

| Campo | Valor |
| --- | --- |
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

## Estrutura

```
src/
  App.jsx                    palco de scroll + ordem das seções
  index.css                  tokens de cor, tipografia e fades do scroll
  lib/brainGeometry.js       geração procedural da nuvem de pontos
  components/
    BrainScene.jsx           canvas 3D, shaders e coreografia
    Hero.jsx                 chamada principal + CTA
    Manifesto.jsx            bloco de leitura que surge na descida
    Sobre.jsx                Janaína: retrato, texto e trajetória
    Espaco.jsx               pilares do espaço
    Contato.jsx              CTA final e rodapé
  assets/jana.webp           retrato 4:5 (880×1100)
```

## O cérebro em partículas

Gerado proceduralmente, sem modelo 3D externo. A silhueta nasce da **união**
de seis elipsoides (frontal, pré-central, parietal, occipital, temporal e
cerebelo): amostramos a superfície de um lobo e descartamos o que cai dentro
de outro, o que produz as reentrâncias entre lobos em vez de uma bola lisa.

Sobre essa base vem o que faz o objeto ser lido como cérebro:

- **Giros e sulcos coerentes** — faixas paralelas que serpenteiam pela
  superfície, não ruído aleatório.
- **Fissura de Sylvius** — esculpida por remoção de pontos. É a marca que faz
  o perfil ser reconhecido de imediato.
- **Fólias do cerebelo** — estrias bem mais finas que os giros do córtex.
- **Fissura longitudinal** — parede medial achatada separando os hemisférios.

O brilho é feito no fragment shader (núcleo nítido + halo suave). Bloom
aditivo de pós-processamento lavaria o fundo claro da página, então a
profundidade vem de fade combinado de cor, alpha e tamanho.

## Coreografia de scroll

Um palco de `240svh` com o canvas em `sticky`. Um único listener de scroll
alimenta as duas pontas:

- a variável CSS `--p` (0 → 1), que move os fades do HTML sem re-render;
- o `progressRef`, lido dentro do `useFrame` da cena 3D.

Conforme `--p` cresce, o cérebro gira mais rápido, cresce, desce e perde
contraste — virando a linha do horizonte do bloco de leitura seguinte.

## Performance

- Telas < 768px: densidade reduzida de 14.000 para 4.500 pontos (−68%), DPR
  limitado a 1.25, interação de ponteiro desligada e cérebro reposicionado
  abaixo do texto.
- `PerformanceMonitor` (drei) reduz o DPR se o framerate cair.
- `IntersectionObserver` + `visibilitychange` congelam o render loop quando o
  palco sai da tela ou a aba perde o foco.
- `prefers-reduced-motion` desliga a animação e o scroll suave.
- Um único draw call: `THREE.Points` com `ShaderMaterial`, sem antialias e sem
  depth buffer.

## Pendências antes de ir ao ar

- [ ] **Paleta oficial da marca.** A atual foi derivada da foto da Janaína —
      verde do logo `#206050`, sálvia da parede `#7b876e`, areia da almofada
      `#bc9d91`. Todos os tokens ficam no `@theme` de `src/index.css`.
- [ ] **Texto da Music'art.** O material recebido corta em "é uma prática de
      ensino que utiliza". Falta o método próprio, como são as sessões e para
      quem. Ver comentário no topo de `Espaco.jsx`.
- [ ] **Dados de contato reais.** WhatsApp, e-mail, endereço e redes estão como
      placeholder — o CTA aponta para `#TROCAR-WHATSAPP` em `Contato.jsx`.
      Nada foi inventado.
- [ ] Favicon e imagem de compartilhamento (Open Graph).
