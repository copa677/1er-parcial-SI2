"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ✅ Importamos tu servicio
import { listarNombresAnfitriones } from "@/lib/Services/usuarios.service"

interface PetFormData {
  nombre: string
  especie: string
  raza: string
  descripcion: string
  fecha_nacimiento: string
  sexo: "Macho" | "Hembra" | ""
  dueno: string
}

interface Pet {
  id_mascota: number
  nombre: string
  especie: string
  raza: string
  descripcion: string
  fecha_nacimiento: string
  sexo: "Macho" | "Hembra"
  dueno: string
}

interface PetsRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingPet?: Pet | null
}

export function PetsRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  editingPet,
}: PetsRegistrationModalProps) {
  const [formData, setFormData] = useState<PetFormData>({
    nombre: "",
    especie: "",
    raza: "",
    descripcion: "",
    fecha_nacimiento: "",
    sexo: "",
    dueno: "",
  })

  // 🔹 Lista de anfitriones para el combo
  const [anfitriones, setAnfitriones] = useState<{ nombre_completo: string }[]>([])

  useEffect(() => {
    async function fetchAnfitriones() {
      try {
        const data = await listarNombresAnfitriones()
        setAnfitriones(data)
      } catch (error) {
        console.error("Error cargando anfitriones:", error)
      }
    }
    if (isOpen) fetchAnfitriones()
  }, [isOpen])

  // 🔹 Cuando editas
  useEffect(() => {
    if (editingPet) {
      setFormData({
        nombre: editingPet.nombre,
        especie: editingPet.especie,
        raza: editingPet.raza,
        descripcion: editingPet.descripcion,
        fecha_nacimiento: editingPet.fecha_nacimiento,
        sexo: editingPet.sexo,
        dueno: editingPet.dueno,
      })
    } else {
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        descripcion: "",
        fecha_nacimiento: "",
        sexo: "",
        dueno: "",
      })
    }
  }, [editingPet])

  const handleInputChange = (field: keyof PetFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.dueno) {
      alert("Debe seleccionar un dueño")
      return
    }
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingPet ? "Actualizar Mascota" : "Registro de Mascota"}</CardTitle>
            <CardDescription>
              {editingPet ? "Modifica los datos de la mascota" : "Registra una nueva mascota"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre mascota */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Mascota *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>

              {/* Dueño: ahora un ComboBox */}
              <div className="space-y-2">
                <Label htmlFor="dueno">Nombre del Dueño *</Label>
                <Select
                  value={formData.dueno}
                  onValueChange={(value) => handleInputChange("dueno", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un dueño" />
                  </SelectTrigger>
                  <SelectContent>
                    {anfitriones.map((a, idx) => (
                      <SelectItem key={idx} value={a.nombre_completo}>
                        {a.nombre_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Especie */}
              <div className="space-y-2">
                <Label htmlFor="especie">Especie *</Label>
                <Input
                  id="especie"
                  value={formData.especie}
                  onChange={(e) => handleInputChange("especie", e.target.value)}
                  required
                />
              </div>

              {/* Raza */}
              <div className="space-y-2">
                <Label htmlFor="raza">Raza *</Label>
                <Input
                  id="raza"
                  value={formData.raza}
                  onChange={(e) => handleInputChange("raza", e.target.value)}
                  required
                />
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo *</Label>
                <Select
                  value={formData.sexo}
                  onValueChange={(value) => handleInputChange("sexo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Hembra">Hembra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha de nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)}
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Describe las características de la mascota"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingPet ? "Actualizar Mascota" : "Registrar Mascota"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
