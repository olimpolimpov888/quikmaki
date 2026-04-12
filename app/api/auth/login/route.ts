import { NextRequest, NextResponse } from "next/server"
import { findUserByEmailRaw } from "@/lib/db"
import { verifyPassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.email || !body.password) {
      return NextResponse.json({ success: false, message: "Email и пароль обязательны" }, { status: 400 })
    }

    // Получаем данные пользователя из нашей таблицы
    const user = await findUserByEmailRaw(body.email)
    if (!user) {
      return NextResponse.json({ success: false, message: "Неверный email или пароль" }, { status: 401 })
    }

    // Если hashed_password пустой — значит пароль хранится в Supabase Auth
    // Просто возвращаем данные пользователя, проверку пароля сделает Supabase
    if (!user.hashed_password) {
      return NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.created_at },
        skipPasswordCheck: true,
      }, { status: 200 })
    }

    // Проверяем пароль через bcrypt
    const isValid = await verifyPassword(body.password, user.hashed_password)
    if (!isValid) {
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
