import { NextRequest, NextResponse } from "next/server"
import { findUserByEmail, createUser, UserRecord } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import type { RegisterRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()

    // Validate input
    if (!body.name || !body.email || !body.phone || !body.password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Все поля обязательны для заполнения" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный формат email" },
        { status: 400 }
      )
    }

    // Password validation
    if (body.password.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Пароль должен быть минимум 6 символов" },
        { status: 400 }
      )
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s()-]{7,18}$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный формат телефона" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = findUserByEmail(body.email)
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Пользователь с таким email уже существует" },
        { status: 409 }
      )
    }

    // Create user
    const hashedPassword = await hashPassword(body.password)
    const user = createUser({
      name: body.name,
      email: body.email,
      phone: body.phone,
      hashedPassword,
    })

    // Apply referral code if provided
    const url = new URL(request.url)
    const referralCode = url.searchParams.get("referral")
    if (referralCode) {
      const { applyReferralCode } = await import("@/lib/db")
      applyReferralCode(user.id, referralCode)
    }

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    }

    return NextResponse.json<AuthResponse>(
      { success: true, user: responseUser },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Ошибка сервера при регистрации" },
      { status: 500 }
    )
  }
}
