import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * Статистика для админ-панели
 * GET /api/admin/stats
 */
export async function GET(request: NextRequest) {
  try {
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Используем UTC, чтобы совпадало с Supabase TIMESTAMPTZ
    const now = new Date()
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)).toISOString()
    const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)).toISOString()

    // 1. Заказы сегодня
    const { data: todayOrders } = await adminSupabase
      .from('orders')
      .select('id, total, status')
      .gte('created_at', todayStart)
      .lt('created_at', todayEnd)

    // 2. Выручка сегодня (исключаем отмененные)
    const todayRevenue = todayOrders
      ?.filter(o => o.status !== 'cancelled' && o.status !== 'payment_cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0) || 0

    // 3. В обработке (pending + awaiting_payment + confirmed + preparing)
    const inProcess = todayOrders?.filter(o =>
      ['pending', 'awaiting_payment', 'confirmed', 'preparing'].includes(o.status)
    ).length || 0

    // 4. Доставляется
    const delivering = todayOrders?.filter(o =>
      ['delivering'].includes(o.status)
    ).length || 0

    return NextResponse.json({
      success: true,
      data: {
        ordersToday: todayOrders?.length || 0,
        revenueToday: todayRevenue,
        inProcess,
        delivering,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 })
  }
}