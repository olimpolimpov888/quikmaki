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
  category?: string
  description?: string
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
  userId?: string | null
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
  loyaltyDiscount?: number
  deliveryFee?: number
}

export interface Order {
  id: string
  userId?: string
  items: OrderItem[]
  total: number
  status: "pending" | "awaiting_payment" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled" | "payment_cancelled"
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
  loyaltyDiscount?: number
  deliveryFee?: number
  orderNumber: string
}

export interface CreateOrderResponse {
  success: boolean
  order?: Order
  message?: string
  paymentUrl?: string
  paymentId?: string
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
  description?: string
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
  referralCode: string
  totalReferrals: number
  successfulReferrals: number
  bonusPoints: number
  referrals?: Array<{
    id: string
    name?: string
    email?: string
    createdAt: string
    converted: boolean
  }>
}

// ============ YooKassa Payments ============

export interface YooKassaPayment {
  id: string
  orderId: string
  yookassaPaymentId: string
  amount: number
  currency: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  paymentMethod: string
  confirmationUrl: string | null
  paidAt: string | null
  expiresAt: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentRequest {
  orderId: string
  amount: number
  description: string
  customerEmail?: string
  customerPhone?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export interface CreatePaymentResponse {
  success: boolean
  paymentId?: string
  confirmationUrl?: string
  status?: string
  message?: string
}

// ============ Delivery Cities ============

export interface DeliveryCity {
  id: string
  name: string
  deliveryFee: number
  minOrderAmount: number
  isActive: boolean
  createdAt: string
}

// ============ Working Hours ============

export interface WorkingHour {
  id: string
  dayOfWeek: number // 0=Вс, 1=Пн, ...
  openTime: string
  closeTime: string
  breakStart: string | null
  breakEnd: string | null
  isActive: boolean
}

// ============ Products ============

export interface ProductCategory {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface ProductModifier {
  id: string
  productId: string
  name: string
  price: number
  isRequired: boolean
  sortOrder: number
  createdAt: string
}

export interface Ingredient {
  id: string
  name: string
  allergens: string[]
  isVegan: boolean
  isVegetarian: boolean
  createdAt: string
}

export interface ProductIngredient {
  id: string
  productId: string
  ingredientId: string
  quantity: string | null
  createdAt: string
}

// ============ Promotional Banners ============

export interface PromotionalBanner {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string | null
  link: string | null
  isActive: boolean
  startDate: string
  endDate: string | null
  sortOrder: number
  createdAt: string
}

// ============ API Response wrapper ============

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
