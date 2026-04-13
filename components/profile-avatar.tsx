"use client"

import { useState, useRef, useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Camera, Trash2, Upload, Loader2, ImageOff } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

// Дефолтные аватары (DiceBear)
const defaultAvatars = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zack",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lily",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Mia",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Oscar",
]

export function ProfileAvatar() {
  const { user } = useAuthStore()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загружаем аватар из БД при монтировании
  useEffect(() => {
    if (!user?.id) return

    fetch('/api/user/avatar')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatarUrl) {
          setAvatarUrl(data.avatarUrl)
        }
      })
      .catch(console.error)
  }, [user?.id])

  const getDefaultAvatar = () => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "user"}`
  }

  const handleSelectPreset = async (url: string) => {
    setUploading(true)
    try {
      // Загружаем SVG как blob и отправляем на сервер
      const response = await fetch(url)
      const blob = await response.blob()
      const file = new File([blob], "avatar.svg", { type: "image/svg+xml" })

      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setAvatarUrl(data.avatarUrl)
        toast.success("Аватар обновлён!")
        setDialogOpen(false)
      } else {
        toast.error(data.message || "Ошибка загрузки")
      }
    } catch (error) {
      toast.error("Ошибка загрузки аватара")
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверка размера
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Файл слишком большой (макс 5 МБ)")
      return
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      toast.error("Только изображения")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setAvatarUrl(data.avatarUrl)
        toast.success("Аватар обновлён!")
        setDialogOpen(false)
      } else {
        toast.error(data.message || "Ошибка загрузки")
      }
    } catch (error) {
      toast.error("Ошибка загрузки аватара")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveAvatar = async () => {
    setUploading(true)
    try {
      const res = await fetch('/api/user/avatar', {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        setAvatarUrl(null)
        toast.success("Аватар удалён")
        setDialogOpen(false)
      } else {
        toast.error(data.message || "Ошибка удаления")
      }
    } catch (error) {
      toast.error("Ошибка удаления аватара")
    } finally {
      setUploading(false)
    }
  }

  const displayUrl = avatarUrl || getDefaultAvatar()

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage
            src={displayUrl}
            alt={user?.name || "User"}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Edit Button Overlay */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Изменить аватар</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center gap-3">
                <Image
                  src={displayUrl}
                  alt="Current avatar"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  unoptimized
                />
                {avatarUrl && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить аватар
                  </Button>
                )}
              </div>

              {/* Preset Avatars */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Выберите готовый:</p>
                <div className="grid grid-cols-3 gap-3">
                  {defaultAvatars.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectPreset(url)}
                      disabled={uploading}
                      className="relative group/preset rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors disabled:opacity-50"
                    >
                      <Image
                        src={url}
                        alt={`Avatar ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-20 object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload File */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Или загрузите свой:</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Загрузить изображение
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  PNG, JPG, WEBP. Максимум 5 МБ
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Наведите на аватар чтобы изменить
      </p>
    </div>
  )
}
