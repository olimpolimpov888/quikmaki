import { NextRequest, NextResponse } from "next/server"
import { createOrder, validatePromoCode, incrementPromoCodeUsage } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import type { CreateOrderRequest, CreateOrderResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id ?? null

    const body: CreateOrderRequest = await request.json()
    if (!body.items || body.items.length === 0) return NextResponse.json({ success: false, message: "Корзина пуста" }, { status: 400 })
    if (!body.customer?.name || !body.customer?.phone) return NextResponse.json({ success: false, message: "Укажите имя и телефон" }, { status: 400 })
    if (!body.delivery?.address) return NextResponse.json({ success: false, message: "Укажите адрес" }, { status: 400 })

    // Проверка промокода
    let discount = 0
    let finalTotal = body.total
    if (body.promoCode) {
      const res = await validatePromoCode(body.promoCode, body.total)
      if (res.valid && res.discount) {
        discount = res.discount
        finalTotal = body.total - discount
      }
    }

    // Создание
    console.log("[DEBUG] Creating order with userId:", userId)
    const order = await createOrder({
      items: body.items,
      total: finalTotal,
      userId,
      customer: body.customer,
      delivery: body.delivery,
      payment: body.payment,
      comment: body.comment,
      promoCode: body.promoCode,
      discount,
    })
    console.log("[DEBUG] Order created:", order?.id)

    if (body.promoCode && discount > 0) await incrementPromoCodeUsage(body.promoCode)

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка" }, { status: 500 })
  }
}
