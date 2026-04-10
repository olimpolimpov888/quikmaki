// In-memory "database" using localStorage for server-side API simulation
// This acts as a simple database layer for API routes

import type {
  Order,
  Review,
  PromoCode,
  SubscribeRequest,
  ReferralInfo,
} from "./types"
import { generateId, generateOrderNumber, generateReferralCode } from "./auth-utils"

// ============ Database helpers ============

function getFromDB<T>(key: string): T[] {
  if (typeof window === "undefined") {
    // Server-side: use in-memory store
    return (globalThis as Record<string, unknown>)[key] as T[] || []
  }
  try {
    return JSON.parse(localStorage.getItem(key) || "[]")
  } catch {
    return []
  }
}

function saveToDB<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") {
    ;(globalThis as Record<string, unknown>)[key] = data
  } else {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// ============ Users ============

export interface UserRecord {
  id: string
  name: string
  email: string
  phone: string
  hashedPassword: string
  createdAt: string
  avatar?: string
  referralCode: string
  referredBy?: string
  loyaltyPoints: number
  totalSpent: number
  orderCount: number
}

export function findUserByEmail(email: string): UserRecord | undefined {
  const users = getFromDB<UserRecord>("db-users")
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(data: Omit<UserRecord, "id" | "createdAt" | "referralCode" | "loyaltyPoints" | "totalSpent" | "orderCount">): UserRecord {
  const users = getFromDB<UserRecord>("db-users")
  const newUser: UserRecord = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    referralCode: generateReferralCode(),
    loyaltyPoints: 0,
    totalSpent: 0,
    orderCount: 0,
  }
  users.push(newUser)
  saveToDB("db-users", users)
  return newUser
}

export function findUserById(id: string): UserRecord | undefined {
  const users = getFromDB<UserRecord>("db-users")
  return users.find((u) => u.id === id)
}

export function updateUser(id: string, data: Partial<UserRecord>): UserRecord | undefined {
  const users = getFromDB<UserRecord>("db-users")
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return undefined
  users[index] = { ...users[index], ...data }
  saveToDB("db-users", users)
  return users[index]
}

// ============ Orders ============

export function createOrder(data: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt" | "status">): Order {
  const orders = getFromDB<Order>("db-orders")
  const newOrder: Order = {
    ...data,
    id: generateId(),
    orderNumber: generateOrderNumber(),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  orders.push(newOrder)
  saveToDB("db-orders", orders)

  // Update user loyalty points if userId is present
  if (data.userId) {
    const users = getFromDB<UserRecord>("db-users")
    const userIndex = users.findIndex((u) => u.id === data.userId)
    if (userIndex !== -1) {
      users[userIndex].totalSpent += data.total
      users[userIndex].orderCount += 1
      users[userIndex].loyaltyPoints += Math.floor(data.total * 0.05) // 5% cashback
      saveToDB("db-users", users)
    }
  }

  return newOrder
}

export function getOrders(userId?: string): Order[] {
  const orders = getFromDB<Order>("db-orders")
  if (userId) {
    return orders.filter((o) => o.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getOrderById(id: string): Order | undefined {
  const orders = getFromDB<Order>("db-orders")
  return orders.find((o) => o.id === id || o.orderNumber === id)
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | undefined {
  const orders = getFromDB<Order>("db-orders")
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id)
  if (index === -1) return undefined
  orders[index].status = status
  orders[index].updatedAt = new Date().toISOString()
  saveToDB("db-orders", orders)
  return orders[index]
}

// ============ Reviews ============

export function createReview(data: Omit<Review, "id" | "createdAt">): Review {
  const reviews = getFromDB<Review>("db-reviews")
  const newReview: Review = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  reviews.push(newReview)
  saveToDB("db-reviews", reviews)
  return newReview
}

export function getReviewsByProductId(productId: string): Review[] {
  const reviews = getFromDB<Review>("db-reviews")
  return reviews
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getProductAverageRating(productId: string): { average: number; count: number } {
  const reviews = getReviewsByProductId(productId)
  if (reviews.length === 0) return { average: 0, count: 0 }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length }
}

// ============ Promo Codes ============

// Default promo codes
const defaultPromoCodes: PromoCode[] = [
  {
    code: "FIRST15",
    description: "Скидка 15% на первый заказ",
    discountPercent: 15,
    minOrderAmount: 500,
    active: true,
    validFrom: "2026-01-01T00:00:00Z",
    validTo: "2026-12-31T23:59:59Z",
    usedCount: 0,
  },
  {
    code: "SUSHI20",
    description: "Скидка 20% на роллы по вторникам",
    discountPercent: 20,
    minOrderAmount: 1000,
    active: true,
    validFrom: "2026-01-01T00:00:00Z",
    validTo: "2026-12-31T23:59:59Z",
    usedCount: 0,
  },
  {
    code: "WEEKEND",
    description: "Бесплатная доставка в выходные",
    discountPercent: 5,
    minOrderAmount: 800,
    active: true,
    validFrom: "2026-01-01T00:00:00Z",
    validTo: "2026-12-31T23:59:59Z",
    usedCount: 0,
  },
]

export function getAllPromoCodes(): PromoCode[] {
  const stored = getFromDB<PromoCode>("db-promocodes")
  if (stored.length === 0) {
    saveToDB("db-promocodes", defaultPromoCodes)
    return defaultPromoCodes
  }
  return stored
}

export function validatePromoCode(code: string, orderTotal: number): { valid: boolean; discount?: number; message?: string } {
  const promoCodes = getAllPromoCodes()
  const promo = promoCodes.find((p) => p.code.toUpperCase() === code.toUpperCase())

  if (!promo) {
    return { valid: false, message: "Промокод не найден" }
  }

  if (!promo.active) {
    return { valid: false, message: "Промокод неактивен" }
  }

  const now = new Date()
  if (now < new Date(promo.validFrom) || now > new Date(promo.validTo)) {
    return { valid: false, message: "Промокод истёк" }
  }

  if (orderTotal < promo.minOrderAmount) {
    return { valid: false, message: `Минимальная сумма заказа: ${promo.minOrderAmount} ₽` }
  }

  const discount = Math.round(orderTotal * (promo.discountPercent / 100))
  return { valid: true, discount }
}

export function incrementPromoCodeUsage(code: string): void {
  const promoCodes = getAllPromoCodes()
  const index = promoCodes.findIndex((p) => p.code.toUpperCase() === code.toUpperCase())
  if (index !== -1) {
    promoCodes[index].usedCount += 1
    saveToDB("db-promocodes", promoCodes)
  }
}

// ============ Newsletter ============

export function subscribeToNewsletter(data: SubscribeRequest): { success: boolean; message: string } {
  const subscribers = getFromDB<SubscribeRequest>("db-newsletter")
  const exists = subscribers.find((s) => s.email.toLowerCase() === data.email.toLowerCase())
  if (exists) {
    return { success: false, message: "Вы уже подписаны на рассылку" }
  }
  subscribers.push(data)
  saveToDB("db-newsletter", subscribers)
  return { success: true, message: "Вы успешно подписались!" }
}

// ============ Referrals ============

export function getReferralInfo(userId: string): ReferralInfo | undefined {
  const user = findUserById(userId)
  if (!user) return undefined

  const users = getFromDB<UserRecord>("db-users")
  const referredUsers = users.filter((u) => u.referredBy === user.referralCode)

  return {
    code: user.referralCode,
    totalReferrals: referredUsers.length,
    successfulReferrals: referredUsers.filter((u) => u.orderCount > 0).length,
    bonusPoints: referredUsers.length * 100, // 100 points per referral
  }
}

export function applyReferralCode(newUserId: string, referralCode: string): boolean {
  const users = getFromDB<UserRecord>("db-users")
  const referrer = users.find((u) => u.referralCode === referralCode.toUpperCase())
  if (!referrer) return false

  const newUserIndex = users.findIndex((u) => u.id === newUserId)
  if (newUserIndex === -1) return false

  users[newUserIndex].referredBy = referralCode.toUpperCase()
  referrer.loyaltyPoints += 100 // Bonus for referrer
  saveToDB("db-users", users)
  return true
}
