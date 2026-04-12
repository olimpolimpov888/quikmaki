-- =====================================================
-- Миграция 005: Начальные данные товаров из data.ts
-- =====================================================

-- -----------------------------------------------------
-- Товары (products)
-- -----------------------------------------------------

-- Premium Rolls
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, is_popular, sort_order)
VALUES
  ('Филадельфия Классик', 'Лосось, сливочный сыр, огурец, авокадо', 590, (SELECT id FROM categories WHERE slug = 'premium-rolls'), 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop', '280 г', true, true, 1),
  ('Дракон с угрём', 'Угорь, авокадо, сливочный сыр, соус унаги', 650, (SELECT id FROM categories WHERE slug = 'premium-rolls'), 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop', '300 г', true, true, 2),
  ('Красный дракон', 'Тунец, лосось, авокадо, икра тобико', 720, (SELECT id FROM categories WHERE slug = 'premium-rolls'), 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop', '320 г', true, false, 3),
  ('Калифорния Делюкс', 'Краб, авокадо, огурец, икра масаго', 520, (SELECT id FROM categories WHERE slug = 'premium-rolls'), 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop', '260 г', true, false, 4)
ON CONFLICT DO NOTHING;

-- Simple Rolls
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, sort_order)
VALUES
  ('Маки с лососем', 'Классический ролл с лососем', 290, (SELECT id FROM categories WHERE slug = 'simple-rolls'), 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop', '120 г', true, 1),
  ('Маки с огурцом', 'Вегетарианский ролл с огурцом', 180, (SELECT id FROM categories WHERE slug = 'simple-rolls'), 'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=400&h=300&fit=crop', '100 г', true, 2),
  ('Маки с тунцом', 'Классический ролл с тунцом', 320, (SELECT id FROM categories WHERE slug = 'simple-rolls'), 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=300&fit=crop', '120 г', true, 3)
ON CONFLICT DO NOTHING;

-- Sets
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, is_popular, sort_order)
VALUES
  ('Сет Токио', 'Филадельфия, Калифорния, Маки с лососем (24 шт)', 1290, (SELECT id FROM categories WHERE slug = 'sets'), 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=300&fit=crop', '650 г', true, true, 1),
  ('Сет Семейный', 'Ассорти из 32 роллов на всю семью', 1890, (SELECT id FROM categories WHERE slug = 'sets'), 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', '900 г', true, false, 2),
  ('Сет Премиум', 'Дракон, Филадельфия Делюкс, Калифорния Делюкс', 2190, (SELECT id FROM categories WHERE slug = 'sets'), 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=300&fit=crop', '1000 г', true, true, 3)
ON CONFLICT DO NOTHING;

-- Pizza
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, sort_order)
VALUES
  ('Маргарита', 'Томатный соус, моцарелла, базилик', 490, (SELECT id FROM categories WHERE slug = 'pizza'), 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', '450 г', true, 1),
  ('Пепперони', 'Томатный соус, моцарелла, пепперони', 590, (SELECT id FROM categories WHERE slug = 'pizza'), 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', '500 г', true, 2),
  ('Четыре сыра', 'Моцарелла, пармезан, горгонзола, чеддер', 650, (SELECT id FROM categories WHERE slug = 'pizza'), 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', '480 г', true, 3),
  ('Гавайская', 'Ветчина, ананасы, моцарелла', 550, (SELECT id FROM categories WHERE slug = 'pizza'), 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', '520 г', true, 4)
ON CONFLICT DO NOTHING;

-- Soups & Wok
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, sort_order)
VALUES
  ('Мисо суп', 'Классический японский суп с тофу и водорослями', 190, (SELECT id FROM categories WHERE slug = 'soups-wok'), 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', '300 мл', true, 1),
  ('Том Ям', 'Острый тайский суп с креветками', 390, (SELECT id FROM categories WHERE slug = 'soups-wok'), 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop', '350 мл', true, 2),
  ('Вок с курицей', 'Лапша удон, курица, овощи, соус терияки', 420, (SELECT id FROM categories WHERE slug = 'soups-wok'), 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', '350 г', true, 3)
ON CONFLICT DO NOTHING;

-- Salads
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, sort_order)
VALUES
  ('Чука салат', 'Морские водоросли чука с ореховым соусом', 290, (SELECT id FROM categories WHERE slug = 'salads'), 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', '150 г', true, 1),
  ('Салат с угрём', 'Угорь, авокадо, огурец, кунжут', 450, (SELECT id FROM categories WHERE slug = 'salads'), 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', '200 г', true, 2)
ON CONFLICT DO NOTHING;

-- Desserts
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, sort_order)
VALUES
  ('Моти', 'Японские рисовые пирожные (3 шт)', 290, (SELECT id FROM categories WHERE slug = 'desserts'), 'https://images.unsplash.com/photo-1631206753348-db44968fd440?w=400&h=300&fit=crop', '90 г', true, 1),
  ('Чизкейк', 'Классический японский чизкейк', 250, (SELECT id FROM categories WHERE slug = 'desserts'), 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400&h=300&fit=crop', '120 г', true, 2)
ON CONFLICT DO NOTHING;

-- Drinks
INSERT INTO products (name, description, price, category_id, image_url, weight, is_available, sort_order)
VALUES
  ('Зелёный чай', 'Традиционный японский зелёный чай', 150, (SELECT id FROM categories WHERE slug = 'drinks'), 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop', '400 мл', true, 1),
  ('Лимонад', 'Освежающий домашний лимонад', 180, (SELECT id FROM categories WHERE slug = 'drinks'), 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop', '400 мл', true, 2)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------
-- Баннеры (promotional_banners)
-- -----------------------------------------------------
INSERT INTO promotional_banners (title, subtitle, image_url, link, is_active, sort_order)
VALUES
  ('Подарки от шефа', 'Чем больше заказ — тем лучше подарок!', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=500&fit=crop', '/#menu', true, 1),
  ('Новое меню пиццы', 'Попробуйте наши итальянские новинки', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=500&fit=crop', '/menu/pizza', true, 2),
  ('Скидка 15% на первый заказ', 'Используйте промокод FIRST15', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=1200&h=500&fit=crop', '/#menu', true, 3)
ON CONFLICT DO NOTHING;
