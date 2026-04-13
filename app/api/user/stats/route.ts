import { NextRequest, NextResponse } from "next/server"
import { getUserProfileStats, findUserById } from "@/lib/db"

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ success: false, message: "Нет ID" }, { status: 400 })

  const stats = await getUserProfileStats(userId)
  if (!stats) return NextResponse.json({ success: false, message: "Пользователь не найден" }, { status: 404 })

  // Добавляем роль пользователя
  const user = await findUserById(userId)
  return NextResponse.json({
    success: true,
    data: {
      ...stats,
      role: user?.role || 'customer',
    },
  })
}
