import { Header } from "@/components/header"
import { AdminOrders } from "@/components/admin/admin-orders"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Админ-панель</h1>
              <p className="text-muted-foreground mt-1">Управление заказами и контентом</p>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← На сайт
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Заказов сегодня</p>
            <p className="text-2xl font-bold mt-1">—</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Выручка сегодня</p>
            <p className="text-2xl font-bold mt-1">— ₽</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">В обработке</p>
            <p className="text-2xl font-bold mt-1">—</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Доставляется</p>
            <p className="text-2xl font-bold mt-1">—</p>
          </div>
        </div>

        {/* Orders Table */}
        <AdminOrders />
      </main>
    </div>
  )
}
