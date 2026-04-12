import { NextRequest, NextResponse } from 'next/server'
import { isRestaurantOpen } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const status = await isRestaurantOpen()
    return NextResponse.json({ success: true, data: status })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
