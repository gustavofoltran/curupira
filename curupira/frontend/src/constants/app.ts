// Informações da aplicação
export const APP_NAME = 'Curupira'
export const APP_DOMAIN = 'curupira.com.br'

// Informações de contato
export const APP_EMAIL = 'contato@curupira.com.br'
export const APP_PHONE = '(11) 99999-9999'
export const APP_PHONE_RAW = '+5511999999999'

// WhatsApp
export const APP_WHATSAPP_NUMBER = '5511999999999'
export const APP_WHATSAPP_DEFAULT_MESSAGE =
  'Olá! Gostaria de saber mais sobre o sistema Curupira.'
export const getWhatsAppLink = (
  message: string = APP_WHATSAPP_DEFAULT_MESSAGE,
) => `https://wa.me/${APP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

// Mapa - Coordenadas padrão
export const MAP_BRAZIL_CENTER: [number, number] = [-15.7801, -47.9292]
export const MAP_DEFAULT_ZOOM = 4

// Mapa - URLs dos ícones Leaflet
export const LEAFLET_ICON_RETINA_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png'
export const LEAFLET_ICON_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png'
export const LEAFLET_SHADOW_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
