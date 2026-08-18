import mascote from '../assets/mascote.webp'

/**
 * O personagem que a Janaina criou e usa nas apostilas.
 *
 * No celular ele substitui o cerebro em particulas: uma imagem de 34 KB no
 * lugar de um canvas WebGL com milhares de pontos. Foi a troca que tirou o
 * travamento — e, como ele e didatico e as criancas reconhecem, o mobile
 * ganhou em vez de perder.
 */
export default function Mascote({
  className = '',
  largura = 260,
  flutuando = true,
  prioridade = false,
  alt = 'Mascote da Music’art: um cérebro de óculos, sorrindo',
}) {
  return (
    <img
      src={mascote}
      alt={alt}
      width={570}
      height={720}
      loading={prioridade ? 'eager' : 'lazy'}
      fetchPriority={prioridade ? 'high' : 'auto'}
      decoding="async"
      style={{ width: largura, maxWidth: '100%' }}
      className={`${flutuando ? 'flutua' : ''} h-auto select-none ${className}`}
      draggable={false}
    />
  )
}
