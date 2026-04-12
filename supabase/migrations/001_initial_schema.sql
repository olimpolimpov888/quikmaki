-- =====================================================
-- Supabase Database Schema for QuikMaki
-- Выполнить в SQL Editor Supabase Dashboard
-- =====================================================

-- -----------------------------------------------------
-- 1. Пользователи (Users)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  loyalty_points INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- Индекс для поиска по реферальному коду
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- -----------------------------------------------------
-- 2. Заказы (Orders)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_city TEXT,
  delivery_address TEXT NOT NULL,
  delivery_apartment TEXT,
  delivery_time TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'card',
  total INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  promo_code TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для заказов
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- -----------------------------------------------------
-- 3. Товары заказа (Order Items)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  image TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для товаров заказа
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- -----------------------------------------------------
-- 4. Рефералы (Referrals)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Индексы для рефералов
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);

-- -----------------------------------------------------
-- 5. Промокоды (Promo Codes)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_percent INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для поиска по коду
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- -----------------------------------------------------
-- 6. Отзывы (Reviews)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для отзывов
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- -----------------------------------------------------
-- 7. Подписчики рассылки (Newsletter Subscribers)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для поиска по email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- -----------------------------------------------------
-- RLS (Row Level Security) политики
-- -----------------------------------------------------

-- Включить RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Пользователи: каждый видит только свой профиль
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Заказы: пользователь видит только свои заказы
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_any" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_update_own" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Товары заказа: доступ через заказ
CREATE POLICY "order_items_select" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "order_items_insert" ON order_items
  FOR INSERT WITH CHECK (true);

-- Рефералы: каждый видит свои рефералы
CREATE POLICY "referrals_select_own" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "referrals_insert_any" ON referrals
  FOR INSERT WITH CHECK (true);

-- Промокоды: все могут читать, только админ может изменять
CREATE POLICY "promo_codes_select_all" ON promo_codes
  FOR SELECT USING (true);

-- Отзывы: все могут читать, авторизованные могут создавать
CREATE POLICY "reviews_select_all" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_auth" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Подписчики: все могут подписываться
CREATE POLICY "newsletter_insert_any" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- -----------------------------------------------------
-- Триггер для обновления updated_at
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удаляем старые триггеры если они существуют
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Применяем триггер к таблицам с updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- Функция для создания пользователя с реферальным кодом
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION create_user_with_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_referral_code TEXT;
BEGIN
  -- Генерация уникального реферального кода
  LOOP
    new_referral_code := 'QM' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 6));
    IF NOT EXISTS (SELECT 1 FROM users WHERE referral_code = new_referral_code) THEN
      EXIT;
    END IF;
  END LOOP;

  NEW.referral_code := new_referral_code;
  NEW.loyalty_points := COALESCE(NEW.loyalty_points, 0);
  NEW.total_spent := COALESCE(NEW.total_spent, 0);
  NEW.order_count := COALESCE(NEW.order_count, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматической генерации реферального кода
DROP TRIGGER IF EXISTS set_user_referral_code ON users;
CREATE TRIGGER set_user_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_user_with_referral_code();

-- -----------------------------------------------------
-- Функция для применения реферального кода
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION apply_referral_code_function(
  p_new_user_id UUID,
  p_referral_code TEXT
)
RETURNS JSON AS $$
DECLARE
  v_referrer_id UUID;
  v_referrer_points INTEGER;
BEGIN
  -- Находим пользователя с таким реферальным кодом
  SELECT id, loyalty_points INTO v_referrer_id, v_referrer_points
  FROM users
  WHERE referral_code = UPPER(p_referral_code);

  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Неверный реферальный код');
  END IF;

  -- Не даём применить свой же код
  IF v_referrer_id = p_new_user_id THEN
    RETURN json_build_object('success', false, 'message', 'Нельзя применить свой код');
  END IF;

  -- Создаём запись о реферале
  INSERT INTO referrals (referrer_id, referred_id, converted)
  VALUES (v_referrer_id, p_new_user_id, FALSE);

  -- Начисляем бонусы рефереру (100 баллов)
  UPDATE users
  SET loyalty_points = COALESCE(loyalty_points, 0) + 100
  WHERE id = v_referrer_id;

  RETURN json_build_object('success', true, 'message', 'Реферальный код применён!');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------
-- Начальные данные: промокоды
-- -----------------------------------------------------
INSERT INTO promo_codes (code, description, discount_percent, min_order_amount, valid_to)
VALUES
  ('FIRST15', 'Скидка 15% на первый заказ', 15, 0, NOW() + INTERVAL '90 days'),
  ('SUSHI20', 'Скидка 20% на роллы', 20, 500, NOW() + INTERVAL '60 days'),
  ('QUICKMAKI10', 'Скидка 10% на весь заказ', 10, 0, NOW() + INTERVAL '120 days')
ON CONFLICT (code) DO NOTHING;

-- -----------------------------------------------------
-- Представление для администратора (все заказы)
-- -----------------------------------------------------
CREATE OR REPLACE VIEW admin_orders AS
SELECT
  o.id,
  o.order_number,
  o.status,
  o.total,
  o.discount,
  o.promo_code,
  o.customer_name,
  o.customer_phone,
  o.customer_email,
  o.delivery_city,
  o.delivery_address,
  o.delivery_apartment,
  o.delivery_time,
  o.payment_method,
  o.comment,
  o.created_at,
  u.name AS user_name,
  u.email AS user_email
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- -----------------------------------------------------
-- Представление для статистики рефералов
-- -----------------------------------------------------
CREATE OR REPLACE VIEW referral_stats AS
SELECT
  u.id AS referrer_id,
  u.name AS referrer_name,
  u.referral_code,
  u.loyalty_points,
  COUNT(r.id) AS total_referrals,
  COUNT(CASE WHEN r.converted THEN 1 END) AS successful_referrals,
  COALESCE(SUM(o.total), 0) AS referred_total_spent
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
LEFT JOIN orders o ON r.referred_id = o.user_id
GROUP BY u.id, u.name, u.referral_code, u.loyalty_points;
