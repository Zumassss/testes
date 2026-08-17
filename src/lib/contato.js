/**
 * Dados de contato reais da Music'art, num lugar so.
 *
 * O restante (e-mail, endereco e redes) ainda nao foi informado — por isso
 * nao existe aqui. Nada foi preenchido por suposicao.
 */
export const WHATSAPP_NUMERO = '+55 27 99761-9792'

/* formato exigido pelo wa.me: so digitos, com DDI */
const WHATSAPP_E164 = '5527997619792'

const MENSAGEM =
  'Olá, Janaína! Vim pelo site da Music’art e gostaria de conversar sobre musicoterapia.'

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(MENSAGEM)}`

export const TELEFONE_LINK = `tel:+${WHATSAPP_E164}`
