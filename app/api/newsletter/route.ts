import { NextRequest, NextResponse } from "next/server"
import { subscribe } from "@/lib/db"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = await subscribe(body.email, body.name)
  return NextResponse.json(result, { status: result.success ? 201 : 409 })
}
