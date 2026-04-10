import { NextRequest, NextResponse } from "next/server"
import { subscribeToNewsletter } from "@/lib/db"
import type { SubscribeRequest, ApiResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json()

    if (!body.email) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Email обязателен" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Неверный формат email" },
        { status: 400 }
      )
    }

    const result = await subscribeToNewsletter(body.email, body.name)

    return NextResponse.json<ApiResponse>(
      { success: result.success, message: result.message },
      { status: result.success ? 201 : 409 }
    )
  } catch (error: any) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}
