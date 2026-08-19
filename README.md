# Music'art — Espaço Terapêutico

Site do espaço de musicoterapia da Janaina Lima Zumach.

**Stack:** React 18 + Vite + Tailwind CSS 4 + React Three Fiber (Three.js) + Lenis.
**Tipografia:** Playfair Display (títulos) + Manrope (texto).

## Marca

Paleta **oficial**, em `@theme` no `src/index.css`:

| Nome | Hex | Uso |
| --- | --- | --- |
| Eucalípto | `#86A485` | verde principal (`brand-500`) |
| Passeio Ecológico | `#B7CDB5` | verde claro (`brand-300`) |
| Algodão Egípcio | `#EEE3D5` | bege (`cream-200`) |
| Branco Gelo | `#FCF4E7` | fundo da página (`cream-50`) |
| Marrom da logo | `#56361A` | tinta do texto |

O verde da paleta é o mesmo da linha de batimento da logo — amostrado do
arquivo, deu `#84A082`. Os tons intermediários foram derivados desses cinco,
e os de texto respeitam contraste AA sobre o Branco Gelo.

Arquivos em `src/assets/`, todos com o fundo branco removido por
preenchimento a partir das bordas **mais** rotulagem de componentes fechados
(o vão entre as pernas do mascote e o miolo do selo não se ligam à borda):

- `logo.webp` — barra e rodapé; sobre a seção escura ela inverte para clara
- `mascote.webp` — o personagem das apostilas
- `selo-musicoterapia.webp` — emblema da **profissão**, não da Music'art;
  aparece com legenda, em escala pequena, junto das credenciais e no rodapé

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
    contato.js               WhatsApp da Janaina (único lugar)
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
    Sobre.jsx                Janaina: retrato, texto e citação
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

O site travava no celular. As causas, em ordem de peso, e o que foi feito:

1. **O three.js ia para o celular sem nunca ser usado.** A cena agora entra
   por `lazy()` e só é montada acima de 1024px com ponteiro fino. O bundle
   inicial do celular caiu de ~285 KB para **58 KB** gzip.
2. **`mix-blend-mode: multiply` numa camada fixa de tela cheia** (o grão de
   papel) obriga o navegador a recompor tudo que está embaixo a cada quadro.
   Foi removido; o grão virou um PNG de opacidade baixa, e só no desktop.
3. **`background-attachment: fixed` no `body`** força repintura do fundo
   inteiro durante o scroll. Removido.
4. **Quatro manchas grandes animadas + uma faixa de 220% da largura**, todas
   com `will-change`. Viraram três, e a animação só existe acima de 1024px.
5. **Lenis rodando um rAF por quadro no celular** para reimplementar um
   scroll que o sistema já faz melhor, na thread de composição. Desligado no
   celular; só carrega no desktop, e também por `import()` dinâmico.
6. **`backdrop-blur` em dezenas de cartões.** Substituído por cor sólida; só
   a barra fixa mantém o blur, e apenas no desktop.
7. **O brilho que segue o cursor** só é declarado sob
   `@media (hover: hover) and (pointer: fine)`.

O que continua valendo na cena 3D:

- 20.000 pontos, um único draw call (`THREE.Points` + `ShaderMaterial`), sem
  antialias e sem depth buffer.
- O X de repouso é calculado da largura real da janela, não fixo em unidades
  de mundo: uma unidade vale mais pixels quanto mais alta é a tela, então um
  valor fixo encostava na borda direita em telas altas.
- A nuvem leva ~200 ms para ser gerada, então a cena monta em
  `requestIdleCallback` — o texto do hero aparece antes.
- `PerformanceMonitor` (drei) reduz o DPR se o framerate cair.
- `IntersectionObserver` + `visibilitychange` congelam o render loop.
- `prefers-reduced-motion` desliga animação, scroll suave e revelações.

## Pendências antes de ir ao ar

- [x] ~~WhatsApp~~ — `+55 27 99927-7207`, em `src/lib/contato.js`. O botão
      abre o wa.me já com uma mensagem preenchida.
- [ ] **E-mail, endereço e redes sociais.** Ainda não informados, então não
      aparecem em lugar nenhum. Quando chegarem, entram em
      `src/lib/contato.js` e no rodapé.
- [x] ~~Paleta oficial da marca~~ — aplicada (ver **Marca**, acima).
- [x] ~~Logo, mascote e emblema da musicoterapia~~ — recortados e aplicados.
- [ ] **Texto da Music'art.** O material recebido corta em "é uma prática de
      ensino que utiliza". Falta o método próprio, como são as sessões, para
      quem e onde fica. Ver comentário no topo de `Espaco.jsx`.
- [ ] **Confirmar os três passos** de `ComoFunciona.jsx` com a Janaina. Eles
      descrevem o percurso de quem chega sem afirmar duração, frequência ou
      preço — nada disso veio no material, e por isso não está escrito.
- [ ] Imagem de compartilhamento (Open Graph). O favicon já está feito.
