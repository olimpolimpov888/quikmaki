import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Политика конфиденциальности
        </h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              1. Общие положения
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Настоящая политика конфиденциальности определяет порядок обработки и защиты
              персональных пользователей сайта QuikMaki (далее — «Сайт»).
              Мы стремимся обеспечить защиту вашей конфиденциальности и безопасность ваших данных.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              2. Какие данные мы собираем
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Мы собираем следующие данные:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Имя и контактные данные (телефон, email)</li>
              <li>Адрес доставки</li>
              <li>История заказов</li>
              <li>Данные об использовании сайта (cookies, аналитика)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              3. Как мы используем ваши данные
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Ваши данные используются для:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Обработки и доставки заказов</li>
              <li>Связи с вами по вопросам заказа</li>
              <li>Улучшения качества обслуживания</li>
              <li>Отправки promotional-материалов (с вашего согласия)</li>
              <li>Проведения анализа и исследований</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. Защита данных
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы принимаем необходимые организационные и технические меры для защиты
              ваших персональных данных от несанкционированного доступа, утраты, изменения,
              блокирования, копирования, распространения.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. Передача данных третьим лицам
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы не передаём ваши персональные данные третьим лицам, за исключением случаев,
              предусмотренных законодательством РФ, либо для исполнения обязательств
              по доставке заказов (службы доставки).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Сайт использует файлы cookie для улучшения пользовательского опыта,
              анализа трафика и персонализации контента. Вы можете отключить cookie
              в настройках вашего браузера.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              7. Права пользователей
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Вы имеете право:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Получить информацию о том, какие данные мы храним</li>
              <li>Потребовать исправления неточных данных</li>
              <li>Потребовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              8. Контактная информация
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              По вопросам, связанным с обработкой персональных данных,
              обращайтесь: <a href="mailto:info@quikmaki.ru" className="text-primary hover:underline">info@quikmaki.ru</a>
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground mt-8 pt-6 border-t border-border">
              Последнее обновление: 10 апреля 2026 г.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
