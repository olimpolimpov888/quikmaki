export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  weight?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export const categories: Category[] = [
  { id: "1", name: "Акции", slug: "promotions" },
  { id: "2", name: "Премиум роллы", slug: "premium-rolls" },
  { id: "3", name: "Простые роллы", slug: "simple-rolls" },
  { id: "4", name: "Сеты", slug: "sets" },
  { id: "5", name: "Пицца", slug: "pizza" },
  { id: "6", name: "Супы и Вок", slug: "soups-wok" },
  { id: "7", name: "Салаты", slug: "salads" },
  { id: "8", name: "Десерты", slug: "desserts" },
  { id: "9", name: "Напитки", slug: "drinks" },
]

export const products: Product[] = [
  // Premium Rolls
  {
    id: "p1",
    name: "Филадельфия Классик",
    description: "Лосось, сливочный сыр, огурец, авокадо",
    price: 590,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    category: "premium-rolls",
    weight: "280 г"
  },
  {
    id: "p2",
    name: "Дракон с угрём",
    description: "Угорь, авокадо, сливочный сыр, соус унаги",
    price: 650,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    category: "premium-rolls",
    weight: "300 г"
  },
  {
    id: "p3",
    name: "Красный дракон",
    description: "Тунец, лосось, авокадо, икра тобико",
    price: 720,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop",
    category: "premium-rolls",
    weight: "320 г"
  },
  {
    id: "p4",
    name: "Калифорния Делюкс",
    description: "Краб, авокадо, огурец, икра масаго",
    price: 520,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop",
    category: "premium-rolls",
    weight: "260 г"
  },
  // Simple Rolls
  {
    id: "s1",
    name: "Маки с лососем",
    description: "Классический ролл с лососем",
    price: 290,
    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop",
    category: "simple-rolls",
    weight: "120 г"
  },
  {
    id: "s2",
    name: "Маки с огурцом",
    description: "Вегетарианский ролл с огурцом",
    price: 180,
    image: "https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=400&h=300&fit=crop",
    category: "simple-rolls",
    weight: "100 г"
  },
  {
    id: "s3",
    name: "Маки с тунцом",
    description: "Классический ролл с тунцом",
    price: 320,
    image: "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=300&fit=crop",
    category: "simple-rolls",
    weight: "120 г"
  },
  // Sets
  {
    id: "set1",
    name: "Сет Токио",
    description: "Филадельфия, Калифорния, Маки с лососем (24 шт)",
    price: 1290,
    image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=300&fit=crop",
    category: "sets",
    weight: "650 г"
  },
  {
    id: "set2",
    name: "Сет Семейный",
    description: "Ассорти из 32 роллов на всю семью",
    price: 1890,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    category: "sets",
    weight: "900 г"
  },
  {
    id: "set3",
    name: "Сет Премиум",
    description: "Дракон, Филадельфия Делюкс, Калифорния Делюкс",
    price: 2190,
    image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=300&fit=crop",
    category: "sets",
    weight: "1000 г"
  },
  // Pizza
  {
    id: "pz1",
    name: "Маргарита",
    description: "Томатный соус, моцарелла, базилик",
    price: 490,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    category: "pizza",
    weight: "450 г"
  },
  {
    id: "pz2",
    name: "Пепперони",
    description: "Томатный соус, моцарелла, пепперони",
    price: 590,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    category: "pizza",
    weight: "500 г"
  },
  {
    id: "pz3",
    name: "Четыре сыра",
    description: "Моцарелла, пармезан, горгонзола, чеддер",
    price: 650,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    category: "pizza",
    weight: "480 г"
  },
  {
    id: "pz4",
    name: "Гавайская",
    description: "Ветчина, ананасы, моцарелла",
    price: 550,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    category: "pizza",
    weight: "520 г"
  },
  // Soups & Wok
  {
    id: "w1",
    name: "Мисо суп",
    description: "Классический японский суп с тофу и водорослями",
    price: 190,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    category: "soups-wok",
    weight: "300 мл"
  },
  {
    id: "w2",
    name: "Том Ям",
    description: "Острый тайский суп с креветками",
    price: 390,
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop",
    category: "soups-wok",
    weight: "350 мл"
  },
  {
    id: "w3",
    name: "Вок с курицей",
    description: "Лапша удон, курица, овощи, соус терияки",
    price: 420,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    category: "soups-wok",
    weight: "350 г"
  },
  // Salads
  {
    id: "sal1",
    name: "Чука салат",
    description: "Морские водоросли чука с ореховым соусом",
    price: 290,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    category: "salads",
    weight: "150 г"
  },
  {
    id: "sal2",
    name: "Салат с угрём",
    description: "Угорь, авокадо, огурец, кунжут",
    price: 450,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    category: "salads",
    weight: "200 г"
  },
  // Desserts
  {
    id: "d1",
    name: "Моти",
    description: "Японские рисовые пирожные (3 шт)",
    price: 290,
    image: "https://images.unsplash.com/photo-1631206753348-db44968fd440?w=400&h=300&fit=crop",
    category: "desserts",
    weight: "90 г"
  },
  {
    id: "d2",
    name: "Чизкейк",
    description: "Классический японский чизкейк",
    price: 250,
    image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400&h=300&fit=crop",
    category: "desserts",
    weight: "120 г"
  },
  // Drinks
  {
    id: "dr1",
    name: "Зелёный чай",
    description: "Традиционный японский зелёный чай",
    price: 150,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop",
    category: "drinks",
    weight: "400 мл"
  },
  {
    id: "dr2",
    name: "Лимонад",
    description: "Освежающий домашний лимонад",
    price: 180,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
    category: "drinks",
    weight: "400 мл"
  },
]

export const promotions = [
  {
    id: "promo1",
    title: "Подарки от шефа",
    description: "Чем больше заказ — тем лучше подарок!",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
  },
  {
    id: "promo2",
    title: "Сет дня -20%",
    description: "Каждый день новый сет со скидкой",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&h=400&fit=crop",
  },
  {
    id: "promo3",
    title: "Бесплатная доставка",
    description: "При заказе от 1000 рублей",
    image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&h=400&fit=crop",
  },
]

export const bannerSlides = [
  {
    id: "slide1",
    title: "Подарки от шефа",
    subtitle: "Чем больше заказ — тем лучше подарок!",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=500&fit=crop",
    cta: "Заказать",
  },
  {
    id: "slide2",
    title: "Новое меню пиццы",
    subtitle: "Попробуйте наши итальянские новинки",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=500&fit=crop",
    cta: "Смотреть",
  },
  {
    id: "slide3",
    title: "Скидка 15% на первый заказ",
    subtitle: "Используйте промокод FIRST15",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=1200&h=500&fit=crop",
    cta: "Заказать",
  },
]

export const cities = [
  "Екатеринбург",
  "Москва",
  "Тюмень",
]

export const deliveryZones = [
  { zone: "Екатеринбург", minOrder: 1200 },
  { zone: "Москва", minOrder: 1400 },
  { zone: "Тюмень", minOrder: 1200 },
]
