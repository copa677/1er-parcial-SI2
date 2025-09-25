"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StaffEditData {
  id_personal: number
  id_user: number
  nombre_completo: string
  telefono: string
  direccion: string
  fecha_nacimiento: string
  rol: string
}

interface StaffEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: StaffEditData) => void
  staffToEdit: StaffEditData | null
}

export function StaffEditModal({ isOpen, onClose, onSubmit, staffToEdit }: StaffEditModalProps) {
  const [formData, setFormData] = useState<StaffEditData>({
    id_personal: 0,
    id_user: 0,
    nombre_completo: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    rol: "",
  })

  useEffect(() => {
    if (staffToEdit) {
      setFormData(staffToEdit)
    }
  }, [staffToEdit])

  const handleInputChange = (field: keyof StaffEditData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  if (!isOpen || !staffToEdit) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Editar Personal</CardTitle>
            <CardDescription>Modifica los datos del personal seleccionado</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo">Nombre Completo</Label>
                <Input
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <select
                  id="rol"
                  value={formData.rol}
                  onChange={(e) => handleInputChange("rol", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Guardia">Guardia</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
