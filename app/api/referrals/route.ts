import { NextRequest, NextResponse } from "next/server"
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

    // TODO: Реализовать getReferralInfo для Supabase
    // Пока заглушка
    return NextResponse.json<ApiResponse<ReferralInfo>>({
      success: true,
      data: {
        code: "QUICKMAKI",
        totalReferrals: 0,
        successfulReferrals: 0,
        bonusPoints: 0,
      },
    })
  } catch (error: any) {
    console.error("Get referral info error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}
