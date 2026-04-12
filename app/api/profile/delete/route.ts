import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Не авторизован" }, { status: 401 })
    }

    // Удаляем данные из нашей таблицы users
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Удаляем заказы пользователя
    await adminSupabase.from("orders").delete().eq("user_id", user.id)

    // Удаляем рефералы
    await adminSupabase.from("referrals").delete().eq("referrer_id", user.id)
    await adminSupabase.from("referrals").delete().eq("referred_id", user.id)

    // Удаляем отзывы
    await adminSupabase.from("reviews").delete().eq("user_id", user.id)

    // Удаляем запись из users
    await adminSupabase.from("users").delete().eq("id", user.id)

    // Удаляем аккаунт из Supabase Auth
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id)
    if (deleteError) {
      console.error("Error deleting auth user:", deleteError)
    }

    return NextResponse.json({ success: true, message: "Аккаунт удалён" })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Ошибка сервера" }, { status: 500 })
  }
}
