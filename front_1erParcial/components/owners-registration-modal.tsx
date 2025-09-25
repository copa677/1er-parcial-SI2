"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OwnerFormData {
  username: string
  password: string
  email: string
  nombre_completo: string
  telefono: string
  fecha_nacimiento: string
}

interface Owner {
  id_propietario: number
  nombre_completo: string
  telefono: string
  fecha_nacimiento: string
  id_user: number
}

interface OwnersRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingOwner?: Owner | null
}

export function OwnersRegistrationModal({ isOpen, onClose, onSubmit, editingOwner }: OwnersRegistrationModalProps) {
  const [formData, setFormData] = useState<OwnerFormData>({
    username: "",
    password: "",
    email: "",
    nombre_completo: "",
    telefono: "",
    fecha_nacimiento: "",
  })

  // Load data when editing
  useEffect(() => {
    if (editingOwner) {
      setFormData({
        username: `owner_${editingOwner.id_propietario}`, // Generate username based on ID
        password: "********", // Placeholder for existing password
        email: `${editingOwner.nombre_completo.toLowerCase().replace(/\s+/g, ".")}@email.com`,
        nombre_completo: editingOwner.nombre_completo,
        telefono: editingOwner.telefono,
        fecha_nacimiento: editingOwner.fecha_nacimiento,
      })
    } else {
      // Reset form for new owner
      setFormData({
        username: "",
        password: "",
        email: "",
        nombre_completo: "",
        telefono: "",
        fecha_nacimiento: "",
      })
    }
  }, [editingOwner])

  const handleInputChange = (field: keyof OwnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const ownerData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      tipo_user: "Propietario",
      nombre_completo: formData.nombre_completo,
      telefono: formData.telefono,
      fecha_nacimiento: formData.fecha_nacimiento,
    }

    onSubmit(ownerData)

    if (!editingOwner) {
      setFormData({
        username: "",
        password: "",
        email: "",
        nombre_completo: "",
        telefono: "",
        fecha_nacimiento: "",
      })
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingOwner ? "Editar Propietario" : "Registro de Propietario"}</CardTitle>
            <CardDescription>
              {editingOwner ? "Modifica los datos del propietario" : "Registra un nuevo propietario"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Tipo de Usuario</Label>
                <Input value="Propietario" disabled className="bg-muted" />
              </div>

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
              <Button type="submit">{editingOwner ? "Actualizar Propietario" : "Registrar Propietario"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
