import { BRAND_CONFIG } from '@/config/brand'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: any
  }
}

export function initPixel(): void {
  if (typeof window === 'undefined') return
  const pixelId = BRAND_CONFIG.pixelId || '1148892496739988'

  if (window.fbq) {
    try {
      window.fbq('init', pixelId)
      console.log('[Meta Pixel] Initialized with ID:', pixelId)
    } catch (e) {
      console.warn('[Meta Pixel] Init warning:', e)
    }
  }
}

export function trackPixelPageView(path?: string): void {
  if (typeof window === 'undefined') return

  if (window.fbq) {
    try {
      window.fbq('track', 'PageView')
    } catch (e) {
      console.warn('[Meta Pixel] PageView error:', e)
    }
  }
  console.log('[Meta Pixel] Track PageView:', path || window.location.pathname)
}

export interface PixelContentParams {
  content_name: string
  content_ids: (string | number)[]
  value: number
  currency?: string
  content_type?: string
}

export function trackPixelViewContent(params: PixelContentParams): void {
  if (typeof window === 'undefined') return

  const payload = {
    content_name: params.content_name,
    content_ids: params.content_ids.map(String),
    value: params.value,
    currency: params.currency || BRAND_CONFIG.currency,
    content_type: params.content_type || 'product',
  }

  if (window.fbq) {
    try {
      window.fbq('track', 'ViewContent', payload)
    } catch (e) {
      console.warn('[Meta Pixel] ViewContent error:', e)
    }
  }
  console.log('[Meta Pixel] Track ViewContent:', payload)
}

export function trackPixelAddToCart(params: PixelContentParams): void {
  if (typeof window === 'undefined') return

  const payload = {
    content_name: params.content_name,
    content_ids: params.content_ids.map(String),
    value: params.value,
    currency: params.currency || BRAND_CONFIG.currency,
    content_type: params.content_type || 'product',
  }

  if (window.fbq) {
    try {
      window.fbq('track', 'AddToCart', payload)
    } catch (e) {
      console.warn('[Meta Pixel] AddToCart error:', e)
    }
  }
  console.log('[Meta Pixel] Track AddToCart:', payload)
}
