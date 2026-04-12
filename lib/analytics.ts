// Analytics event tracking helpers
import { track } from '@vercel/analytics'

export type AnalyticsEvent =
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_product'
  | 'start_checkout'
  | 'complete_order'
  | 'search_products'
  | 'apply_promo_code'
  | 'add_to_favorites'
  | 'remove_from_favorites'
  | 'write_review'
  | 'subscribe_newsletter'
  | 'share_referral'
  | 'track_order'
  | 'login'
  | 'register'
  | 'view_promotion'

interface AnalyticsPayload {
  // Product events
  productId?: string
  productName?: string
  productPrice?: number
  productCategory?: string

  // Cart events
  cartTotal?: number
  cartItemsCount?: number

  // Order events
  orderId?: string
  orderTotal?: number
  orderNumber?: string

  // Search events
  searchQuery?: string
  searchResultsCount?: number

  // Promo events
  promoCode?: string
  discountAmount?: number

  // User events
  userId?: string

  // Custom
  [key: string]: string | number | boolean | undefined
}

export function trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track(event, payload as any)
  } catch {
    // Analytics not available
  }
}

// Convenience functions
export const analytics = {
  // Product
  viewProduct: (productId: string, name: string, price: number, category: string) =>
    trackEvent('view_product', { productId, productName: name, productPrice: price, productCategory: category }),

  // Cart
  addToCart: (productId: string, name: string, price: number, cartTotal: number, cartItemsCount: number) =>
    trackEvent('add_to_cart', { productId, productName: name, productPrice: price, cartTotal, cartItemsCount }),

  removeFromCart: (productId: string) =>
    trackEvent('remove_from_cart', { productId }),

  // Checkout
  startCheckout: (cartTotal: number, cartItemsCount: number) =>
    trackEvent('start_checkout', { cartTotal, cartItemsCount }),

  completeOrder: (orderId: string, orderNumber: string, orderTotal: number) =>
    trackEvent('complete_order', { orderId, orderNumber, orderTotal }),

  // Search
  searchProducts: (query: string, resultsCount: number) =>
    trackEvent('search_products', { searchQuery: query, searchResultsCount: resultsCount }),

  // Promo
  applyPromoCode: (code: string, discount: number) =>
    trackEvent('apply_promo_code', { promoCode: code, discountAmount: discount }),

  // Favorites
  addToFavorites: (productId: string) =>
    trackEvent('add_to_favorites', { productId }),

  removeFromFavorites: (productId: string) =>
    trackEvent('remove_from_favorites', { productId }),

  // Review
  writeReview: (productId: string, rating: number) =>
    trackEvent('write_review', { productId, rating }),

  // Newsletter
  subscribeNewsletter: (email: string) =>
    trackEvent('subscribe_newsletter', { email }),

  // Referral
  shareReferral: () =>
    trackEvent('share_referral'),

  // Order tracking
  trackOrder: (orderId: string) =>
    trackEvent('track_order', { orderId }),

  // Auth
  login: (userId: string) =>
    trackEvent('login', { userId }),

  register: (userId: string) =>
    trackEvent('register', { userId }),

  // Promotions
  viewPromotion: (promotionId: string, title: string) =>
    trackEvent('view_promotion', { promotionId, promotionTitle: title }),
}
