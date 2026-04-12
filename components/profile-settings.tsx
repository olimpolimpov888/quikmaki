"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import { createBrowserClient } from "@supabase/ssr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const getSupabase = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

export function ProfileSettings() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [saving, setSaving] = useState(false)

  // Notification preferences
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)
  const [notifyPush, setNotifyPush] = useState(true)
  const [notifyPromos, setNotifyPromos] = useState(true)

  // Delete account dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleting, setDeleting] = useState(false)

  const handleSaveProfile = async () => {
    if (!name || !phone) {
      toast.error("Имя и телефон обязательны")
      return
    }

    setSaving(true)
    try {
      const supabase = getSupabase()

      // Обновляем данные в Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        email: email || undefined,
        data: { name, phone },
      })

      if (authError) {
        toast.error(authError.message)
        setSaving(false)
        return
      }

      // Обновляем данные в таблице users
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Профиль сохранён!")
        // Обновляем Zustand store
        useAuthStore.setState({
          user: { ...user!, name, email, phone },
        })
      } else {
        toast.error(result.message || "Ошибка сохранения")
      }
    } catch {
      toast.error("Ошибка соединения с сервером")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Заполните оба поля")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Пароль должен быть минимум 6 символов")
      return
    }

    // Проверка: новый пароль не должен совпадать со старым
    if (currentPassword === newPassword) {
      toast.error("Новый пароль должен отличаться от текущего")
      return
    }

    setSaving(true)
    try {
      const supabase = getSupabase()

      // Сначала проверяем текущий пароль через наш API
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email || "", password: currentPassword }),
      })

      const loginResult = await loginResponse.json()

      if (!loginResult.success) {
        toast.error("Неверный текущий пароль")
        setSaving(false)
        return
      }

      // Обновляем пароль через Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        toast.error(error.message || "Ошибка смены пароля")
      } else {
        setCurrentPassword("")
        setNewPassword("")
        toast.success("Пароль успешно изменён!")
      }
    } catch {
      toast.error("Ошибка соединения с сервером")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "УДАЛИТЬ") {
      toast.error("Введите УДАЛИТЬ для подтверждения")
      return
    }

    setDeleting(true)
    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Аккаунт удалён")
        logout()
        router.push("/")
      } else {
        toast.error(result.message || "Ошибка удаления")
      }
    } catch {
      toast.error("Ошибка соединения с сервером")
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
      setDeleteConfirm("")
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveProfile} className="w-full" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Сохранение..." : "Сохранить"}
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
                  disabled={saving}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={saving}
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
                disabled={saving}
              />
            </div>

            <Button onClick={handleChangePassword} disabled={saving || !currentPassword || !newPassword}>
              {saving ? "Изменение..." : "Изменить пароль"}
            </Button>
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
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <DialogTitle className="text-center text-destructive">Удалить аккаунт?</DialogTitle>
            <DialogDescription className="text-center">
              Это действие <strong>необратимо</strong>. Все ваши данные, заказы и бонусы будут удалены навсегда.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                Для подтверждения введите <span className="text-destructive font-bold">УДАЛИТЬ</span>
              </Label>
              <Input
                id="delete-confirm"
                type="text"
                placeholder="УДАЛИТЬ"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="text-center font-mono"
                disabled={deleting}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setDeleteConfirm("")
              }}
              disabled={deleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "УДАЛИТЬ" || deleting}
            >
              {deleting ? "Удаление..." : "Удалить аккаунт"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
