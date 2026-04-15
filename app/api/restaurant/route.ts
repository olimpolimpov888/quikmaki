import { NextRequest, NextResponse } from 'next/server'
import { isRestaurantOpen } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const status = await isRestaurantOpen()
    const response = NextResponse.json({ success: true, data: status })
    
    // Запрещаем кэширование ответа
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    return response
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
