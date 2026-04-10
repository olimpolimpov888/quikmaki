"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", name: "" },
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setSubscribed(true)
        toast.success("Вы подписались на рассылку!")
        reset()
      } else {
        toast.error(result.message || "Ошибка подписки")
      }
    } catch {
      toast.error("Ошибка соединения с сервером")
    }
    setLoading(false)
  }

  if (subscribed) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Спасибо за подписку!
          </h3>
          <p className="text-muted-foreground">
            Мы будем присылать вам лучшие предложения и новости
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Подпишитесь на рассылку
          </h3>
          <p className="text-muted-foreground">
            Получайте информацию об акциях, скидках и новинках меню
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Ваше имя (необязательно)"
              {...register("name")}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Ваш email"
              {...register("email")}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <Send className="h-4 w-4" />
            {loading ? "Подписка..." : "Подписаться"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
