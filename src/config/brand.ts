export const BRAND_CONFIG = {
  name: 'EVO',
  tagline: 'Graphic Streetwear — Egypt',
  currency: 'EGP',
  currencyAr: 'ج.م',
  flagshipPrice: 599,
  shippingFee: 25,
  deliveryTime: '3-5 business days',
  deliveryTimeAr: '3-5 أيام عمل',
  paymentMethod: 'Cash on Delivery (COD)',
  paymentMethodAr: 'الدفع عند الاستلام (كاش)',
  whatsappNumber: '201277627382',
  supportEmail: 'evo.brand.eg@gmail.com',
  location: 'Damanhour, Egypt',
  locationAr: 'دمنهور، مصر',
  announcementTextAr: 'الدفع عند الاستلام | شحن 25 ج لجميع المحافظات | توصيل خلال 3-5 أيام',
  announcementTextEn: 'Cash on Delivery | 25 EGP Flat Shipping Nationwide | Delivery within 3-5 Days',
  pixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  modelInfo: 'Model is 180cm wearing size L',
  modelInfoAr: 'الموديل طوله 180 سم ويرتدي مقاس L',
  sizes: ['M', 'L', 'XL', '2XL'] as const,
  specs: {
    fabricEn: '100% Premium Egyptian Cotton, Heavyweight / High GSM',
    fabricAr: 'قطن مصري بريميوم 100%، وزن ثقيل ميلتون / سينجل چيرسي عالي الجودة',
    cutEn: 'Streetwear Oversized Fit (Boxy & Relaxed Silhouette)',
    cutAr: 'قصة أوفرسايز ستريت وير مريحة مع أكتاف منسدلة',
    printEn: 'High-durability screen print (Wash-resistant)',
    printAr: 'طباعة سلك سكرين عالية المتانة ومقاومة للغسيل المتكرر',
    careEn: 'Machine wash cold inside out, do not iron directly on print',
    careAr: 'غسيل آلي بماء بارد على الظهر، تجنب الكي المباشر على الطباعة',
  },
}

export function getWhatsAppTrackingUrl(orderId?: string, isArabic = false): string {
  const phone = BRAND_CONFIG.whatsappNumber
  if (orderId && orderId.trim()) {
    const text = isArabic
      ? `مرحبا EVO، أود تتبع طلبي رقم #${orderId.trim()}`
      : `Hi EVO, I would like to track my order #${orderId.trim()}`
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  }
  const text = isArabic
    ? 'مرحبا EVO، أود تتبع طلبي'
    : 'Hi EVO, I would like to track my order'
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export function getWhatsAppSupportUrl(message?: string, isArabic = false): string {
  const phone = BRAND_CONFIG.whatsappNumber
  const defaultText = isArabic
    ? 'مرحبا EVO، أحتاج مساعدة بخصوص منتجاتكم'
    : 'Hi EVO, I would like some assistance with my order / sizing'
  const text = message || defaultText
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export function getWhatsAppExchangeUrl(orderId?: string, isArabic = false): string {
  const phone = BRAND_CONFIG.whatsappNumber
  const text = isArabic
    ? `مرحبا EVO، أود طلب استبدال مقاس لطلبي${orderId ? ` رقم #${orderId}` : ''}`
    : `Hi EVO, I would like to request a size exchange for order${orderId ? ` #${orderId}` : ''}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
