import { NextRequest, NextResponse } from "next/server"
import { getReferralInfo } from "@/lib/db"
import type { ReferralInfo, ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "userId обязателен" },
        { status: 400 }
      )
    }

    const referralInfo = getReferralInfo(userId)

    if (!referralInfo) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Пользователь не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<ReferralInfo>>({
      success: true,
      data: referralInfo,
    })
  } catch (error) {
    console.error("Get referral info error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}
