"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AdminOrders } from "@/components/admin/admin-orders"
import { AdminProducts } from "@/components/admin/admin-products"
import Link from "next/link"

type Tab = "overview" | "orders" | "products"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    inProcess: 0,
    delivering: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Админ-панель</h1>
              <p className="text-muted-foreground mt-1">Управление заказами, товарами и контентом</p>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← На сайт
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Обзор
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Заказы
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Товары
          </button>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground">Заказов сегодня</p>
                <p className="text-2xl font-bold mt-1">
                  {loading ? "—" : stats.ordersToday}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground">Выручка сегодня</p>
                <p className="text-2xl font-bold mt-1">
                  {loading ? "—" : `${stats.revenueToday.toLocaleString("ru-RU")} ₽`}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground">В обработке</p>
                <p className="text-2xl font-bold mt-1">
                  {loading ? "—" : stats.inProcess}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground">Доставляется</p>
                <p className="text-2xl font-bold mt-1">
                  {loading ? "—" : stats.delivering}
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <AdminOrders />
          </div>
        )}

        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "products" && <AdminProducts />}
      </main>
    </div>
  )
}
