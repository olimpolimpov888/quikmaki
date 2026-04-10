# Настройка Supabase для QuikMaki

Полное руководство по подключению базы данных Supabase к проекту доставки роллов.

---

## 📋 Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **"Start your project"** → **"Sign in"** (GitHub/Google/email)
3. Нажмите **"New project"**
4. Заполните:
   - **Name:** `quikmaki`
   - **Database Password:** сгенерируйте надёжный пароль (сохраните!)
   - **Region:** выберите ближайший (например `Europe (Frankfurt)`)
   - **Pricing Plan:** Free (достаточно для старта)
5. Нажмите **"Create new project"** — подождите 2-3 минуты

---

## 🔑 Шаг 2: Получение API ключей

1. В панели Supabase откройте **Settings** (шестерёнка внизу слева)
2. Перейдите в **API**
3. Скопируйте значения:

| Ключ | Где найти | Пример |
|------|-----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key | `eyJhbGci...` |

⚠️ **Service Role Key** — секретный! Никогда не публикуйте на клиенте.

---

## 🔧 Шаг 3: Настройка .env

Создайте/обновите `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...ваш_anon_ключ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...ваш_secret_ключ

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# JWT (для серверных сессий)
JWT_SECRET=ваш-очень-длинный-секретный-ключ-минимум-32-символа
```

Добавьте эти же переменные в **Vercel**:
- Vercel Dashboard → ваш проект → Settings → Environment Variables
- Добавьте все 4 переменные (Production, Preview, Development)

---

## 🗄️ Шаг 4: SQL миграции

Откройте **Supabase Dashboard** → **SQL Editor** → **New query**

Скопируйте и выполните каждый скрипт по очереди:

### 4.1 Таблица пользователей

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  hashed_password TEXT NOT NULL,
  avatar_url TEXT,
  referral_code TEXT UNIQUE NOT NULL DEFAULT upper(substring(md5(random()::text) from 1 for 8)),
  referred_by TEXT,
  loyalty_points INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4.2 Таблица заказов

```sql
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0'),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Delivery
  delivery_city TEXT,
  delivery_address TEXT NOT NULL,
  delivery_apartment TEXT,
  delivery_time TEXT NOT NULL DEFAULT 'Как можно скорее',
  
  -- Payment
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'cash')),
  
  -- Order details
  total INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  promo_code TEXT,
  comment TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Order items (sub-table)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Trigger for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4.3 Таблица отзывов

```sql
-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
```

### 4.4 Таблица промокодов

```sql
-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  code TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  discount_percent INTEGER NOT NULL,
  min_order_amount INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default promo codes
INSERT INTO promo_codes (code, description, discount_percent, min_order_amount, active, valid_to) VALUES
  ('FIRST15', 'Скидка 15% на первый заказ', 15, 500, TRUE, '2026-12-31 23:59:59'),
  ('SUSHI20', 'Скидка 20% на роллы', 20, 1000, TRUE, '2026-12-31 23:59:59'),
  ('WEEKEND', 'Скидка 5% в выходные', 5, 800, TRUE, '2026-12-31 23:59:59'),
  ('DAILY20', 'Скидка 20% на сет дня', 20, 1000, TRUE, '2026-12-31 23:59:59'),
  ('COMBO2', 'Скидка 25% на комбо', 25, 1200, TRUE, '2026-12-31 23:59:59'),
  ('HAPPY10', 'Скидка 10% в счастливые часы', 10, 500, TRUE, '2026-12-31 23:59:59')
ON CONFLICT (code) DO NOTHING;
```

### 4.5 Таблица подписчиков рассылки

```sql
-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
```

### 4.6 RLS (Row Level Security) политики

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users: can read own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Orders: users can view own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Reviews: anyone can read
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Reviews: authenticated users can create
CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🧪 Шаг 5: Тестирование подключения

### 5.1 Установка Supabase клиентской библиотеки

```bash
npm install @supabase/supabase-js
```

### 5.2 Создание клиента Supabase

Создайте `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Создайте `lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component
          }
        },
      },
    }
  )
}
```

### 5.3 Тестовый запрос

Создайте `app/test-db/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TestDBPage() {
  const supabase = await createClient()
  
  // Test users table
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('count')
    .limit(1)
  
  // Test promo codes
  const { data: promos, error: promosError } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('active', true)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Тест подключения к Supabase</h1>
      
      <div className="space-y-4">
        <div className={`p-4 rounded ${usersError ? 'bg-red-100' : 'bg-green-100'}`}>
          <strong>Users table:</strong> {usersError ? `❌ ${usersError.message}` : '✅ Подключено'}
        </div>
        
        <div className={`p-4 rounded ${promosError ? 'bg-red-100' : 'bg-green-100'}`}>
          <strong>Promo codes:</strong> {promosError ? `❌ ${promosError.message}` : `✅ ${promos?.length || 0} промокодов`}
        </div>
      </div>
    </div>
  )
}
```

Запустите `npm run dev` и откройте `http://localhost:3000/test-db`

---

##  Шаг 6: Интеграция с API роутами

Пример обновления `app/api/auth/register/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hashPassword } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  // Check existing user
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', body.email)
    .single()

  if (existing) {
    return NextResponse.json(
      { success: false, message: 'Email уже занят' },
      { status: 409 }
    )
  }

  // Insert new user
  const hashedPassword = await hashPassword(body.password)
  
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      hashed_password: hashedPassword,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, user }, { status: 201 })
}
```

---

## 📊 Шаг 7: Полезные SQL запросы

```sql
-- Статистика заказов по статусам
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;

-- Топ промокодов
SELECT code, used_count 
FROM promo_codes 
ORDER BY used_count DESC;

-- Средний рейтинг по продуктам
SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count
FROM reviews
GROUP BY product_id;

-- Доход за месяц
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(total) as revenue,
  COUNT(*) as orders_count
FROM orders
WHERE status != 'cancelled'
GROUP BY month
ORDER BY month DESC;

-- Топ клиентов
SELECT 
  u.name,
  u.email,
  SUM(o.total) as total_spent,
  COUNT(o.id) as orders_count
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'delivered'
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 10;
```

---

## 🔍 Диагностика проблем

| Проблема | Решение |
|----------|---------|
| `Connection refused` | Проверьте `SUPABASE_URL` в .env |
| `Invalid API key` | Проверьте `SUPABASE_ANON_KEY` |
| `RLS policy violation` | Настройте политики в Supabase Dashboard |
| `Table doesn't exist` | Запустите SQL миграции |

---

## 📚 Полезные ссылки

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase JS Docs](https://supabase.com/docs/reference/javascript)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
