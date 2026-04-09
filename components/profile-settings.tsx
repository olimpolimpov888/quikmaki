"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Bell,
  Moon,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Save,
} from "lucide-react"

export function ProfileSettings() {
  const { user, logout } = useAuthStore()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Notification preferences
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)
  const [notifyPush, setNotifyPush] = useState(true)
  const [notifyPromos, setNotifyPromos] = useState(true)

  const handleSaveProfile = () => {
    // TODO: Save to API
    localStorage.setItem(
      "user-profile",
      JSON.stringify({ name, email, phone })
    )
    alert("Профиль сохранён!")
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      alert("Заполните оба поля")
      return
    }
    if (newPassword.length < 6) {
      alert("Пароль должен быть минимум 6 символов")
      return
    }
    // TODO: Send to API
    setCurrentPassword("")
    setNewPassword("")
    alert("Пароль изменён!")
  }

  const handleDeleteAccount = () => {
    if (confirm("Вы уверены? Это действие необратимо!")) {
      // TODO: Send delete request
      logout()
      localStorage.clear()
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Профиль
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="settings-name"
                  type="text"
                  placeholder="Ваше имя"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="settings-email"
                  type="email"
                  placeholder="mail@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-phone">Телефон</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="settings-phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveProfile} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Сохранить
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Смена пароля
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pass">Текущий пароль</Label>
              <div className="relative">
                <Input
                  id="current-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите текущий пароль"
                  className="pr-10"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-pass">Новый пароль</Label>
              <Input
                id="new-pass"
                type="password"
                placeholder="Минимум 6 символов"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
              />
            </div>

            <Button onClick={handleChangePassword}>Изменить пароль</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Уведомления
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email-уведомления</p>
                <p className="text-sm text-muted-foreground">Статус заказа, чеки</p>
              </div>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS-уведомления</p>
                <p className="text-sm text-muted-foreground">Статус доставки</p>
              </div>
              <Switch checked={notifySms} onCheckedChange={setNotifySms} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-sm text-muted-foreground">Браузерные уведомления</p>
              </div>
              <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Промо-рассылка</p>
                <p className="text-sm text-muted-foreground">Акции, скидки, новинки</p>
              </div>
              <Switch checked={notifyPromos} onCheckedChange={setNotifyPromos} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/30">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-destructive text-lg">Опасная зона</h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div>
              <p className="font-medium">Выйти из аккаунта</p>
              <p className="text-sm text-muted-foreground">
                Нужно будет войти снова
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div>
              <p className="font-medium text-destructive">Удалить аккаунт</p>
              <p className="text-sm text-muted-foreground">
                Все данные будут удалены навсегда
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
