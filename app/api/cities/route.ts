import { NextRequest, NextResponse } from 'next/server'
import { getAllDeliveryCities, getDeliveryCity } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const name = url.searchParams.get('name')

    if (name) {
      const city = await getDeliveryCity(name)
      if (!city) {
        return NextResponse.json({ success: false, message: 'Город не найден' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: city })
    }

    const cities = await getAllDeliveryCities()
    return NextResponse.json({ success: true, data: cities })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
