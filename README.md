# QuikMaki — Доставка роллов и пиццы 🍣🍕

Современный веб-сайт для службы доставки еды, построенный на **Next.js 16** с React 19.

## 🚀 Технологии

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Notifications**: Sonner
- **Analytics**: Vercel Analytics
- **Icons**: Lucide React

## 📁 Структура проекта

```
СушиСайт/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Главная страница
│   ├── layout.tsx           # Корневой layout
│   ├── not-found.tsx        # 404 страница
│   ├── error.tsx            # Error boundary
│   ├── sitemap.ts           # Sitemap для SEO
│   ├── api/                 # API routes
│   │   ├── auth/            # Авторизация (login, register)
│   │   ├── orders/          # Заказы
│   │   ├── reviews/         # Отзывы
│   │   ├── promo-codes/     # Промокоды
│   │   ├── newsletter/      # Подписка на рассылку
│   │   └── referrals/       # Реферальная программа
│   ├── profile/             # Личный кабинет
│   ├── favorites/           # Избранное
│   ├── track-order/         # Отслеживание заказа
│   ├── menu/[category]/[id] # Страница товара
│   ├── about/               # О компании
│   ├── faq/                 # Частые вопросы
│   ├── promotions/          # Акции
│   └── privacy/             # Политика конфиденциальности
├── components/              # React компоненты
│   ├── ui/                  # Базовые UI компоненты (shadcn/ui)
│   ├── header.tsx           # Шапка сайта
│   ├── footer.tsx           # Подвал
│   ├── product-card.tsx     # Карточка товара
│   ├── cart-drawer.tsx      # Корзина
│   ├── checkout-form.tsx    # Оформление заказа
│   └── ...
├── lib/                     # Утилиты и хранилища
│   ├── data.ts              # Данные продуктов
│   ├── cart-store.ts        # Корзина (Zustand)
│   ├── auth-store.ts        # Авторизация (Zustand)
│   ├── favorites-store.ts   # Избранное (Zustand)
│   ├── db.ts                # Имитация базы данных
│   ├── validations.ts       # Zod схемы валидации
│   ├── types.ts             # TypeScript типы
│   └── auth-utils.ts        # Утилиты авторизации
├── public/                  # Статические файлы
└── styles/                  # Глобальные стили
```

## 🛠 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен-сервера
npm run start

# Линтинг
npm run lint
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## ⚙️ Переменные окружения

Создайте файл `.env.local` на основе `.env.local.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-secret-key
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

## ✨ Функциональность

### Для клиентов
- 🛒 **Каталог товаров** — категории, поиск, детальные страницы
- ❤️ **Избранное** — сохранение любимых блюд
- 📝 **Оформление заказа** — валидация форм, промокоды
- 📦 **Отслеживание** — статус заказа в реальном времени
- 👤 **Личный кабинет** — история заказов, настройки
- ⭐ **Отзывы** — оценка и комментирование товаров
- 🎁 **Программа лояльности** — баллы, уровни, скидки
- 🔔 **Уведомления** — toast-уведомления при действиях
- 💬 **Чат поддержки** — онлайн-помощник

### Для бизнеса
- 🎯 **SEO оптимизация** — meta теги, sitemap, JSON-LD
- 📊 **Аналитика** — Vercel Analytics
- 📧 **Рассылка** — подписка на новости
- 🏷️ **Промокоды** — система скидок
- 👥 **Реферальная программа** — приглашение друзей
- 🌓 **Тёмная/светлая тема** — переключатель

## 📱 Адаптивность

Сайт полностью адаптивен и корректно отображается на:
- 📱 Мобильных устройствах
- 📱 Планшетах
- 💻 Десктопах

## 🔐 Безопасность

- Валидация всех форм через Zod схемы
- Хеширование паролей (SHA-256 + salt)
- Защита API routes
- Rate limiting (настраивается)

## 📝 API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/login` | Вход в аккаунт |
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/orders` | Создание заказа |
| GET | `/api/orders?orderId=xxx` | Получение заказа |
| GET | `/api/reviews?productId=xxx` | Отзывы товара |
| POST | `/api/reviews` | Создание отзыва |
| POST | `/api/promo-codes` | Применение промокода |
| POST | `/api/newsletter` | Подписка на рассылку |
| GET | `/api/referrals?userId=xxx` | Реферальная информация |

## 🚀 Деплой

Рекомендуемый способ деплоя — **Vercel**:

```bash
vercel
```

Или любой другой хостинг с поддержкой Node.js.

## 📄 Лицензия

MIT

---

**QuikMaki** © 2026 — Доставка свежих суши, роллов и пиццы 🍣🍕
