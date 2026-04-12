import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/yookassa'
import { updateYooKassaPaymentStatus, updateOrderStatus, getOrderPayment, getOrderById } from '@/lib/db'

/**
 * Проверка статуса платежа ЮKassa
 * GET /api/payments/yookassa/status?paymentId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const paymentId = url.searchParams.get('paymentId')
    const orderId = url.searchParams.get('orderId')

    if (!paymentId && !orderId) {
      return NextResponse.json(
        { success: false, message: 'Укажите paymentId или orderId' },
        { status: 400 }
      )
    }

    let ykPaymentId = paymentId

    // Если передан orderId — находим paymentId из БД
    if (orderId && !paymentId) {
      const payment = await getOrderPayment(orderId)
      if (!payment) {
        return NextResponse.json(
          { success: false, message: 'Платёж не найден' },
          { status: 404 }
        )
      }
      ykPaymentId = payment.yookassa_payment_id
    }

    // Получаем актуальный статус из ЮKassa
    const paymentInfo = await getPayment(ykPaymentId!)
    if (!paymentInfo) {
      return NextResponse.json(
        { success: false, message: 'Не удалось получить информацию о платеже' },
        { status: 500 }
      )
    }

    // Обновляем статус в БД если изменился
    if (paymentInfo.status !== 'pending') {
      await updateYooKassaPaymentStatus(ykPaymentId!, paymentInfo.status, paymentInfo.paid ? paymentInfo.created_at : undefined)

      // Обновляем статус заказа
      if (paymentInfo.status === 'succeeded') {
        const payment = await getOrderPayment(orderId || '')
        if (payment) {
          const order = await getOrderById(payment.order_id)
          if (order && order.status === 'awaiting_payment') {
            await updateOrderStatus(order.id, 'confirmed')
          }
        }
      } else if (paymentInfo.status === 'canceled') {
        const payment = await getOrderPayment(orderId || '')
        if (payment) {
          const order = await getOrderById(payment.order_id)
          if (order && order.status === 'awaiting_payment') {
            await updateOrderStatus(order.id, 'payment_cancelled')
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentInfo.id,
        status: paymentInfo.status,
        paid: paymentInfo.paid,
        amount: paymentInfo.amount.value,
        currency: paymentInfo.amount.currency,
        createdAt: paymentInfo.created_at,
        expiresAt: paymentInfo.expires_at,
      },
    })
  } catch (error: any) {
    console.error('Ошибка проверки статуса платежа:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Ошибка проверки статуса' },
      { status: 500 }
    )
  }
}
