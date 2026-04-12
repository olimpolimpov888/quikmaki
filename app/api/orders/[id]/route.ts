import { NextRequest, NextResponse } from "next/server"
import { getOrders, getOrderById, updateOrderStatus } from "@/lib/db"
import { createClient as createAdminClient } from "@supabase/supabase-js"

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

export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pathParts = url.pathname.split("/")
    const orderId = pathParts[pathParts.length - 1]

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ success: false, message: "Укажите статус" }, { status: 400 })
    }

    await updateOrderStatus(orderId, status)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
