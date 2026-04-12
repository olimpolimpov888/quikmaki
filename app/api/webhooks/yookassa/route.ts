import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/yookassa'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY

/**
 * Webhook для получения уведомлений от ЮKassa
 * Документация: https://yookassa.ru/developers/using-api/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию webhook (ЮKassa отправляет Basic Auth)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Верификация: ЮKassa использует Basic Auth с secret_key
    const expectedAuth = `Basic ${Buffer.from(`:${SECRET_KEY}`).toString('base64')}`
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 })
    }

    const body = await request.json()
    const eventType = body.event
    const paymentObject = body.object

    console.log(`YooKassa webhook received: ${eventType}`, paymentObject.id)

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Обрабатываем разные типы событий
    switch (eventType) {
      case 'payment.succeeded': {
        // Платёж успешно проведён
        const orderId = paymentObject.metadata?.order_id
        if (orderId) {
          // Обновляем статус платежа
          await adminSupabase
            .from('yookassa_payments')
            .update({
              status: 'succeeded',
              paid_at: paymentObject.paid_at || new Date().toISOString(),
            })
            .eq('yookassa_payment_id', paymentObject.id)

          // Обновляем статус заказа
          await adminSupabase
            .from('orders')
            .update({
              status: 'confirmed',
              payment_method: 'card',
            })
            .eq('id', orderId)

          // Если у заказа есть пользователь — помечаем реферал как конвертированный
          const { data: order } = await adminSupabase
            .from('orders')
            .select('user_id')
            .eq('id', orderId)
            .single()

          if (order?.user_id) {
            // Проверяем, есть ли реферальная запись
            const { data: referral } = await adminSupabase
              .from('referrals')
              .select('id')
              .eq('referred_id', order.user_id)
              .eq('converted', false)
              .single()

            if (referral) {
              await adminSupabase
                .from('referrals')
                .update({ converted: true })
                .eq('id', referral.id)

              // Начисляем бонус рефереру
              const { data: referrer } = await adminSupabase
                .from('referrals')
                .select('referrer_id')
                .eq('id', referral.id)
                .single()

              if (referrer?.referrer_id) {
                const { data: referrerData } = await adminSupabase
                  .from('users')
                  .select('loyalty_points')
                  .eq('id', referrer.referrer_id)
                  .single()

                if (referrerData) {
                  await adminSupabase
                    .from('users')
                    .update({
                      loyalty_points: (referrerData.loyalty_points || 0) + 50,
                    })
                    .eq('id', referrer.referrer_id)
                }
              }
            }
          }
        }
        break
      }

      case 'payment.canceled': {
        // Платёж отменён
        const orderId = paymentObject.metadata?.order_id
        if (orderId) {
          await adminSupabase
            .from('yookassa_payments')
            .update({ status: 'canceled' })
            .eq('yookassa_payment_id', paymentObject.id)

          await adminSupabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId)
        }
        break
      }

      case 'payment.waiting_for_capture': {
        // Платёж ожидает подтверждения (если capture=false)
        const orderId = paymentObject.metadata?.order_id
        if (orderId) {
          await adminSupabase
            .from('yookassa_payments')
            .update({ status: 'waiting_for_capture' })
            .eq('yookassa_payment_id', paymentObject.id)
        }
        break
      }

      case 'refund.succeeded': {
        // Возврат средств проведён
        console.log('Refund succeeded:', paymentObject.id)
        break
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('YooKassa webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
