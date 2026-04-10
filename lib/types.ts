// Shared types for API requests and responses

// ============ Auth ============

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    name: string
    email: string
    phone: string
    createdAt: string
  }
  message?: string
}

// ============ Orders ============

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

export interface DeliveryInfo {
  city: string | null
  address: string
  apartment: string
  time: string
}

export interface CreateOrderRequest {
  items: OrderItem[]
  total: number
  customer: {
    name: string
    phone: string
    email?: string
  }
  delivery: DeliveryInfo
  payment: "card" | "cash"
  comment?: string
  promoCode?: string
}

export interface Order {
  id: string
  userId?: string
  items: OrderItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
  customer: {
    name: string
    phone: string
    email?: string
  }
  delivery: DeliveryInfo
  payment: "card" | "cash"
  comment?: string
  promoCode?: string
  discount?: number
  orderNumber: string
}

export interface CreateOrderResponse {
  success: boolean
  order?: Order
  message?: string
}

// ============ Products ============

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  weight?: string
  rating?: number
  reviewsCount?: number
  inStock?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

// ============ Reviews ============

export interface Review {
  id: string
  userId: string
  userName: string
  productId: string
  rating: number
  comment: string
  createdAt: string
  avatar?: string
}

export interface CreateReviewRequest {
  productId: string
  rating: number
  comment: string
}

// ============ Promo Codes ============

export interface PromoCode {
  code: string
  description: string
  discountPercent: number
  minOrderAmount: number
  active: boolean
  validFrom: string
  validTo: string
  usageLimit?: number
  usedCount: number
}

export interface ApplyPromoCodeRequest {
  code: string
  orderTotal: number
}

export interface ApplyPromoCodeResponse {
  success: boolean
  discount?: number
  message?: string
}

// ============ Loyalty ============

export interface LoyaltyInfo {
  points: number
  totalSpent: number
  orderCount: number
  tier: string
  discount: number
  nextTier?: string
  nextTierPoints: number
  progress: number
}

// ============ Newsletter ============

export interface SubscribeRequest {
  email: string
  name?: string
}

// ============ Referral ============

export interface ReferralInfo {
  code: string
  totalReferrals: number
  successfulReferrals: number
  bonusPoints: number
}

// ============ API Response wrapper ============

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
