import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Все заказы
    const { data: orders, error: ordersError } = await adminSupabase
      .from("orders")
      .select("id, order_number, user_id")
      .order("created_at", { ascending: false })
      .limit(5)

    // Все order_items
    const { data: items, error: itemsError } = await adminSupabase
      .from("order_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    // Заказы с order_items через join
    const { data: joined, error: joinError } = await adminSupabase
      .from("orders")
      .select("id, order_number, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(5)

    // Проверка структуры таблицы order_items
    const { data: tableInfo, error: tableError } = await adminSupabase
      .from("order_items")
      .select("*")
      .limit(1)

    return NextResponse.json({
      env: {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + '...',
      },
      ordersCount: orders?.length || 0,
      orders,
      ordersError,
      itemsCount: items?.length || 0,
      items,
      itemsError,
      joined,
      joinError,
      tableInfo,
      tableError,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
