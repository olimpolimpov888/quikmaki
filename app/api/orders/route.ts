import { NextRequest, NextResponse } from "next/server"
import { createOrder, validatePromoCode, incrementPromoCodeUsage, getOrders } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
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

    // Создание
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

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка" }, { status: 500 })
  }
}
