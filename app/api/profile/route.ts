import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateUserProfile } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone } = body

    if (!name || !phone) {
      return NextResponse.json({ success: false, message: "Имя и телефон обязательны" }, { status: 400 })
    }

    await updateUserProfile(user.id, { name, email, phone })

    return NextResponse.json({ success: true, message: "Профиль обновлён" })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка сервера" }, { status: 500 })
  }
}
