import { NextRequest, NextResponse } from "next/server"
import { getOrders, getOrderById } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const orderId = url.searchParams.get("orderId")

    if (orderId) {
      const order = await getOrderById(orderId)
      if (!order) return NextResponse.json({ success: false, message: "Не найден" }, { status: 404 })
      return NextResponse.json({ success: true, data: order })
    }

    // Получаем заказы текущего пользователя (userId передаётся с клиента)
    const orders = await getOrders(userId || undefined)
    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
