import { NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import type { LoginRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    if (!body.email || !body.password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Email и пароль обязательны" },
        { status: 400 }
      )
    }

    const user = await findUserByEmail(body.email)
    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    const hashedPassword = await hashPassword(body.password)
    if (hashedPassword !== user.hashed_password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Неверный email или пароль" },
        { status: 401 }
      )
    }

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
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Ошибка сервера при входе" },
      { status: 500 }
    )
  }
}
