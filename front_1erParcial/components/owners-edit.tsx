"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OwnerEditFormData {
  nombre_completo: string
  telefono: string
  fecha_nacimiento: string
}

interface OwnerEditProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  ownerToEdit: {
    id_propietario: number
    id_user: number
    nombre_completo: string
    telefono: string
    fecha_nacimiento: string
  } | null
}

export function OwnersEditModal({ isOpen, onClose, onSubmit, ownerToEdit }: OwnerEditProps) {
  const [formData, setFormData] = useState<OwnerEditFormData>({
    nombre_completo: "",
    telefono: "",
    fecha_nacimiento: "",
  })

  // Variables ocultas (no mostradas en pantalla)
  const [idPropietario, setIdPropietario] = useState<number | null>(null)
  const [idUser, setIdUser] = useState<number | null>(null)

  useEffect(() => {
    if (ownerToEdit) {
      setFormData({
        nombre_completo: ownerToEdit.nombre_completo,
        telefono: ownerToEdit.telefono,
        fecha_nacimiento: ownerToEdit.fecha_nacimiento,
      })
      setIdPropietario(ownerToEdit.id_propietario)
      setIdUser(ownerToEdit.id_user)
    }
  }, [ownerToEdit])

  const handleInputChange = (field: keyof OwnerEditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedOwner = {
      id_propietario: idPropietario,
      id_user: idUser,
      ...formData,
    }

    onSubmit(updatedOwner)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Editar Propietario</CardTitle>
            <CardDescription>Modifica los datos del propietario</CardDescription>
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
              <Button type="submit">Actualizar Propietario</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}