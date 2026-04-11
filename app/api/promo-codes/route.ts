import { NextRequest, NextResponse } from "next/server"
import { getAllPromoCodes, validatePromoCode } from "@/lib/db"

export async function GET() {
  const data = await getAllPromoCodes()
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await validatePromoCode(body.code, body.orderTotal)
    
    return NextResponse.json({ 
      success: result.valid, 
      discount: result.discount,
      message: result.message 
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
