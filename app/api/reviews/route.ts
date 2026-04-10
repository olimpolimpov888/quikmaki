import { NextRequest, NextResponse } from "next/server"
import { getReviews, createReview } from "@/lib/db"

export async function GET(request: NextRequest) {
  const productId = new URL(request.url).searchParams.get("productId")
  if (!productId) return NextResponse.json({ success: false, message: "Нет ID" }, { status: 400 })
  
  const reviews = await getReviews(productId)
  return NextResponse.json({ success: true, data: { reviews, rating: { average: 4.5, count: reviews.length } } }) // Rating mock
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const review = await createReview(body)
  return NextResponse.json({ success: true, data: review }, { status: 201 })
}
