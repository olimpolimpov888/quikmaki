import { NextRequest, NextResponse } from "next/server"
import { createOrder, validatePromoCode, incrementPromoCodeUsage, getOrders, createYooKassaPayment, updateOrderStatus } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import { createPayment, formatAmount } from "@/lib/yookassa"
import type { CreateOrderRequest, CreateOrderResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    // Получаем заказы текущего пользователя
    const orders = await getOrders(userId || undefined)
    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id ?? null

    const body: CreateOrderRequest = await request.json()
    if (!body.items || body.items.length === 0) return NextResponse.json({ success: false, message: "Корзина пуста" }, { status: 400 })
    if (!body.customer?.name || !body.customer?.phone) return NextResponse.json({ success: false, message: "Укажите имя и телефон" }, { status: 400 })
    if (!body.delivery?.address) return NextResponse.json({ success: false, message: "Укажите адрес" }, { status: 400 })

    // Общая скидка = промокод + лояльность
    const loyaltyDiscount = body.loyaltyDiscount || 0
    let promoDiscount = 0
    if (body.promoCode) {
      const res = await validatePromoCode(body.promoCode, body.total)
      if (res.valid && res.discount) {
        promoDiscount = res.discount
      }
    }
    const totalDiscount = loyaltyDiscount + promoDiscount

    // Создание заказа
    const order = await createOrder({
      items: body.items,
      total: body.total,
      userId,
      customer: body.customer,
      delivery: body.delivery,
      payment: body.payment,
      comment: body.comment,
      promoCode: body.promoCode,
      discount: totalDiscount,
      loyaltyDiscount,
    })

    if (body.promoCode && promoDiscount > 0) await incrementPromoCodeUsage(body.promoCode)

    // Если оплата картой — создаём платёж ЮKassa
    let paymentUrl = null
    let paymentId = null

    if (body.payment === 'card' && order) {
      try {
        // Базовый URL для returnUrl (берём из запроса)
        const url = new URL(request.url)
        const baseUrl = `${url.protocol}//${url.host}`
        const returnUrl = `${baseUrl}/track-order?order=${order.orderNumber}`

        const yookassaPayment = await createPayment({
          amount: {
            value: formatAmount(body.total),
            currency: 'RUB',
          },
          confirmation: {
            type: 'redirect',
            return_url: returnUrl,
          },
          capture: true,
          description: `Оплата заказа ${order.orderNumber}`,
          metadata: {
            order_id: order.id,
            user_id: userId || 'anonymous',
          },
          receipt: {
            customer: {
              email: body.customer.email || undefined,
              phone: body.customer.phone || undefined,
            },
            items: body.items.map((item) => ({
              description: item.name,
              quantity: String(item.quantity),
              amount: {
                value: formatAmount(item.price * item.quantity),
                currency: 'RUB',
              },
              vat_code: 2,
            })),
          },
        })

        if (yookassaPayment?.confirmation?.confirmation_url) {
          paymentUrl = yookassaPayment.confirmation.confirmation_url
          paymentId = yookassaPayment.id

          // Сохраняем информацию о платеже в БД
          await createYooKassaPayment({
            orderId: order.id,
            yookassaPaymentId: yookassaPayment.id,
            amount: body.total,
            status: yookassaPayment.status,
            paymentMethod: yookassaPayment.payment_method?.type,
            confirmationUrl: yookassaPayment.confirmation.confirmation_url,
            expiresAt: yookassaPayment.expires_at,
            metadata: { order_id: order.id },
          })

          // Меняем статус заказа на "ожидает оплаты"
          await updateOrderStatus(order.id, 'awaiting_payment')
        }
      } catch (paymentError: any) {
        console.error('Ошибка создания платежа ЮKassa:', paymentError)
        // Заказ всё равно создан, просто возвращаем без paymentUrl
      }
    }

    return NextResponse.json({
      success: true,
      order,
      paymentUrl,
      paymentId,
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка" }, { status: 500 })
  }
}
