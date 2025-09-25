"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registrarPersonal } from "@/lib/Services/usuarios.service"

interface StaffFormData {
  username: string
  password: string
  email: string
  tipo_user: string
  estado?: string
  nombre_completo: string
  telefono: string
  direccion: string
  fecha_nacimiento: string
  rol: string
}

interface StaffRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function StaffRegistrationModal({ isOpen, onClose, onSubmit }: StaffRegistrationModalProps) {
  const [formData, setFormData] = useState<StaffFormData>({
    username: "",
    password: "",
    email: "",
    tipo_user: "",
    nombre_completo: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    rol: "",
  })

  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const handleInputChange = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([role]) // Solo permitir un rol a la vez
      setFormData((prev) => ({ ...prev, rol: role }))
    } else {
      setSelectedRoles([])
      setFormData((prev) => ({ ...prev, rol: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const staffData: StaffFormData = {
      ...formData,
      tipo_user: "Personal", // fijo
    }

    onSubmit(staffData)

    // Resetear formulario
    setFormData({
      username: "",
      password: "",
      email: "",
      tipo_user: "",
      nombre_completo: "",
      telefono: "",
      direccion: "",
      fecha_nacimiento: "",
      rol: "",
    })
    setSelectedRoles([])
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Registro de Personal</CardTitle>
            <CardDescription>Registra un nuevo miembro del personal</CardDescription>
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

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Usuario</Label>
                <Input value="Personal" disabled className="bg-muted" />
              </div>

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
                <Label>Rol</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="administrador"
                      checked={selectedRoles.includes("Administrador")}
                      onCheckedChange={(checked) => handleRoleChange("Administrador", checked as boolean)}
                    />
                    <Label htmlFor="administrador">Administrador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="guardia"
                      checked={selectedRoles.includes("Guardia")}
                      onCheckedChange={(checked) => handleRoleChange("Guardia", checked as boolean)}
                    />
                    <Label htmlFor="guardia">Guardia</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Registrar Personal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
