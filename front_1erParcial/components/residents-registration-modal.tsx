"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listarNombrePropietarios } from "@/lib/Services/usuarios.service"



interface ResidentFormData {
  username: string
  password: string
  email: string
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

interface ResidentsRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingResident?: Resident | null
}

export function ResidentsRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  editingResident,
}: ResidentsRegistrationModalProps) {
  const [formData, setFormData] = useState<ResidentFormData>({
    username: "",
    password: "",
    email: "",
    nombre_completo: "",
    telefono: "",
    tipo_residente: "",
    fecha_nacimiento: "",
  })

  // Load data when editing
  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        const nombres = await listarNombrePropietarios()
        setPropietarios(nombres)
      } catch (error) {
        console.error("Error al cargar propietarios:", error)
      }
    }

    fetchPropietarios()
  }, [])


  const [propietarios, setPropietarios] = useState<string[]>([])
  const [selectedPropietario, setSelectedPropietario] = useState("")


  const handleInputChange = (field: keyof ResidentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const residentData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      tipo_user: "Residente",
      nombre_completo: formData.nombre_completo,
      telefono: formData.telefono,
      tipo_residente: formData.tipo_residente,
      fecha_nacimiento: formData.fecha_nacimiento,
      nombre_propietario: selectedPropietario, // 🔑 se envía el nombre, no el ID
    }

    onSubmit(residentData)

    // Reset
    if (!editingResident) {
      setFormData({
        username: "",
        password: "",
        email: "",
        nombre_completo: "",
        telefono: "",
        tipo_residente: "",
        fecha_nacimiento: "",
      })
      setSelectedPropietario("")
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingResident ? "Actualizar Residente" : "Registro de Residente"}</CardTitle>
            <CardDescription>
              {editingResident ? "Modifica los datos del residente" : "Registra un nuevo residente"}
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
                <Input value="Residente" disabled className="bg-muted" />
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="propietario">Propietario</Label>
              <Select
                value={selectedPropietario}
                onValueChange={setSelectedPropietario}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un propietario" />
                </SelectTrigger>
                <SelectContent>
                  {propietarios.map((nombre, index) => (
                    <SelectItem key={index} value={nombre}>
                      {nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{editingResident ? "Actualizar Residente" : "Registrar Residente"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
