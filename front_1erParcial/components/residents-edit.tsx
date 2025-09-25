"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ResidentEditData {
  nombre_completo: string
  telefono: string
  tipo_residente: "Inquilinos" | "Copropietarios" | ""
  fecha_nacimiento: string
}

interface Resident {
  id_residente: number
  nombre_completo: string
  telefono: string
  tipo_residente: "Inquilinos" | "Copropietarios"
  fecha_nacimiento: string
  id_user: number
  id_propietario: number
}

interface ResidentsEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Resident) => void
  residentToEdit: Resident | null
}

export function ResidentsEditModal({
  isOpen,
  onClose,
  onSubmit,
  residentToEdit,
}: ResidentsEditModalProps) {
  const [formData, setFormData] = useState<ResidentEditData>({
    nombre_completo: "",
    telefono: "",
    tipo_residente: "",
    fecha_nacimiento: "",
  })

  const [internalIds, setInternalIds] = useState({
    id_residente: 0,
    id_user: 0,
  })

  useEffect(() => {
    if (residentToEdit) {
      setFormData({
        nombre_completo: residentToEdit.nombre_completo,
        telefono: residentToEdit.telefono,
        tipo_residente: residentToEdit.tipo_residente,
        fecha_nacimiento: residentToEdit.fecha_nacimiento,
      })
      setInternalIds({
        id_residente: residentToEdit.id_residente,
        id_user: residentToEdit.id_user,
      })
    }
  }, [residentToEdit])

  const handleInputChange = (field: keyof ResidentEditData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedResident: Resident = {
      id_residente: internalIds.id_residente,
      id_user: internalIds.id_user,
      nombre_completo: formData.nombre_completo,
      telefono: formData.telefono,
      tipo_residente: formData.tipo_residente as "Inquilinos" | "Copropietarios",
      fecha_nacimiento: formData.fecha_nacimiento,
      id_propietario: residentToEdit?.id_propietario || 0,
    }

    onSubmit(updatedResident)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Editar Residente</CardTitle>
            <CardDescription>Modifica los datos del residente seleccionado</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
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

              <div className="space-y-2">
                <Label htmlFor="tipo_residente">Tipo de Residente</Label>
                <Select
                  value={formData.tipo_residente}
                  onValueChange={(value) => handleInputChange("tipo_residente", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inquilinos">Inquilinos</SelectItem>
                    <SelectItem value="Copropietarios">Copropietarios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar Residente</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}