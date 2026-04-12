import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllCategories()
    return NextResponse.json({ success: true, data: categories })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
