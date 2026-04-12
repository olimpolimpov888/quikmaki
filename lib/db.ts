import { createClient } from './supabase/server'
import { generateReferralCode } from './auth-utils'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// ========================
// Хелперы для маппинга (snake_case -> camelCase)
// Используем 'any' для входящих данных, чтобы TS не ругался на сырой ответ Supabase
// ========================

function mapUser(user: any) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatar_url,
    referralCode: user.referral_code,
    loyaltyPoints: user.loyalty_points || 0,
    totalSpent: user.total_spent || 0,
    orderCount: user.order_count || 0,
    createdAt: user.created_at,
  }
}

function mapOrder(order: any) {
  if (!order) return null
  return {
    id: order.id,
    userId: order.user_id,
    orderNumber: order.order_number,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    total: order.total,
    discount: order.discount || 0,
    loyaltyDiscount: order.loyalty_discount || 0,
    promoCode: order.promo_code,
    comment: order.comment,
    customer: {
      name: order.customer_name,
      phone: order.customer_phone,
      email: order.customer_email,
    },
    delivery: {
      city: order.delivery_city,
      address: order.delivery_address,
      apartment: order.delivery_apartment,
      time: order.delivery_time,
    },
    payment: order.payment_method,
    items: (order.order_items || []).map((item: any) => ({
      id: item.product_id,
      name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description,
    })),
  }
}

function mapReview(review: any) {
  if (!review) return null
  return {
    id: review.id,
    userId: review.user_id,
    userName: review.user_name,
    productId: review.product_id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at,
  }
}

function mapPromoCode(promo: any) {
  if (!promo) return null
  return {
    code: promo.code,
    description: promo.description,
    discountPercent: promo.discount_percent,
    minOrderAmount: promo.min_order_amount,
    active: promo.active,
    validFrom: promo.valid_from,
    validTo: promo.valid_to,
    usedCount: promo.used_count,
  }
}

// ========================
// Пользователи (Users)
// ========================

// Для логина (нужен хэш пароля)
export async function findUserByEmailRaw(email: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('users').select('*').eq('email', email).single()
  return data
}

// Для остальных случаев (безопасные данные)
export async function findUserByEmail(email: string) {
  const raw = await findUserByEmailRaw(email)
  return mapUser(raw)
}

export async function findUserById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('users').select('*').eq('id', id).single()
  return mapUser(data)
}

export async function createUser(data: { name: string; email: string; phone: string; hashedPassword: string }) {
  const supabase = await createClient()
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      hashed_password: data.hashedPassword,
      referral_code: generateReferralCode(),
      loyalty_points: 0,
      total_spent: 0,
      order_count: 0,
    })
    .select()
    .single()

  if (error) throw error
  return mapUser(user)
}

export async function updateUserStats(userId: string, total: number) {
  const supabase = await createClient()
  // Получаем текущие значения
  const { data: rawUser } = await supabase.from('users').select('order_count, total_spent, loyalty_points').eq('id', userId).single()

  if (rawUser) {
    await supabase.from('users').update({
      order_count: (rawUser.order_count || 0) + 1,
      total_spent: (rawUser.total_spent || 0) + total,
      loyalty_points: (rawUser.loyalty_points || 0) + Math.floor(total * 0.05),
    }).eq('id', userId)
  }
}

export async function updateUserProfile(userId: string, data: { name: string; email?: string; phone: string }) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('users')
    .update({
      name: data.name,
      email: data.email,
      phone: data.phone,
    })
    .eq('id', userId)

  if (error) throw error
  return true
}

// ========================
// Заказы (Orders)
// ========================

