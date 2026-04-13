import { NextRequest, NextResponse } from "next/server"
import { getReviews, createReview } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const productId = new URL(request.url).searchParams.get("productId")
  if (!productId) return NextResponse.json({ success: false, message: "Нет ID" }, { status: 400 })

  const reviews = await getReviews(productId)
  return NextResponse.json({ success: true, data: { reviews, rating: { average: 4.5, count: reviews.length } } })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Нужно авторизоваться" }, { status: 401 })
    }

    const body = await request.json()

    // Получаем имя пользователя из БД
    const { data: userData } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()

    const review = await createReview({
      userId: user.id,
      userName: userData?.name || 'Пользователь',
      productId: body.productId,
      rating: body.rating,
      comment: body.comment,
    })

    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (error: any) {
    console.error('Create review error:', error)
    return NextResponse.json({ success: false, message: error.message || "Ошибка" }, { status: 500 })
  }
}
