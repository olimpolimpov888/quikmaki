import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Получаем заказы из БД напрямую через admin client
    const { createClient: createAdmin } = await import("@supabase/supabase-js")
    const adminSupabase = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Получаем все заказы
    const { data: allOrders, error: ordersError } = await adminSupabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    // Получаем заказы конкретного пользователя
    const { data: userOrders } = user
      ? await adminSupabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : { data: null }

    return NextResponse.json({
      authUser: user ? { id: user.id, email: user.email } : null,
      authError: authError?.message || null,
      totalOrders: allOrders?.length || 0,
      userOrders: userOrders?.length || 0,
      allOrders: allOrders || [],
      userOrdersData: userOrders || [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
