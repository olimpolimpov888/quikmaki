import { NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import type { RegisterRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()

    if (!body.name || !body.email || !body.phone || !body.password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Все поля обязательны для заполнения" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный формат email" },
        { status: 400 }
      )
    }

    if (body.password.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Пароль должен быть минимум 6 символов" },
        { status: 400 }
      )
    }

    const phoneRegex = /^\+?[\d\s()-]{7,18}$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный формат телефона" },
        { status: 400 }
      )
    }

    const existingUser = await findUserByEmail(body.email)
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Пользователь с таким email уже существует" },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(body.password)
    const user = await createUser({
      name: body.name,
      email: body.email,
      phone: body.phone,
      hashedPassword,
    })

    return NextResponse.json<AuthResponse>(
      { 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.created_at,
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json<AuthResponse>(
      { success: false, message: error.message || "Ошибка сервера при регистрации" },
      { status: 500 }
    )
  }
}
