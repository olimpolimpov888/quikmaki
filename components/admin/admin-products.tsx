"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, Plus, Trash2, Loader2, ImageOff } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  category_name: string
  weight: string
  inStock: boolean
  isPopular: boolean
  isNew: boolean
  sortOrder: number
}

interface Category {
  id: string
  name: string
  slug: string
}

export function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)

  // Форма
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    weight: "",
    inStock: true,
    isPopular: false,
    isNew: false,
    sortOrder: 0,
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products")
      const data = await res.json()
      if (data.success) setProducts(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      if (data.success) setCategories(data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const openAddDialog = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: categories[0]?.slug || "",
      weight: "",
      inStock: true,
      isPopular: false,
      isNew: false,
      sortOrder: products.length,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
      weight: product.weight || "",
      inStock: product.inStock,
      isPopular: product.isPopular,
      isNew: product.isNew,
      sortOrder: product.sortOrder,
    })
    setImagePreview(product.image || "")
    setDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Показываем превью сразу
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setUploadingImage(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await res.json()
      if (data.success) {
        setFormData({ ...formData, image: data.imageUrl })
        toast.success("Фото загружено!")
      } else {
        toast.error(data.message || "Ошибка загрузки")
        // Откатываем превью если загрузка не удалась
        setImagePreview(formData.image)
      }
    } catch (err) {
      toast.error("Ошибка загрузки фото")
      setImagePreview(formData.image)
    } finally {
      setUploadingImage(false)
      if (imageInputRef.current) {
        imageInputRef.current.value = ""
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Заполните обязательные поля")
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        sortOrder: parseInt(formData.sortOrder as any) || 0,
      }

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products"
      const method = editingProduct ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(editingProduct ? "Товар обновлён" : "Товар добавлен")
        setDialogOpen(false)
        fetchProducts()
      } else {
        toast.error(data.message || "Ошибка")
      }
    } catch (err) {
      toast.error("Ошибка сохранения")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот товар?")) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        toast.success("Товар удалён")
        fetchProducts()
      } else {
        toast.error(data.message || "Ошибка")
      }
    } catch (err) {
      toast.error("Ошибка удаления")
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Загрузка товаров...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Товары ({products.length})</h2>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить товар
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Вес</TableHead>
              <TableHead>Статусы</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Товаров пока нет
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <ImageOff className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    <div className="truncate">{product.name}</div>
                  </TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell className="font-medium">{product.price} ₽</TableCell>
                  <TableCell>{product.weight || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {product.inStock && <Badge variant="secondary" className="text-xs">В наличии</Badge>}
                      {product.isPopular && <Badge className="text-xs bg-yellow-500/20 text-yellow-600">Популярный</Badge>}
                      {product.isNew && <Badge className="text-xs bg-green-500/20 text-green-600">Новинка</Badge>}
                      {!product.inStock && <Badge variant="destructive" className="text-xs">Нет в наличии</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog для добавления/редактирования */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Редактировать товар" : "Добавить товар"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Название */}
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Филадельфия Классик"
              />
            </div>

            {/* Описание */}
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Лосось, сливочный сыр, огурец, авокадо"
                rows={3}
              />
            </div>

            {/* Цена и Вес */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Цена (₽) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="590"
                />
              </div>
              <div className="space-y-2">
                <Label>Вес</Label>
                <Input
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="280 г"
                />
              </div>
            </div>

            {/* Категория */}
            <div className="space-y-2">
              <Label>Категория *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Загрузка изображения */}
            <div className="space-y-2">
              <Label>Изображение товара</Label>
              
              {/* Превью */}
              {imagePreview && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("")
                      setFormData({ ...formData, image: "" })
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              {/* Кнопка загрузки */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full gap-2"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <ImageOff className="h-4 w-4" />
                    {imagePreview ? "Заменить фото" : "Загрузить фото"}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                PNG, JPG, WEBP. Максимум 5 МБ
              </p>
            </div>

            {/* Переключатели */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>В наличии</Label>
                <Switch
                  checked={formData.inStock}
                  onCheckedChange={(v) => setFormData({ ...formData, inStock: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Популярный</Label>
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(v) => setFormData({ ...formData, isPopular: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Новинка</Label>
                <Switch
                  checked={formData.isNew}
                  onCheckedChange={(v) => setFormData({ ...formData, isNew: v })}
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {saving ? "Сохранение..." : editingProduct ? "Сохранить" : "Добавить"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
