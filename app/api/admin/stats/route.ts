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

    // Получаем ВСЕ заказы без фильтрации по дате
    const { data: allOrders, error } = await adminSupabase
      .from('orders')
      .select('id, total, status, created_at')

    if (error) {
      console.error('Stats fetch error:', error)
      return NextResponse.json({
        success: false,
        message: error.message,
        data: { ordersToday: 0, revenueToday: 0, inProcess: 0, delivering: 0 }
      }, { status: 500 })
    }

    console.log('Stats - Total orders from DB:', allOrders?.length || 0)

    // Фильтруем заказы за сегодня по строковому сравнению (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0] // "2026-04-13"
    const todayOrders = (allOrders || []).filter(o => {
      if (!o.created_at) return false
      // created_at выглядит как "2026-04-13T06:57:00.000Z"
      return o.created_at.startsWith(today)
    })

    console.log('Stats - Today:', today, 'Orders today:', todayOrders.length)

    // 1. Заказы сегодня
    const ordersToday = todayOrders.length

    // 2. Выручка сегодня (исключаем отмененные)
    const revenueToday = todayOrders
      .filter(o => o.status !== 'cancelled' && o.status !== 'payment_cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)

    // 3. В обработке (pending + awaiting_payment + confirmed + preparing)
    const inProcess = todayOrders.filter(o =>
      ['pending', 'awaiting_payment', 'confirmed', 'preparing'].includes(o.status)
    ).length

    // 4. Доставляется
    const delivering = todayOrders.filter(o => o.status === 'delivering').length

    return NextResponse.json({
      success: true,
      data: {
        ordersToday,
        revenueToday,
        inProcess,
        delivering,
      },
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    return NextResponse.json({
      success: false,
      message: error.message,
      data: { ordersToday: 0, revenueToday: 0, inProcess: 0, delivering: 0 }
    }, { status: 500 })
  }
}
