import { NextRequest, NextResponse } from "next/server"
import { getOrders, getOrderById, updateOrderStatus } from "@/lib/db"
import type { Order, ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const orderId = url.searchParams.get("orderId")

    if (orderId) {
      const order = await getOrderById(orderId)
      if (!order) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: "Заказ не найден" },
          { status: 404 }
        )
      }
      return NextResponse.json<ApiResponse<Order>>({ success: true, data: order })
    }

    const orders = await getOrders(userId || undefined)
    return NextResponse.json<ApiResponse<Order[]>>({ success: true, data: orders })
  } catch (error: any) {
    console.error("Get orders error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "orderId и status обязательны" },
        { status: 400 }
      )
    }

    const order = await updateOrderStatus(orderId, status)
    if (!order) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Заказ не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<Order>>({ success: true, data: order })
  } catch (error: any) {
    console.error("Update order status error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}
