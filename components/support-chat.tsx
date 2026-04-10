"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Phone, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const quickReplies = [
  "📦 Статус заказа",
  "🕐 Время доставки",
  "💳 Способы оплаты",
  "🎁 Акции и скидки",
  "📞 Позвонить",
]

const botResponses: Record<string, string> = {
  "📦 Статус заказа": "Вы можете отследить заказ в личном кабинете. Перейдите в раздел «Заказы» и нажмите на нужный заказ для просмотра статуса.",
  "🕐 Время доставки": "Мы доставляем заказы в течение 30 минут. Работаем ежедневно с 10:00 до 22:00. При оформлении можно выбрать время доставки.",
  "💳 Способы оплаты": "Принимаем оплату банковскими картами онлайн и наличными курьеру при получении.",
  "🎁 Акции и скидки": "У нас есть программа лояльности с кэшбэком 5%! Также действуют промокоды: FIRST15 (15% на первый заказ), SUSHI20 (20% на роллы). Все акции — на странице /promotions",
  "📞 Позвонить": "Наш телефон: +7 (992) 345-8944. Работаем с 10:00 до 22:00 ежедневно.",
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Привет! 👋 Я виртуальный помощник QuikMaki. Чем могу помочь?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Bot response
    setTimeout(() => {
      const response = botResponses[text] || generateResponse(text)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors",
          isOpen
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-4 z-50 w-80 sm:w-96"
          >
            <Card className="border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-primary p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-foreground text-sm">
                      Помощник QuikMaki
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-xs text-primary-foreground/80">Онлайн</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  10:00–22:00
                </Badge>
              </div>

              {/* Messages */}
              <CardContent className="p-0">
                <div className="h-72 overflow-y-auto p-4 space-y-3 bg-muted/30">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2 max-w-[85%]",
                        msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {msg.sender === "user" ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          <Bot className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "p-2.5 rounded-lg text-sm leading-relaxed",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-card border border-border rounded-tl-none"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="bg-card border border-border rounded-lg rounded-tl-none p-3">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                          />
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                          />
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-3 py-2 border-t border-border bg-card">
                  <div className="flex flex-wrap gap-1.5">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => sendMessage(reply)}
                        className="px-2.5 py-1 rounded-full bg-secondary text-xs text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Напишите сообщение..."
                      className="flex-1 text-sm"
                      disabled={isTyping}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || isTyping}
                      className="flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Simple keyword-based response generator
function generateResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("заказ") || lower.includes("статус") || lower.includes("где")) {
    return "Отследить заказ можно в личном кабинете или на странице отслеживания. Введите номер заказа, и вы увидите текущий статус. 📦"
  }
  if (lower.includes("доставк") || lower.includes("время") || lower.includes("сколько")) {
    return "Доставляем за ~30 минут! Работаем ежедневно с 10:00 до 22:00. Бесплатная доставка от 1000₽. 🚗"
  }
  if (lower.includes("оплат") || lower.includes("карт") || lower.includes("наличн")) {
    return "Принимаем карты Visa, MC, МИР онлайн, а также наличные курьеру. 💳"
  }
  if (lower.includes("скидк") || lower.includes("промокод") || lower.includes("акци")) {
    return "Используйте FIRST15 для скидки 15% на первый заказ! Все акции смотрите на странице /promotions 🎁"
  }
  if (lower.includes("телефон") || lower.includes("позвонит") || lower.includes("связат")) {
    return "Наш телефон: +7 (992) 345-8944. Звоните с 10:00 до 22:00! 📞"
  }
  if (lower.includes("привет") || lower.includes("здравствуй") || lower.includes("добрый")) {
    return "Привет! 😊 Рад вас видеть! Чем могу помочь? Могу рассказать о доставке, оплате, акциях или статусе заказа."
  }
  if (lower.includes("спасибо") || lower.includes("благодар")) {
    return "Всегда пожалуйста! 😊 Если будут ещё вопросы — обращайтесь!"
  }

  return "Спасибо за вопрос! Я пока могу отвечать только на типовые вопросы. Для сложного вопроса позвоните нам: +7 (992) 345-8944 или напишите на info@quikmaki.ru 📧"
}
