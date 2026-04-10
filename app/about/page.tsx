import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Award,
  Users,
  MapPin,
  Heart,
  Star,
  ChefHat,
} from "lucide-react"

const stats = [
  { icon: Clock, value: "5+", label: "лет на рынке" },
  { icon: Users, value: "50k+", label: "довольных клиентов" },
  { icon: ChefHat, value: "100+", label: "позиций в меню" },
  { icon: MapPin, value: "30", label: "минут доставка" },
  { icon: Award, value: "4.8", label: "средний рейтинг" },
  { icon: Heart, value: "98%", label: "положительных отзывов" },
]

const values = [
  {
    icon: Star,
    title: "Качество",
    description: "Мы используем только свежие ингредиенты и следуем традиционным рецептам",
  },
  {
    icon: Clock,
    title: "Скорость",
    description: "Среднее время доставки — 30 минут. Ваш заказ будет горячим и свежим",
  },
  {
    icon: Heart,
    title: "Забота",
    description: "Мы внимательны к каждой детали — от приготовления до упаковки и доставки",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-card/50">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              О компании
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              QuikMaki — доставка вкуса
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Мы доставляем не просто еду, а настоящее гастрономическое удовольствие.
              Свежие ингредиенты, традиционные рецепты и быстрая доставка — всё для вашего комфорта.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="bg-card border-border">
                    <CardContent className="p-6 text-center">
                      <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                Наша история
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                QuikMaki начался с простой идеи: люди заслуживают свежую, вкусную еду
                с быстрой доставкой. Мы открылись в 2021 году с небольшим меню из
                классических роллов и быстро расширились, добавив пиццу, вок, салаты и десерты.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Сегодня мы обслуживаем тысячи клиентов в Екатеринбурге, Москве и Тюмени.
                Наша команда поваров каждый день готовит блюда из свежих ингредиентов,
                чтобы вы могли наслаждаться настоящим вкусом японской и итальянской кухни.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 italic text-foreground text-lg">
                Наша миссия — сделать качественную еду доступной и удобной для каждого.
                <footer className="mt-2 text-sm text-muted-foreground not-italic">
                  — Александр, основатель QuikMaki
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
              Наши ценности
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="bg-card border-border">
                    <CardContent className="p-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Попробуйте сами
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Оформите первый заказ и получите скидку 15% по промокоду FIRST15
            </p>
            <a
              href="/#menu"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-semibold"
            >
              Перейти к меню
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
