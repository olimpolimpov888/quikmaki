import { NextRequest, NextResponse } from "next/server"
import { createReview, getReviewsByProductId, getProductAverageRating } from "@/lib/db"
import type { Review, CreateReviewRequest, ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const productId = url.searchParams.get("productId")

    if (!productId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "productId обязателен" },
        { status: 400 }
      )
    }

    const reviews = getReviewsByProductId(productId)
    const rating = getProductAverageRating(productId)

    return NextResponse.json<ApiResponse<{ reviews: Review[]; rating: { average: number; count: number } }>>({
      success: true,
      data: { reviews, rating },
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateReviewRequest = await request.json()

    if (!body.productId || !body.rating || !body.comment) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Все поля обязательны" },
        { status: 400 }
      )
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Рейтинг должен быть от 1 до 5" },
        { status: 400 }
      )
    }

    const review = createReview({
      userId: "anonymous", // Will be replaced with auth
      userName: "Анонимный пользователь",
      productId: body.productId,
      rating: body.rating,
      comment: body.comment,
    })

    return NextResponse.json<ApiResponse<Review>>(
      { success: true, data: review },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    )
  }
}
