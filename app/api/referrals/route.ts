import { NextRequest, NextResponse } from "next/server"
import { getReferralInfo } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import type { ReferralInfo, ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Не авторизован" },
        { status: 401 }
      )
    }

    const referralInfo = await getReferralInfo(user.id)

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
