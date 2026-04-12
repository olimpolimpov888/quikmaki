import { NextRequest, NextResponse } from "next/server"
import { findUserByEmailRaw } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    if (!body.email || !body.password) {
      return NextResponse.json({ success: false, message: "Email и пароль обязательны" }, { status: 400 })
    }

    // Получаем данные пользователя из нашей таблицы
    const user = await findUserByEmailRaw(body.email)
    if (!user) {
      return NextResponse.json({ success: false, message: "Неверный email или пароль" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.created_at }
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка сервера" }, { status: 500 })
  }
}
