import { NextRequest, NextResponse } from "next/server"
import { createOrder, validatePromoCode, incrementPromoCodeUsage } from "@/lib/db"
import type { CreateOrderRequest, CreateOrderResponse, Order } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()

    // Validate input
    if (!body.items || body.items.length === 0) {
      return NextResponse.json<CreateOrderResponse>(
        { success: false, message: "Корзина пуста" },
        { status: 400 }
      )
    }

    if (!body.customer?.name || !body.customer?.phone) {
      return NextResponse.json<CreateOrderResponse>(
        { success: false, message: "Укажите имя и телефон" },
        { status: 400 }
      )
    }

    if (!body.delivery?.address) {
      return NextResponse.json<CreateOrderResponse>(
        { success: false, message: "Укажите адрес доставки" },
        { status: 400 }
      )
    }

    // Validate promo code if provided
    let discount = 0
    let finalTotal = body.total
    if (body.promoCode) {
      const promoResult = validatePromoCode(body.promoCode, body.total)
      if (promoResult.valid && promoResult.discount) {
        discount = promoResult.discount
        finalTotal = body.total - discount
      }
    }

    // Create order
    const order = createOrder({
      items: body.items,
      total: finalTotal,
      userId: body.customer.email, // Will be linked if user is authenticated
      customer: {
        name: body.customer.name,
        phone: body.customer.phone,
        email: body.customer.email,
      },
      delivery: body.delivery,
      payment: body.payment,
      comment: body.comment,
      promoCode: body.promoCode,
      discount: discount > 0 ? discount : undefined,
    })

    // Increment promo code usage
    if (body.promoCode && discount > 0) {
      incrementPromoCodeUsage(body.promoCode)
    }

    return NextResponse.json<CreateOrderResponse>(
      { success: true, order },
      { status: 201 }
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json<CreateOrderResponse>(
      { success: false, message: "Ошибка сервера при создании заказа" },
      { status: 500 }
    )
  }
}
