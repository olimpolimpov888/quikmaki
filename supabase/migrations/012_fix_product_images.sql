-- =====================================================
-- Миграция 012: Установка дефолтных фото для товаров без изображений
-- =====================================================

-- Устанавливаем фото для товаров, у которых image_url NULL
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop' WHERE name = 'Филадельфия Классик' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop' WHERE name = 'Дракон с угрём' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop' WHERE name = 'Красный дракон' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop' WHERE name = 'Калифорния Делюкс' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop' WHERE name = 'Маки с лососем' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=400&h=300&fit=crop' WHERE name = 'Маки с огурцом' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=300&fit=crop' WHERE name = 'Маки с тунцом' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=300&fit=crop' WHERE name = 'Сет Токио' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' WHERE name = 'Сет Семейный' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=300&fit=crop' WHERE name = 'Сет Премиум' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop' WHERE name = 'Маргарита' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' WHERE name = 'Пепперони' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' WHERE name = 'Четыре сыра' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' WHERE name = 'Гавайская' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop' WHERE name = 'Мисо суп' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop' WHERE name = 'Том Ям' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' WHERE name = 'Вок с курицей' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop' WHERE name = 'Чука салат' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop' WHERE name = 'Салат с угрём' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1631206753348-db44968fd440?w=400&h=300&fit=crop' WHERE name = 'Моти' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400&h=300&fit=crop' WHERE name = 'Чизкейк' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop' WHERE name = 'Зелёный чай' AND image_url IS NULL;
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop' WHERE name = 'Лимонад' AND image_url IS NULL;
