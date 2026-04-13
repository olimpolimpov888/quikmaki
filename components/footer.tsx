"use client"

import { Phone, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-bold text-foreground">QuikMaki</span>
              <p className="text-sm text-muted-foreground mt-1">
                Доставка роллов и пиццы
              </p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              QuikMaki — это место, где встречаются традиции японской и итальянской кухни. 
              Мы доставляем свежие суши, роллы и пиццу прямо к вашей двери.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+79505623931"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  +7 (950) 562-39-31
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@quikmaki.ru"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  info@quikmaki.ru
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Информация</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  О компании
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  Частые вопросы
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  Акции
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <Link
                  href="/oferta"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  Оферта
                </Link>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-3">Мы в соцсетях</h4>
              <a
                href="https://vk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.794 4.258 3.825 6.404c1.862 1.968 3.976 1.839 3.976 1.839h.958z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods, INN & Copyright */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-muted-foreground">Принимаем к оплате:</span>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-xs font-semibold text-muted-foreground">
                VISA
              </div>
              <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-xs font-semibold text-muted-foreground">
                MC
              </div>
              <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-xs font-semibold text-muted-foreground">
                МИР
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <p>Теплоухов Арсений Павлович | ИНН 661107552508 | Самозанятый</p>
            <p>&copy; 2026 QuikMaki. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
