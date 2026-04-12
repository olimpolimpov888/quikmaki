-- =====================================================
-- Миграция 004: ЮKassa + Города + Рабочее время + Зоны + Товары + История статусов
-- =====================================================

-- -----------------------------------------------------
-- 1. Города доставки (delivery_cities)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS delivery_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  min_order_amount INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_cities_active ON delivery_cities(is_active) WHERE is_active = TRUE;

-- -----------------------------------------------------
-- 2. Зоны доставки (delivery_zones)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES delivery_cities(id) ON DELETE CASCADE,
  zone_name TEXT NOT NULL,
  radius_km NUMERIC(5,2) NOT NULL,
  fee_multiplier NUMERIC(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_zones_city ON delivery_zones(city_id);

-- -----------------------------------------------------
-- 3. Рабочее время (working_hours)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Вс, 1=Пн, ...
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_working_hours_day ON working_hours(day_of_week);

-- -----------------------------------------------------
-- 4. Категории товаров (categories)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- -----------------------------------------------------
-- 5. Товары (products)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  weight TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_popular ON products(is_popular);

-- -----------------------------------------------------
-- 6. Модификаторы товаров (product_modifiers)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_modifiers_product ON product_modifiers(product_id);

-- -----------------------------------------------------
-- 7. Ингредиенты (ingredients)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  allergens TEXT[], -- массив аллергенов
  is_vegan BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);

-- -----------------------------------------------------
-- 8. Связь продукт-ингредиент (product_ingredients)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, ingredient_id)
);

CREATE INDEX IF NOT EXISTS idx_product_ingredients_product ON product_ingredients(product_id);

-- -----------------------------------------------------
-- 9. История статусов заказов (order_status_history)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT, -- 'system', 'admin', 'courier'
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created ON order_status_history(created_at DESC);

-- -----------------------------------------------------
-- 10. Платежи ЮKassa (yookassa_payments)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS yookassa_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  yookassa_payment_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, waiting_for_capture, succeeded, canceled
  payment_method TEXT, -- bank_card, yoo_money, etc.
  confirmation_url TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_yookassa_payments_order ON yookassa_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_yookassa_payments_yk_id ON yookassa_payments(yookassa_payment_id);
CREATE INDEX IF NOT EXISTS idx_yookassa_payments_status ON yookassa_payments(status);

-- -----------------------------------------------------
-- 11. Баннеры/акции (promotional_banners)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS promotional_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promotional_banners_active ON promotional_banners(is_active);

-- -----------------------------------------------------
-- RLS политики
-- -----------------------------------------------------

ALTER TABLE delivery_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE yookassa_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;

-- Публичные таблицы (чтение для всех)
CREATE POLICY "delivery_cities_select_all" ON delivery_cities FOR SELECT USING (true);
CREATE POLICY "working_hours_select_all" ON working_hours FOR SELECT USING (true);
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "product_modifiers_select_all" ON product_modifiers FOR SELECT USING (true);
CREATE POLICY "ingredients_select_all" ON ingredients FOR SELECT USING (true);
CREATE POLICY "product_ingredients_select_all" ON product_ingredients FOR SELECT USING (true);
CREATE POLICY "promotional_banners_select_all" ON promotional_banners FOR SELECT USING (true);

-- История статусов — пользователь видит статусы своих заказов
CREATE POLICY "order_status_history_select_own" ON order_status_history
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Платежи — пользователь видит свои платежи
CREATE POLICY "yookassa_payments_select_own" ON yookassa_payments
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Зоны доставки — публичное чтение
CREATE POLICY "delivery_zones_select_all" ON delivery_zones FOR SELECT USING (true);

-- -----------------------------------------------------
-- Триггер updated_at для products и yookassa_payments
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_yookassa_payments_updated_at ON yookassa_payments;
CREATE TRIGGER update_yookassa_payments_updated_at
  BEFORE UPDATE ON yookassa_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- Триггер: при создании заказа — запись в историю статусов
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
  VALUES (NEW.id, NULL, NEW.status, 'system');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_order_status_on_insert ON orders;
CREATE TRIGGER log_order_status_on_insert
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- -----------------------------------------------------
-- Триггер: при обновлении статуса заказа — запись в историю
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION log_order_status_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_order_status_on_update ON orders;
CREATE TRIGGER log_order_status_on_update
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_update();

-- -----------------------------------------------------
-- Начальные данные: рабочие часы (10:00 — 23:00 каждый день)
-- -----------------------------------------------------
INSERT INTO working_hours (day_of_week, open_time, close_time, break_start, break_end)
VALUES
  (0, '10:00', '23:00', NULL, NULL), -- Воскресенье
  (1, '10:00', '23:00', NULL, NULL), -- Понедельник
  (2, '10:00', '23:00', NULL, NULL), -- Вторник
  (3, '10:00', '23:00', NULL, NULL), -- Среда
  (4, '10:00', '23:00', NULL, NULL), -- Четверг
  (5, '10:00', '23:00', NULL, NULL), -- Пятница
  (6, '10:00', '23:00', NULL, NULL)  -- Суббота
ON CONFLICT (day_of_week) DO NOTHING;

-- -----------------------------------------------------
-- Начальные данные: категории товаров
-- -----------------------------------------------------
INSERT INTO categories (name, slug, sort_order, is_active)
VALUES
  ('Премиум роллы', 'premium-rolls', 1, true),
  ('Простые роллы', 'simple-rolls', 2, true),
  ('Сеты', 'sets', 3, true),
  ('Пицца', 'pizza', 4, true),
  ('Супы и Вок', 'soups-wok', 5, true),
  ('Салаты', 'salads', 6, true),
  ('Десерты', 'desserts', 7, true),
  ('Напитки', 'drinks', 8, true),
  ('Акции', 'promotions', 9, true)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------
-- Начальные данные: города доставки
-- -----------------------------------------------------
INSERT INTO delivery_cities (name, delivery_fee, min_order_amount, is_active)
VALUES
  ('Москва', 299, 800, true),
  ('Санкт-Петербург', 249, 600, true),
  ('Казань', 199, 500, true)
ON CONFLICT (name) DO NOTHING;
