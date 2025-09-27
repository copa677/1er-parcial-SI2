"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listarNombresAnfitriones } from "@/lib/Services/usuarios.service"

interface VisitorFormData {
  nombre_completo: string
  telefono: string
  fecha_visita: string
  estado: "Activo" | "Eliminado" | ""
  nombre_anfitrion: string
}

interface Visitor {
  id_visitante: number
  nombre_completo: string
  telefono: string
  fecha_agregacion: string
  fecha_visita: string
  estado: "Activo" | "Eliminado"
  nombre_anfitrion: string
}

interface VisitorsRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: VisitorFormData) => void
  editingVisitor?: Visitor | null
}

export function VisitorsRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  editingVisitor,
}: VisitorsRegistrationModalProps) {
  const [formData, setFormData] = useState<VisitorFormData>({
    nombre_completo: "",
    telefono: "",
    fecha_visita: "",
    estado: "",
    nombre_anfitrion: "",
  })
  const [anfitriones, setAnfitriones] = useState<{ nombre_completo: string }[]>([])

  useEffect(() => {
    // Cargar datos de edición
    if (editingVisitor) {
      setFormData({
        nombre_completo: editingVisitor.nombre_completo,
        telefono: editingVisitor.telefono,
        fecha_visita: editingVisitor.fecha_visita,
        estado: editingVisitor.estado,
        nombre_anfitrion: editingVisitor.nombre_anfitrion,
      })
    } else {
      setFormData({
        nombre_completo: "",
        telefono: "",
        fecha_visita: "",
        estado: "Activo",
        nombre_anfitrion: "",
      })
    }

    // Cargar anfitriones desde backend
    const fetchAnfitriones = async () => {
      try {
        const data = await listarNombresAnfitriones()
        setAnfitriones(data)
      } catch (error) {
        console.error("Error al cargar anfitriones:", error)
      }
    }

    fetchAnfitriones()
  }, [editingVisitor])


  const handleInputChange = (field: keyof VisitorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!editingVisitor) {
      setFormData({
        nombre_completo: "",
        telefono: "",
        fecha_visita: "",
        estado: "Activo",
        nombre_anfitrion: "",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingVisitor ? "Actualizar Visitante" : "Registrar Visitante"}</CardTitle>
            <CardDescription>
              {editingVisitor ? "Modifica los datos del visitante" : "Agrega un nuevo visitante al sistema"}
            </CardDescription>
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
                <Label htmlFor="fecha_visita">Fecha de Visita</Label>
                <Input
                  id="fecha_visita"
                  type="date"
                  value={formData.fecha_visita}
                  onChange={(e) => handleInputChange("fecha_visita", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange("estado", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Eliminado">Eliminado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre_anfitrion">Nombre del Anfitrión</Label>
                <Select
                  value={formData.nombre_anfitrion}
                  onValueChange={(value) => handleInputChange("nombre_anfitrion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona anfitrión" />
                  </SelectTrigger>
                  <SelectContent>
                    {anfitriones.map((a, index) => (
                      <SelectItem key={index} value={a.nombre_completo}>
                        {a.nombre_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingVisitor ? "Actualizar Visitante" : "Registrar Visitante"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
