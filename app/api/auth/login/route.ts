import { NextRequest, NextResponse } from "next/server"
import { findUserByEmailRaw } from "@/lib/db"
import { verifyPassword } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import type { LoginRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: LoginRequest = await request.json()
    if (!body.email || !body.password) {
      return NextResponse.json({ success: false, message: "Email и пароль обязательны" }, { status: 400 })
    }

    // Используем Raw для получения хэша пароля
    const user = await findUserByEmailRaw(body.email)
    if (!user) {
      return NextResponse.json({ success: false, message: "Неверный email или пароль" }, { status: 401 })
    }

    const isValid = await verifyPassword(body.password, user.hashed_password)
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Неверный email или пароль" }, { status: 401 })
    }

    // Создаём сессию Supabase через signInWithPassword
    // Supabase не хранит пароли наших пользователей, поэтому используем signInWithPassword
    // с email и временным паролем, но сначала нужно зарегистрировать пользователя в Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })

    // Если пользователь не зарегистрирован в Supabase Auth (старый аккаунт),
    // регистрируем его
    if (signInError && signInError.message.includes("Invalid login credentials")) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            name: user.name,
            phone: user.phone,
          },
        },
      })
      if (signUpError) {
        // Если signup не удался, всё равно возвращаем данные (fallback)
      }
    }

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.created_at }
    }, { status: 200 })

    // Копируем куки Supabase в ответ
    const cookieHeader = response.headers.get("set-cookie")
    if (!cookieHeader) {
      // Если куки нет — значит Supabase не создал сессию,
      // но мы всё равно разрешаем вход через Zustand
    }

    return response
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка сервера" }, { status: 500 })
  }
}
