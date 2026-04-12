import { NextRequest, NextResponse } from "next/server"
import { getOrders, getOrderById } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id ?? null

    const url = new URL(request.url)
    const orderId = url.searchParams.get("orderId")

    if (orderId) {
      const order = await getOrderById(orderId)
      if (!order) return NextResponse.json({ success: false, message: "Не найден" }, { status: 404 })
      // Проверка, что заказ принадлежит текущему пользователю
      if (userId && order.userId && order.userId !== userId) {
        return NextResponse.json({ success: false, message: "Доступ запрещён" }, { status: 403 })
      }
      return NextResponse.json({ success: true, data: order })
    }

    // Получаем заказы текущего пользователя
    const orders = await getOrders(userId || undefined)
    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
