-- =====================================================
-- Диагностика: проверить что есть в БД
-- =====================================================

-- 1. Сколько категорий?
SELECT count(*) as category_count FROM categories;

-- 2. Список категорий
SELECT id, name, slug FROM categories ORDER BY sort_order;

-- 3. Сколько товаров?
SELECT count(*) as product_count FROM products;

-- 4. Все товары (упрощённо)
SELECT id, name, price, category_id, is_available FROM products ORDER BY sort_order;

-- 5. Проверить связи: товары с категориями
SELECT p.id, p.name, p.price, c.slug as category_slug, c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.sort_order;
