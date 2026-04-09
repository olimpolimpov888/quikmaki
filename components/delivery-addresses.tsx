"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  Heart,
  Trash2,
  Check,
  Edit,
} from "lucide-react"

interface SavedAddress {
  id: string
  label: string
  address: string
  apartment: string
  icon: "home" | "work" | "favorite"
  isDefault: boolean
}

const iconMap = {
  home: Home,
  work: Briefcase,
  favorite: Heart,
}

// Demo addresses
const demoAddresses: SavedAddress[] = [
  {
    id: "1",
    label: "Дом",
    address: "ул. Ленина, д. 42",
    apartment: "кв. 15, подъезд 2, этаж 5",
    icon: "home",
    isDefault: true,
  },
  {
    id: "2",
    label: "Работа",
    address: "пр. Мира, д. 100",
    apartment: "офис 301, 3 этаж",
    icon: "work",
    isDefault: false,
  },
]

export function DeliveryAddresses() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)

  // Form state
  const [label, setLabel] = useState("")
  const [address, setAddress] = useState("")
  const [apartment, setApartment] = useState("")
  const [icon, setIcon] = useState<"home" | "work" | "favorite">("home")

  useEffect(() => {
    const stored = localStorage.getItem("saved-addresses")
    if (stored) {
      try {
        setAddresses(JSON.parse(stored))
      } catch {
        setAddresses(demoAddresses)
      }
    } else {
      setAddresses(demoAddresses)
    }
  }, [])

  const resetForm = () => {
    setLabel("")
    setAddress("")
    setApartment("")
    setIcon("home")
    setEditingAddress(null)
  }

  const handleSave = () => {
    if (!label || !address) {
      alert("Заполните название и адрес")
      return
    }

    if (editingAddress) {
      const updated = addresses.map((a) =>
        a.id === editingAddress.id
          ? { ...a, label, address, apartment, icon }
          : a
      )
      setAddresses(updated)
      localStorage.setItem("saved-addresses", JSON.stringify(updated))
    } else {
      const newAddress: SavedAddress = {
        id: Date.now().toString(),
        label,
        address,
        apartment,
        icon,
        isDefault: addresses.length === 0,
      }
      const updated = [...addresses, newAddress]
      setAddresses(updated)
      localStorage.setItem("saved-addresses", JSON.stringify(updated))
    }

    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (addr: SavedAddress) => {
    setEditingAddress(addr)
    setLabel(addr.label)
    setAddress(addr.address)
    setApartment(addr.apartment)
    setIcon(addr.icon)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id)
    setAddresses(updated)
    localStorage.setItem("saved-addresses", JSON.stringify(updated))
  }

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }))
    setAddresses(updated)
    localStorage.setItem("saved-addresses", JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg">
          Сохранённые адреса ({addresses.length})
        </h3>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить адрес
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Редактировать адрес" : "Новый адрес"}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? "Измените данные адреса"
                  : "Сохраните адрес для быстрой доставки"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Icon Selection */}
              <div className="space-y-2">
                <Label>Тип адреса</Label>
                <div className="flex gap-2">
                  {(["home", "work", "favorite"] as const).map((iconType) => {
                    const Icon = iconMap[iconType]
                    const labels = { home: "Дом", work: "Работа", favorite: "Любимое" }
                    return (
                      <button
                        key={iconType}
                        type="button"
                        onClick={() => setIcon(iconType)}
                        className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                          icon === iconType
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{labels[iconType]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addr-label">Название</Label>
                <Input
                  id="addr-label"
                  placeholder="Дом, Работа, Дача..."
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addr-address">Улица и дом</Label>
                <Input
                  id="addr-address"
                  placeholder="ул. Ленина, д. 10"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addr-apartment">Квартира / офис</Label>
                <Input
                  id="addr-apartment"
                  placeholder="кв. 42, подъезд 1"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingAddress ? "Сохранить изменения" : "Добавить адрес"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Нет сохранённых адресов</h3>
            <p className="text-muted-foreground">
              Добавьте адреса для быстрой оформления заказов
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => {
            const Icon = iconMap[addr.icon]
            return (
              <Card
                key={addr.id}
                className={`bg-card border-border transition-all ${
                  addr.isDefault ? "border-primary/50 ring-1 ring-primary/10" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        addr.isDefault
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{addr.label}</span>
                          {addr.isDefault && (
                            <Badge variant="default" className="text-xs">
                              По умолчанию
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {addr.address}
                        </p>
                        {addr.apartment && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {addr.apartment}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!addr.isDefault && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleSetDefault(addr.id)}
                          title="Сделать основным"
                        >
                          <Check className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(addr)}
                        title="Редактировать"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(addr.id)}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
