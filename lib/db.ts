import { createClient } from './supabase/server'
import { generateReferralCode } from './auth-utils'
import type { Order, Review, PromoCode } from './types'

// ========================
// Пользователи (Users)
// ========================

export async function findUserByEmail(email: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  return data
}

export async function findUserById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function createUser(data: {
  name: string
  email: string
  phone: string
  hashedPassword: string
}) {
  const supabase = await createClient()
  const referralCode = generateReferralCode()
  
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      hashed_password: data.hashedPassword,
      referral_code: referralCode,
      loyalty_points: 0,
      total_spent: 0,
      order_count: 0,
    })
    .select()
    .single()

  if (error) throw error
  return user
}

export async function updateUser(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return data
}

// ========================
// Заказы (Orders)
// ========================

export async function createOrder(orderData: any) {
  const supabase = await createClient()
  
  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.userId || null,
      order_number: orderNumber,
      status: 'pending',
      customer_name: orderData.customer.name,
      customer_phone: orderData.customer.phone,
      customer_email: orderData.customer.email,
      delivery_city: orderData.delivery.city,
      delivery_address: orderData.delivery.address,
      delivery_apartment: orderData.delivery.apartment,
      delivery_time: orderData.delivery.time,
      payment_method: orderData.payment,
      total: orderData.total,
      discount: orderData.discount || 0,
      promo_code: orderData.promoCode,
      comment: orderData.comment,
    })
    .select()
    .single()

  if (orderError) throw orderError

  if (orderData.items && orderData.items.length > 0) {
    const itemsToInsert = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert)
    
    if (itemsError) throw itemsError
  }

  if (orderData.userId) {
    const user = await findUserById(orderData.userId)
    if (user) {
      await updateUser(orderData.userId, {
        order_count: (user.order_count || 0) + 1,
        total_spent: (user.total_spent || 0) + orderData.total,
        loyalty_points: (user.loyalty_points || 0) + Math.floor(orderData.total * 0.05),
      })
    }
  }

  return order
}

export async function getOrders(userId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data } = await query
  return data || []
}

export async function getOrderById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .or(`id.eq.${id},order_number.eq.${id}`)
    .single()
  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return data
}

// ========================
// Промокоды (Promo Codes)
// ========================

export async function getAllPromoCodes() {
  const supabase = await createClient()
  const { data } = await supabase.from('promo_codes').select('*')
  return data || []
}

export async function validatePromoCode(code: string, orderTotal: number) {
  const supabase = await createClient()
  const { data: promo } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (!promo) return { valid: false, message: 'Промокод не найден' }
  if (!promo.active) return { valid: false, message: 'Промокод неактивен' }
  
  const now = new Date()
  if (now < new Date(promo.valid_from) || (promo.valid_to && now > new Date(promo.valid_to))) {
    return { valid: false, message: 'Промокод истёк' }
  }

  if (orderTotal < promo.min_order_amount) {
    return { valid: false, message: `Минимальная сумма: ${promo.min_order_amount} ₽` }
  }

  return { valid: true, discount: Math.round(orderTotal * (promo.discount_percent / 100)) }
}

export async function incrementPromoCodeUsage(code: string) {
  const supabase = await createClient()
  const { data: promo } = await supabase
    .from('promo_codes')
    .select('used_count')
    .eq('code', code.toUpperCase())
    .single()

  if (promo) {
    await supabase
      .from('promo_codes')
      .update({ used_count: (promo.used_count || 0) + 1 })
      .eq('code', code.toUpperCase())
  }
}

// ========================
// Отзывы (Reviews)
// ========================

export async function createReview(data: {
  userId: string
  userName: string
  productId: string
  rating: number
  comment: string
}) {
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
  return review
}

export async function getReviewsByProductId(productId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getProductAverageRating(productId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
  
  if (!data || data.length === 0) return { average: 0, count: 0 }
  
  const sum = data.reduce((acc: number, r: any) => acc + r.rating, 0)
  return { average: Math.round((sum / data.length) * 10) / 10, count: data.length }
}

// ========================
// Подписка (Newsletter)
// ========================

export async function subscribeToNewsletter(email: string, name?: string) {
  const supabase = await createClient()
  
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return { success: false, message: 'Вы уже подписаны' }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, name })

  if (error) return { success: false, message: error.message }
  return { success: true, message: 'Вы подписались!' }
}
