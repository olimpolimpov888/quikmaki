import { NextRequest, NextResponse } from "next/server"
import { getAllPromoCodes, validatePromoCode } from "@/lib/db"
import type { PromoCode, ApplyPromoCodeRequest, ApplyPromoCodeResponse, ApiResponse } from "@/lib/types"

export async function GET() {
  try {
    const promoCodes = getAllPromoCodes()
    return NextResponse.json<ApiResponse<PromoCode[]>>({
      success: true,
      data: promoCodes,
    })
  } catch (error) {
    console.error("Get promo codes error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ApplyPromoCodeRequest = await request.json()

    if (!body.code || !body.orderTotal) {
      return NextResponse.json<ApplyPromoCodeResponse>(
        { success: false, message: "Промокод и сумма заказа обязательны" },
        { status: 400 }
      )
    }

    const result = validatePromoCode(body.code, body.orderTotal)

    return NextResponse.json<ApplyPromoCodeResponse>({
      success: result.valid,
      discount: result.discount,
      message: result.message,
    })
  } catch (error) {
    console.error("Validate promo code error:", error)
    return NextResponse.json<ApplyPromoCodeResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}
