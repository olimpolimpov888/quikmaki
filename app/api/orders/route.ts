import { NextRequest, NextResponse } from "next/server"

// In-memory order storage (replace with database in production)
const orders: Array<Record<string, unknown>> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Корзина пуста" },
        { status: 400 }
      )
    }

    if (!body.customer?.name || !body.customer?.phone) {
      return NextResponse.json(
        { error: "Укажите имя и телефон" },
        { status: 400 }
      )
    }

    if (!body.delivery?.address) {
      return NextResponse.json(
        { error: "Укажите адрес доставки" },
        { status: 400 }
      )
    }

    // Create order object
    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      items: body.items,
      total: body.total,
      customer: {
        name: body.customer.name,
        phone: body.customer.phone,
      },
      delivery: {
        city: body.delivery.city,
        address: body.delivery.address,
        apartment: body.delivery.apartment,
        time: body.delivery.time,
      },
      payment: body.payment,
      comment: body.comment || "",
      status: "pending",
      createdAt: body.createdAt || new Date().toISOString(),
    }

    // Store order (in-memory; use a database in production)
    orders.push(order)

    // Log order for demo purposes
    console.log("📦 New order received:", order.id)
    console.log("   Customer:", order.customer.name)
    console.log("   Total:", order.total, "₽")
    console.log("   Items:", order.items.length)

    // TODO: Send notification to admin (email, Telegram bot, etc.)
    // TODO: Send confirmation SMS/email to customer

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        message: "Заказ успешно оформлен",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return all orders (for admin panel; add auth check in production)
  return NextResponse.json({ orders })
}
