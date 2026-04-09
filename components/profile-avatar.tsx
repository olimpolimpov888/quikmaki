"use client"

import { useState, useRef } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Camera, Upload, X, Check } from "lucide-react"
import Image from "next/image"

// Predefined avatar options
const avatarOptions = [
  { id: 1, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix", name: "Felix" },
  { id: 2, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka", name: "Aneka" },
  { id: 3, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Max", name: "Max" },
  { id: 4, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna", name: "Luna" },
  { id: 5, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rocky", name: "Rocky" },
  { id: 6, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo", name: "Milo" },
  { id: 7, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella", name: "Bella" },
  { id: 8, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie", name: "Charlie" },
  { id: 9, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy", name: "Daisy" },
]

export function ProfileAvatar() {
  const { user } = useAuthStore()
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentAvatar = selectedAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "user"}`

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setSelectedAvatar(result)
        localStorage.setItem("user-avatar", result)
        setAvatarDialogOpen(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePresetSelect = (url: string) => {
    setSelectedAvatar(url)
    localStorage.setItem("user-avatar", url)
    setAvatarDialogOpen(false)
  }

  const handleRemoveAvatar = () => {
    setSelectedAvatar(null)
    localStorage.removeItem("user-avatar")
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Аватар</h3>

      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
            <Image
              src={currentAvatar}
              alt="Avatar"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <button
            onClick={() => setAvatarDialogOpen(true)}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Camera className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>

        <div className="text-center">
          <p className="font-medium text-foreground">{user?.name || "Пользователь"}</p>
          <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setAvatarDialogOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Изменить аватар
        </Button>
      </div>

      {/* Avatar Selection Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Выберите аватар</DialogTitle>
            <DialogDescription>
              Выберите готовый аватар или загрузите свой
            </DialogDescription>
          </DialogHeader>

          {/* Upload from file */}
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Загрузить свой аватар
            </Button>
            {selectedAvatar && (
              <Button variant="ghost" size="icon" onClick={handleRemoveAvatar}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>

          {/* Preset Avatars */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handlePresetSelect(avatar.url)}
                onMouseEnter={() => setHoveredId(avatar.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative group/avatar aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar.url
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Image
                  src={avatar.url}
                  alt={avatar.name}
                  fill
                  className="object-cover"
                />
                {selectedAvatar === avatar.url && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                {hoveredId === avatar.id && selectedAvatar !== avatar.url && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-white bg-primary/80 px-2 py-1 rounded">
                      Выбрать
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
