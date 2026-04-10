import { NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import type { LoginRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Email и пароль обязательны" },
        { status: 400 }
      )
    }

    // Find user
    const user = findUserByEmail(body.email)
    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    // Check password
    const hashedPassword = await hashPassword(body.password)
    if (hashedPassword !== user.hashedPassword) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный email или пароль" },
        { status: 401 }
      )
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
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Ошибка сервера при входе" },
      { status: 500 }
    )
  }
}
