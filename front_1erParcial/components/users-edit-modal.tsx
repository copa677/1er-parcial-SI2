"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id_user: number
  username: string
  email: string
  tipo_user: string
  estado: "activo" | "inactivo"
}

interface UserFormData {
  username: string
  email: string
  tipo_user: string
  estado: "activo" | "inactivo"
}

interface UsersEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: User) => void
  user: User | null
}

export function UsersEditModal({ isOpen, onClose, onSubmit, user }: UsersEditModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    tipo_user: "",
    estado: "activo",
  })

  // Load user data when modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        tipo_user: user.tipo_user,
        estado: user.estado,
      })
    }
  }, [user])

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const updatedUser: User = {
      ...user,
      username: formData.username,
      email: formData.email,
      tipo_user: formData.tipo_user,
      estado: formData.estado,
    }

    onSubmit(updatedUser)
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Editar Usuario</CardTitle>
            <CardDescription>Modifica la información del usuario</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
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
              <Label htmlFor="tipo_user">Tipo de Usuario</Label>
              <Select value={formData.tipo_user} onValueChange={(value) => handleInputChange("tipo_user", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Propietario">Propietario</SelectItem>
                  <SelectItem value="Residente">Residente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: "activo" | "inactivo") => handleInputChange("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
