import { NextRequest, NextResponse } from 'next/server'
import { getActiveBanners } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const banners = await getActiveBanners()
    return NextResponse.json({ success: true, data: banners })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
