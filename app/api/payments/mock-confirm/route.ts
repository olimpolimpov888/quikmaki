import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * API для подтверждения фейковой оплаты
 * POST /api/payments/mock-confirm
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'No orderId' }, { status: 400 })
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // 1. Обновляем статус платежа в таблице yookassa_payments (если запись есть)
    // Мы ставим status = 'succeeded', чтобы система считала, что оплата прошла
    await adminSupabase
      .from('yookassa_payments')
      .update({
        status: 'succeeded',
        paid_at: new Date().toISOString(),
      })
      .eq('order_id', orderId)

    // 2. Обновляем статус заказа на 'confirmed' (оплачен)
    await adminSupabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', orderId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Mock confirm error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}