export async function createOrder(data: any) {
  const supabase = await createClient()
  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`

  // 1. Создаем заказ
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: data.userId || null,
      order_number: orderNumber,
      status: 'pending',
      customer_name: data.customer.name,
      customer_phone: data.customer.phone,
      customer_email: data.customer.email,
      delivery_city: data.delivery.city,
      delivery_address: data.delivery.address,
      delivery_apartment: data.delivery.apartment,
      delivery_time: data.delivery.time,
      payment_method: data.payment,
      total: data.total,
      discount: data.discount || 0,
      loyalty_discount: data.loyaltyDiscount || 0,
      promo_code: data.promoCode,
      comment: data.comment,
    })
    .select()
    .single()

  if (error) throw error

  // 2. Создаем товары заказа (используем admin client чтобы обойти RLS)
  if (data.items && data.items.length > 0) {
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const itemsToInsert = data.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description,
    }))

    const { error: itemsError } = await adminSupabase.from('order_items').insert(itemsToInsert)
    if (itemsError) {
      console.error('Error inserting order items:', itemsError)
      // Не выбрасываем ошибку, чтобы заказ всё равно создался
    }
  }

  // 3. Обновляем статистику пользователя
  if (data.userId) {
    await updateUserStats(data.userId, data.total)
  }

  // 4. Возвращаем готовый заказ
  return mapOrder(order)
}

export async function getOrders(userId?: string) {
  const supabase = await createClient()
  let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
  if (userId) query = query.eq('user_id', userId)
  
  const { data } = await query
  return (data || []).map(mapOrder)
}

export async function getOrderById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .or(`id.eq.${id},order_number.eq.${id}`)
    .single()
  return mapOrder(data)
}

// ========================
// Промокоды
// ========================

export async function getAllPromoCodes() {
  const supabase = await createClient()
  const { data } = await supabase.from('promo_codes').select('*')
  return (data || []).map(mapPromoCode)
}

export async function validatePromoCode(code: string, total: number) {
  const supabase = await createClient()
  const { data: promo } = await supabase.from('promo_codes').select('*').eq('code', code.toUpperCase()).single()

  if (!promo) return { valid: false, message: 'Промокод не найден' }
  if (!promo.active) return { valid: false, message: 'Промокод неактивен' }
  
  const now = new Date()
  if (now < new Date(promo.valid_from) || (promo.valid_to && now > new Date(promo.valid_to))) {
    return { valid: false, message: 'Промокод истёк' }
  }

  if (total < promo.min_order_amount) {
    return { valid: false, message: `Минимальная сумма: ${promo.min_order_amount} ₽` }
  }

  return { valid: true, discount: Math.round(total * (promo.discount_percent / 100)) }
}

export async function incrementPromoCodeUsage(code: string) {
  const supabase = await createClient()
  const { data: promo } = await supabase.from('promo_codes').select('used_count').eq('code', code.toUpperCase()).single()
  if (promo) {
    await supabase.from('promo_codes').update({ used_count: (promo.used_count || 0) + 1 }).eq('code', code.toUpperCase())
  }
}

// ========================
// Отзывы
// ========================

export async function getReviews(productId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false })
  return (data || []).map(mapReview)
}

export async function createReview(data: { userId: string; userName: string; productId: string; rating: number; comment: string }) {
  const supabase = await createClient()
  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      user_id: data.userId,
      user_name: data.userName,
      product_id: data.productId,
      rating: data.rating,
      comment: data.comment,
    })
    .select()
    .single()
  
  if (error) throw error
  return mapReview(review)
}

// ========================
// Рассылка
// ========================

export async function subscribe(email: string, name?: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('newsletter_subscribers').insert({ email, name })
  if (error) return { success: false, message: error.message }
  return { success: true, message: 'Вы подписались!' }
}

// ========================
// Статистика пользователя и Достижения
// ========================

export async function getUserProfileStats(userId: string) {
  const supabase = await createClient()

  // 1. Базовые данные
  const { data: user } = await supabase
    .from('users')
    .select('loyalty_points, total_spent, order_count')
    .eq('id', userId)
    .single()

  if (!user) return null

  // 2. Считаем товары для достижений
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_items(product_name, quantity)')
    .eq('user_id', userId)

  let rollsCount = 0
  let dessertsCount = 0
  let pizzasCount = 0

  orders?.forEach((order: any) => {
    order.order_items?.forEach((item: any) => {
      const name = item.product_name.toLowerCase()
      if (name.includes('ролл') || name.includes('суши') || name.includes('филадельфия') || name.includes('дракон')) {
        rollsCount += item.quantity
      }
      if (name.includes('десерт') || name.includes('моти') || name.includes('чизкейк')) {
        dessertsCount += item.quantity
      }
      if (name.includes('пицца')) {
        pizzasCount += item.quantity
      }
    })
  })

  return {
    points: user.loyalty_points || 0,
    spent: user.total_spent || 0,
    orderCount: user.order_count || 0,
    achievements: {
      firstOrder: user.order_count >= 1,
      sweetTooth: dessertsCount >= 5,
      pizzaMan: pizzasCount >= 10,
      rollMaster: rollsCount >= 20,
      nightOwl: false,
      generous: false,
    }
  }
}

// ========================
// Реферальная система
// ========================

export async function getReferralInfo(userId: string) {
  const supabase = await createClient()

  // Получаем реферальный код пользователя
  const { data: user } = await supabase
    .from('users')
    .select('referral_code, loyalty_points')
    .eq('id', userId)
    .single()

  if (!user) return null

  // Получаем рефералов (пользователей, которые использовали этот код)
  const { data: referrals } = await supabase
    .from('referrals')
    .select('*, referred_user:users(name, email, created_at)')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })

  // Считаем успешных рефералов (тех кто сделал заказ)
  const successfulReferrals = referrals?.filter(r => r.converted) || []

  return {
    referralCode: user.referral_code,
    totalReferrals: referrals?.length || 0,
    successfulReferrals: successfulReferrals.length,
    bonusPoints: user.loyalty_points || 0,
    referrals: (referrals || []).map(r => ({
      id: r.id,
      name: r.referred_user?.name,
      email: r.referred_user?.email,
      createdAt: r.created_at,
      converted: r.converted,
    }))
  }
}

export async function applyReferralCode(newUserId: string, referralCode: string) {
  const supabase = await createClient()

  // Находим пользователя с таким реферальным кодом
  const { data: referrer } = await supabase
    .from('users')
    .select('id, loyalty_points')
    .eq('referral_code', referralCode.toUpperCase())
    .single()

  if (!referrer) return { success: false, message: 'Неверный реферальный код' }

  // Создаём запись о реферале
  const { error: referralError } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrer.id,
      referred_id: newUserId,
      converted: false,
    })

  if (referralError) return { success: false, message: referralError.message }

  // Начисляем бонусы рефереру
  const bonusPoints = 100
  await supabase
    .from('users')
    .update({
      loyalty_points: (referrer.loyalty_points || 0) + bonusPoints,
    })
    .eq('id', referrer.id)

  return { success: true, message: 'Реферальный код применён!' }
}

export async function markReferralConverted(newUserId: string) {
  const supabase = await createClient()

  // Находим реферальную запись
  const { data: referral } = await supabase
    .from('referrals')
    .select('referrer_id')
    .eq('referred_id', newUserId)
    .single()

  if (!referral) return

  // Отмечаем как конвертированный
  await supabase
    .from('referrals')
    .update({ converted: true })
    .eq('referred_id', newUserId)

  // Начисляем дополнительные бонусы рефереру за конверсию
  const { data: referrer } = await supabase
    .from('users')
    .select('loyalty_points')
    .eq('id', referral.referrer_id)
    .single()

  if (referrer) {
    await supabase
      .from('users')
      .update({
        loyalty_points: (referrer.loyalty_points || 0) + 50,
      })
      .eq('id', referral.referrer_id)
  }
}
