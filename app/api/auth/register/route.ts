import { NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmailRaw } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import type { RegisterRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt } }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка сервера" }, { status: 500 })
  }
}
