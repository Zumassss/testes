# Music'art — Espaço Terapêutico

Site do espaço de musicoterapia da Janaína Lima Zumach.

**Stack:** React 18 + Vite + Tailwind CSS 4 + React Three Fiber (Three.js) + Lenis.
**Tipografia:** Playfair Display (títulos) + Manrope (texto).

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
  App.jsx                    scroll suave, palco do cérebro e ordem das seções
  index.css                  tokens, fundo ambiente e coreografia do scroll
  lib/
    noise.js                 ruído de valor 3D + fbm
    brainGeometry.js         SDF do cérebro e geração da nuvem de pontos
    contato.js               WhatsApp da Janaína (único lugar)
  lib/useParallax.js         paralaxe leve por variável CSS
  components/
    Nav.jsx                  barra fixa (inverte sobre a seção escura)
    WhatsAppFloat.jsx        atalho fixo no canto inferior direito
    SplitReveal.jsx          título que sobe palavra a palavra
    Equalizador.jsx          ornamento sonoro animado
    BrainScene.jsx           canvas 3D, shaders e coreografia
    Hero.jsx                 chamada principal + CTA
    Manifesto.jsx            bloco que emerge enquanto o cérebro desce
    Beneficios.jsx           os seis efeitos, em cartões
    Sobre.jsx                Janaína: retrato, texto e citação
    Trajetoria.jsx           linha do tempo
    Espaco.jsx               seção escura com os pilares
    ComoFunciona.jsx         três passos + modalidades
    Contato.jsx              CTA final
    Footer.jsx               rodapé
    Reveal.jsx               revelação no scroll (IntersectionObserver)
    SectionHead.jsx          cabeçalho padrão das seções
  assets/jana.webp           retrato 4:5 (880×1100)
```

## O cérebro em partículas

Gerado proceduralmente, sem modelo 3D externo. A forma é um **campo de
distância (SDF)**: seis elipsoides — frontal, parietal, occipital, temporal,
cerebelo e a massa central — unidos por *união suave*. É a união suave que
produz as transições orgânicas entre lobos; recortar por interseção produzia
degraus.

As duas marcas que fazem o objeto ser reconhecido na hora são **esculpidas**,
subtraindo uma cápsula do campo:

- **Fissura de Sylvius** — o vale que separa o lobo temporal do resto. As duas
  pontas da cápsula passam para fora da massa de propósito: se terminassem
  dentro, a ponta arredondada abriria uma cratera circular na lateral.
- **Sulco central** — desce da linha média para a frente e para o lado.

Os **giros** vêm de um campo de dobramento: um ruído liso, deformado por
outro ruído e somado a uma rampa vertical, fatiado em faixas. O que desenha a
circunvolução é o vazio — os pontos do fundo do sulco são removidos. O
cerebelo usa o mesmo mecanismo com estrias bem mais finas (fólias).

Os pontos são amostrados por rejeição volumétrica (densidade uniforme por
área) e depois grudados na superfície. Cada ponto carrega sua **normal**, e é
ela que faz a nuvem ler como um objeto sólido em vez de poeira: quem dá as
costas para a câmera recua em tamanho e opacidade. A rampa desse fade começa
em `-0.45` porque cortar em zero apagaria a silhueta junto com o verso — e é a
silhueta que desenha a forma.

O brilho é feito no fragment shader. Bloom aditivo de pós-processamento
lavaria o fundo claro da página.

## Coreografia de scroll

Um palco de `230svh` com o canvas em `sticky`. Um único listener alimenta as
duas pontas:

- a variável CSS `--p` (0 → 1), que move os fades do HTML sem re-render;
- o `progressRef`, lido dentro do `useFrame` da cena 3D.

Conforme `--p` cresce, o cérebro desce, cresce de leve e se dissolve — virando
a linha do horizonte do bloco de leitura seguinte.

O cérebro **oscila**, não gira. Uma volta completa passa pela vista frontal,
onde ele vira dois lobos lado a lado e deixa de ser reconhecível; a faixa de
rotação fica sempre entre o 3/4 e o perfil.

O scroll suave é do **Lenis**, que continua chamando `window.scrollTo` — então
`sticky`, `IntersectionObserver` e âncoras seguem funcionando normalmente.

## Performance

- Abaixo de `lg` (1024px) o cérebro desce para baixo do texto e a interação
  de ponteiro é desligada — é o mesmo breakpoint em que a coluna de texto do
  hero passa a ocupar a largura toda. Densidade: 26.000 pontos no desktop,
  16.000 no tablet, 9.000 abaixo de 768px, com DPR limitado a 1.25.
- O X de repouso do cérebro é calculado da largura real da janela, não fixo
  em unidades de mundo: uma unidade vale mais pixels quanto mais alta é a
  tela, então um valor fixo encostava na borda direita em telas altas e
  sobrava espaço nas baixas.
- A nuvem leva ~250 ms para ser gerada, então a cena monta em
  `requestIdleCallback` — o texto do hero aparece antes.
- `PerformanceMonitor` (drei) reduz o DPR se o framerate cair.
- `IntersectionObserver` + `visibilitychange` congelam o render loop quando o
  palco sai da tela ou a aba perde o foco.
- `prefers-reduced-motion` desliga a animação, o scroll suave e as revelações.
- Um único draw call: `THREE.Points` com `ShaderMaterial`, sem antialias e sem
  depth buffer.

## Pendências antes de ir ao ar

- [x] ~~WhatsApp~~ — `+55 27 99761-9792`, em `src/lib/contato.js`. O botão
      abre o wa.me já com uma mensagem preenchida.
- [ ] **E-mail, endereço e redes sociais.** Ainda não informados, então não
      aparecem em lugar nenhum. Quando chegarem, entram em
      `src/lib/contato.js` e no rodapé.
- [ ] **Paleta oficial da marca.** A atual foi derivada da foto da Janaína —
      verde do logo `#206050`, sálvia da parede `#7b876e`, areia da almofada
      `#bc9d91`. Todos os tokens ficam no `@theme` de `src/index.css`.
- [ ] **Texto da Music'art.** O material recebido corta em "é uma prática de
      ensino que utiliza". Falta o método próprio, como são as sessões, para
      quem e onde fica. Ver comentário no topo de `Espaco.jsx`.
- [ ] **Confirmar os três passos** de `ComoFunciona.jsx` com a Janaína. Eles
      descrevem o percurso de quem chega sem afirmar duração, frequência ou
      preço — nada disso veio no material, e por isso não está escrito.
- [ ] Imagem de compartilhamento (Open Graph). O favicon já está feito.
