import { NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmailRaw, applyReferralCode } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import type { RegisterRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Получаем текущего пользователя из Supabase Auth
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()

    const body: RegisterRequest = await request.json()
    if (!body.name || !body.email || !body.phone || !body.password) {
      return NextResponse.json({ success: false, message: "Все поля обязательны" }, { status: 400 })
    }

    const existing = await findUserByEmailRaw(body.email)
    if (existing) {
      return NextResponse.json({ success: false, message: "Email уже занят" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(body.password)
    const user = await createUser({ name: body.name, email: body.email, phone: body.phone, hashedPassword })

    // Применяем реферальный код если есть
    const url = new URL(request.url)
    const referralCode = url.searchParams.get("referral")
    if (referralCode && user) {
      await applyReferralCode(user.id, referralCode)
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "Ошибка создания пользователя" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt } }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка сервера" }, { status: 500 })
  }
}
