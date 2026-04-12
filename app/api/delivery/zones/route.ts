import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Расчёт стоимости доставки по адресу
 * GET /api/delivery/zones?cityId=xxx&address=ул.+Ленина+10
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const cityId = url.searchParams.get('cityId')
    const address = url.searchParams.get('address')

    if (!cityId) {
      return NextResponse.json(
        { success: false, message: 'Укажите cityId' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Получаем зоны для города
    const { data: zones } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('city_id', cityId)
      .order('radius_km')

    // Получаем базовую стоимость доставки города
    const { data: city } = await supabase
      .from('delivery_cities')
      .select('delivery_fee, min_order_amount')
      .eq('id', cityId)
      .single()

    if (!city) {
      return NextResponse.json(
        { success: false, message: 'Город не найден' },
        { status: 404 }
      )
    }

    let deliveryFee = city.delivery_fee
    let zoneName = 'Стандартная зона'

    // Если есть зоны и адрес — пытаемся определить зону
    // В реальном проекте здесь будет геокодинг через Яндекс.Карты API
    if (zones && zones.length > 0 && address) {
      // Пока используем ближайшую зону как fallback
      const nearestZone = zones[0]
      deliveryFee = Math.round(city.delivery_fee * Number(nearestZone.fee_multiplier))
      zoneName = nearestZone.zone_name
    }

    return NextResponse.json({
      success: true,
      data: {
        deliveryFee,
        zoneName,
        minOrderAmount: city.min_order_amount,
        zones: (zones || []).map((z: any) => ({
          id: z.id,
          name: z.zone_name,
          radiusKm: z.radius_km,
          feeMultiplier: z.fee_multiplier,
        })),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
