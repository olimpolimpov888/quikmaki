"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "Как оформить заказ?",
    answer: "Выберите блюда из меню, добавьте их в корзину, перейдите к оформлению, заполните данные и подтвердите заказ. Мы свяжемся с вами для подтверждения."
  },
  {
    question: "Какая минимальная сумма заказа?",
    answer: "Минимальная сумма заказа зависит от вашего района. Обычно это от 1200₽ до 1400₽. Проверьте условия доставки в вашем районе."
  },
  {
    question: "Сколько стоит доставка?",
    answer: "Доставка бесплатна при заказе от 1000₽. При заказе на меньшую сумму стоимость доставки рассчитывается индивидуально."
  },
  {
    question: "Как быстро доставят заказ?",
    answer: "Среднее время доставки — 30 минут. Вы можете выбрать доставку к определённому времени при оформлении."
  },
  {
    question: "Какие способы оплаты доступны?",
    answer: "Мы принимаем оплату банковскими картами онлайн, а также наличными курьеру при получении."
  },
  {
    question: "Могу ли я отменить заказ?",
    answer: "Да, вы можете отменить заказ до его подтверждения. Свяжитесь с нами по телефону +7 (950) 562-3931."
  },
  {
    question: "Есть ли у вас программа лояльности?",
    answer: "Да! За каждый заказ вы получаете бонусные баллы (5% от суммы). Баллы можно использовать для оплаты следующих заказов. Также доступны уровни с увеличенными скидками."
  },
  {
    question: "Как использовать промокод?",
    answer: "При оформлении заказа введите промокод в специальное поле и нажмите «Применить». Скидка будет учтена автоматически."
  },
  {
    question: "Работаете ли вы в праздники?",
    answer: "Мы работаем ежедневно с 10:00 до 22:00, включая праздники. Однако в некоторые праздники график может меняться — следите за информацией на сайте."
  },
  {
    question: "Можно ли заказать заранее?",
    answer: "Да, при оформлении заказа можно выбрать время доставки. Это удобно, если вы хотите, чтобы заказ приехал к определённому часу."
  },
  {
    question: "Что делать, если заказ некачественный?",
    answer: "Свяжитесь с нами незамедлительно по телефону +7 (950) 562-39-31. Мы решим проблему — заменим блюдо или вернём деньги."
  },
  {
    question: "Есть ли у вас вегетарианские блюда?",
    answer: "Да, у нас есть вегетарианские роллы, салаты и пицца. Используйте поиск или фильтры для нахождения подходящих блюд."
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Часто задаваемые вопросы
          </h1>
          <p className="text-muted-foreground text-lg">
            Ответы на самые популярные вопросы о нашей доставке
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline hover:text-primary transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-card border border-border rounded-lg text-center">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Не нашли ответ?
          </h3>
          <p className="text-muted-foreground mb-4">
            Свяжитесь с нами — мы с радостью поможем!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+79505623931"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              📞 +7 (950) 562-3931
            </a>
            <a
              href="mailto:info@quikmaki.ru"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              ✉️ Написать на почту
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
