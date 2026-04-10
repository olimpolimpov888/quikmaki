// Russian translations (default)
export const ru = {
  // Header
  "header.phone": "+7 (992) 345-8944",
  "header.delivery": "Бесплатная доставка",
  "header.profile": "Профиль",
  "header.login": "Войти",
  "header.cart": "Корзина",
  "header.favorites": "Избранное",
  "header.city": "Выберите город",
  "header.selectCity": "Выберите город для расчёта доставки",

  // Hero Banner
  "hero.cta": "Заказать",
  "hero.watch": "Смотреть",

  // Menu
  "menu.search": "Поиск блюд...",
  "menu.noResults": "Ничего не найдено",
  "menu.noResultsDesc": "Попробуйте изменить запрос или выберите другую категорию",
  "menu.results": "Результаты поиска",
  "menu.inCart": "В корзине",

  // Product Card
  "product.addToCart": "В корзину",
  "product.added": "Добавлено!",
  "product.viewDetails": "Подробнее",

  // Cart
  "cart.empty": "Корзина пуста",
  "cart.emptyDesc": "Добавьте что-нибудь вкусное из меню",
  "cart.total": "Итого",
  "cart.checkout": "Оформить заказ",
  "cart.clear": "Очистить корзину",
  "cart.quantity": "Кол-во",

  // Checkout
  "checkout.contact": "Контактные данные",
  "checkout.name": "Имя",
  "checkout.phone": "Телефон",
  "checkout.email": "Email (необязательно)",
  "checkout.address": "Адрес доставки",
  "checkout.street": "Улица и дом",
  "checkout.apartment": "Квартира / подъезд",
  "checkout.time": "Время доставки",
  "checkout.asap": "Как можно скорее (~30 мин)",
  "checkout.scheduled": "К определённому времени",
  "checkout.payment": "Способ оплаты",
  "checkout.card": "Картой онлайн",
  "checkout.cash": "Наличными курьеру",
  "checkout.promo": "Промокод",
  "checkout.comment": "Комментарий к заказу",
  "checkout.commentPlaceholder": "Пожелания к заказу, код домофона и т.д.",
  "checkout.submit": "Оформить заказ",
  "checkout.cancel": "Отмена",
  "checkout.processing": "Оформление...",

  // Footer
  "footer.contacts": "Контакты",
  "footer.info": "Информация",
  "footer.about": "О компании",
  "footer.faq": "Частые вопросы",
  "footer.promotions": "Акции",
  "footer.privacy": "Конфиденциальность",
  "footer.social": "Мы в соцсетях",
  "footer.payment": "Принимаем к оплате",
  "footer.copyright": "© 2026 QuikMaki. Все права защищены.",

  // Common
  "common.back": "Назад",
  "common.close": "Закрыть",
  "common.loading": "Загрузка...",
  "common.error": "Ошибка",
  "common.save": "Сохранить",
  "common.delete": "Удалить",
  "common.edit": "Редактировать",
  "common.cancel": "Отмена",
}

export type TranslationKeys = typeof ru

// English translations
export const en: TranslationKeys = {
  "header.phone": "+7 (992) 345-8944",
  "header.delivery": "Free delivery",
  "header.profile": "Profile",
  "header.login": "Sign in",
  "header.cart": "Cart",
  "header.favorites": "Favorites",
  "header.city": "Select city",
  "header.selectCity": "Select your city for delivery calculation",

  "hero.cta": "Order now",
  "hero.watch": "View",

  "menu.search": "Search dishes...",
  "menu.noResults": "Nothing found",
  "menu.noResultsDesc": "Try changing your query or select another category",
  "menu.results": "Search results",
  "menu.inCart": "In cart",

  "product.addToCart": "Add to cart",
  "product.added": "Added!",
  "product.viewDetails": "Details",

  "cart.empty": "Cart is empty",
  "cart.emptyDesc": "Add something tasty from the menu",
  "cart.total": "Total",
  "cart.checkout": "Checkout",
  "cart.clear": "Clear cart",
  "cart.quantity": "Qty",

  "checkout.contact": "Contact information",
  "checkout.name": "Name",
  "checkout.phone": "Phone",
  "checkout.email": "Email (optional)",
  "checkout.address": "Delivery address",
  "checkout.street": "Street and house",
  "checkout.apartment": "Apartment / entrance",
  "checkout.time": "Delivery time",
  "checkout.asap": "As soon as possible (~30 min)",
  "checkout.scheduled": "At a specific time",
  "checkout.payment": "Payment method",
  "checkout.card": "Card online",
  "checkout.cash": "Cash on delivery",
  "checkout.promo": "Promo code",
  "checkout.comment": "Order comment",
  "checkout.commentPlaceholder": "Wishes, intercom code, etc.",
  "checkout.submit": "Place order",
  "checkout.cancel": "Cancel",
  "checkout.processing": "Processing...",

  "footer.contacts": "Contacts",
  "footer.info": "Information",
  "footer.about": "About us",
  "footer.faq": "FAQ",
  "footer.promotions": "Promotions",
  "footer.privacy": "Privacy Policy",
  "footer.social": "Follow us",
  "footer.payment": "We accept",
  "footer.copyright": "© 2026 QuikMaki. All rights reserved.",

  "common.back": "Back",
  "common.close": "Close",
  "common.loading": "Loading...",
  "common.error": "Error",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.cancel": "Cancel",
}

export const translations: Record<string, TranslationKeys> = {
  ru,
  en,
}

export type Locale = keyof typeof translations
