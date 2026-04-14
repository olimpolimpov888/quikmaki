"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reviewSchema, type ReviewFormData } from "@/lib/validations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, Send, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  avatar?: string
}

interface ReviewsSectionProps {
  productId: string
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [averageRating, setAverageRating] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  })

  const currentRating = watch("rating")

  useEffect(() => {
    // Fetch reviews from API
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`)
        const data = await response.json()

        if (data.success) {
          setReviews(data.data.reviews || [])
          setAverageRating(data.data.rating?.average || 0)
        } else {
          setReviews([])
          setAverageRating(0)
        }
      } catch {
        setReviews([])
        setAverageRating(0)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  const onSubmit = async (data: ReviewFormData) => {
    setSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ...data }),
      })

      const result = await response.json()

      if (result.success) {
        const newReview: Review = {
          id: result.data.id,
          userId: result.data.userId,
          userName: result.data.userName,
          rating: data.rating,
          comment: data.comment,
          createdAt: result.data.createdAt,
        }
        setReviews([newReview, ...reviews])
        toast.success("Отзыв добавлен!")
        reset()
      } else {
        toast.error(result.message || "Ошибка добавления отзыва")
      }
    } catch {
      toast.error("Ошибка соединения с сервером")
    }
    setSubmitting(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return <div className="text-muted-foreground text-center py-8">Загрузка отзывов...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold text-foreground">Отзывы</h3>
        <Badge variant="secondary" className="gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {averageRating} ({reviews.length})
        </Badge>
      </div>

      {/* Write Review */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Написать отзыв
          </h4>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Ваша оценка</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors",
                        star <= (currentRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-sm text-destructive">{errors.rating.message}</p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Расскажите о вашем опыте..."
                rows={3}
                {...register("comment")}
                disabled={submitting}
              />
              {errors.comment && (
                <p className="text-sm text-destructive">{errors.comment.message}</p>
              )}
            </div>

            <Button type="submit" className="gap-2" disabled={submitting}>
              <Send className="h-4 w-4" />
              {submitting ? "Отправка..." : "Отправить отзыв"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Отзывов пока нет</p>
            <p className="text-sm">Будьте первым — напишите отзыв об этом товаре!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{review.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
