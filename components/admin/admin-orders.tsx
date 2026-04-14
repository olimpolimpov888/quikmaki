"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  customer: { name: string; phone: string; email?: string }
  delivery: { address: string; city: string | null; time: string }
  payment: string
  createdAt: string
}

const statusLabels: Record<string, string> = {
  pending: "Новый",
  awaiting_payment: "Ожидает оплаты",
  confirmed: "Подтверждён",
  preparing: "Готовится",
  delivering: "Доставляется",
  delivered: "Доставлен",
  cancelled: "Отменён",
  payment_cancelled: "Оплата отменена",
}

const statusColors: Record<string, string> = {
  pending: "bg-blue-500",
  awaiting_payment: "bg-yellow-500",
  confirmed: "bg-green-500",
  preparing: "bg-purple-500",
  delivering: "bg-orange-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
  payment_cancelled: "bg-gray-500",
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter)

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Заказы</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Заказы ({orders.length})</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№ Заказа</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Оплата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Заказов нет
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="truncate">{order.delivery.address}</p>
                      {order.delivery.city && (
                        <p className="text-xs text-muted-foreground">{order.delivery.city}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.total.toLocaleString("ru-RU")} ₽
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment === "card" ? "default" : "secondary"}>
                      {order.payment === "card" ? "Карта" : "Наличные"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || "bg-gray-500"}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), "dd.MM HH:mm", { locale: ru })}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
