import { NextRequest, NextResponse } from 'next/server'
import { createPayment, formatAmount } from '@/lib/yookassa'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { orderId, amount, description, customerEmail, customerPhone, items } = body

    // === РЕЖИМ СИМУЛЯЦИИ (Mock Mode) ===
    if (process.env.NEXT_PUBLIC_MOCK_PAYMENT === 'true') {
      const url = new URL(request.url)
      const baseUrl = `${url.protocol}//${url.host}`

      return NextResponse.json({
        success: true,
        paymentId: 'mock-payment-id',
        confirmationUrl: `${baseUrl}/mock-payment?orderId=${orderId}&amount=${amount}`,
        status: 'pending',
      })
    }
    // ==================================

    if (!orderId || !amount || !description) {
      return NextResponse.json(
        { success: false, message: 'Неверные параметры' },
        { status: 400 }
      )
    }

    const returnUrl = process.env.YOOKASSA_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${orderId}`

    // Формируем чек для онлайн-кассы (обязательно по 54-ФЗ)
    const receipt = {
      customer: {
        email: customerEmail || undefined,
        phone: customerPhone || undefined,
      },
      items: (items || []).map((item: any) => ({
        description: item.name,
        quantity: String(item.quantity),
        amount: {
          value: formatAmount(item.price * item.quantity),
          currency: 'RUB',
        },
        vat_code: 2, // НДС 10% (для продуктов питания)
      })),
    }

    // Создаём платёж в ЮKassa
    const payment = await createPayment({
      amount: {
        value: formatAmount(amount),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      capture: true, // Автоматическое списание
      description,
      metadata: {
        order_id: orderId,
        user_id: user?.id || 'anonymous',
      },
      receipt,
    })

    // Сохраняем платёж в БД
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    await adminSupabase.from('yookassa_payments').insert({
      order_id: orderId,
      yookassa_payment_id: payment.id,
      amount,
      currency: 'RUB',
      status: payment.status,
      payment_method: 'bank_card',
      confirmation_url: payment.confirmation?.confirmation_url,
      metadata: {
        order_id: orderId,
        user_id: user?.id || 'anonymous',
      },
    })

    // Обновляем статус заказа на "ожидание оплаты"
    await adminSupabase
      .from('orders')
      .update({ status: 'awaiting_payment' })
      .eq('id', orderId)

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      confirmationUrl: payment.confirmation?.confirmation_url,
      status: payment.status,
    })
  } catch (error: any) {
    console.error('YooKassa create payment error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Ошибка создания платежа' },
      { status: 500 }
    )
  }
}
