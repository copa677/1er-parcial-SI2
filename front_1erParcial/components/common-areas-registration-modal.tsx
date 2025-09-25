"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface CommonAreaFormData {
  nombre: string
  descripcion: string
  tipo_area: string
  ubicacion: string
  capacidad_maxima: number
  hora_apertura: string
  hora_cierre: string
  estado: "Activo" | "Inactivo" | "Mantenimiento" | ""
  costo_hora: number
  requiere_reserva: boolean
  tiempo_max_reserva: number
}

interface CommonArea {
  id_area: number
  nombre: string
  descripcion: string
  tipo_area: string
  ubicacion: string
  capacidad_maxima: number
  hora_apertura: string
  hora_cierre: string
  estado: "Activo" | "Inactivo" | "Mantenimiento"
  costo_hora: number
  requiere_reserva: boolean
  tiempo_max_reserva: number
  fecha_creacion: string
  fecha_actualizacion: string
}

interface CommonAreasRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingArea?: CommonArea | null
}

export function CommonAreasRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  editingArea,
}: CommonAreasRegistrationModalProps) {
  const [formData, setFormData] = useState<CommonAreaFormData>({
    nombre: "",
    descripcion: "",
    tipo_area: "",
    ubicacion: "",
    capacidad_maxima: 1,
    hora_apertura: "",
    hora_cierre: "",
    estado: "",
    costo_hora: 0,
    requiere_reserva: false,
    tiempo_max_reserva: 0,
  })

  // Load data when editing
  useEffect(() => {
    if (editingArea) {
      setFormData({
        nombre: editingArea.nombre,
        descripcion: editingArea.descripcion,
        tipo_area: editingArea.tipo_area,
        ubicacion: editingArea.ubicacion,
        capacidad_maxima: editingArea.capacidad_maxima,
        hora_apertura: editingArea.hora_apertura,
        hora_cierre: editingArea.hora_cierre,
        estado: editingArea.estado,
        costo_hora: editingArea.costo_hora,
        requiere_reserva: editingArea.requiere_reserva,
        tiempo_max_reserva: editingArea.tiempo_max_reserva,
      })
    } else {
      // Reset form for new area
      setFormData({
        nombre: "",
        descripcion: "",
        tipo_area: "",
        ubicacion: "",
        capacidad_maxima: 1,
        hora_apertura: "",
        hora_cierre: "",
        estado: "",
        costo_hora: 0,
        requiere_reserva: false,
        tiempo_max_reserva: 0,
      })
    }
  }, [editingArea])

  const handleInputChange = (field: keyof CommonAreaFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.nombre || !formData.tipo_area || !formData.ubicacion || !formData.estado) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    // Validate time logic
    if (formData.hora_apertura >= formData.hora_cierre) {
      alert("La hora de apertura debe ser anterior a la hora de cierre")
      return
    }

    // If requires reservation, must have max time
    if (formData.requiere_reserva && formData.tiempo_max_reserva <= 0) {
      alert("Si requiere reserva, debe especificar el tiempo máximo de reserva")
      return
    }

    onSubmit(formData)

    // Reset form if not editing
    if (!editingArea) {
      setFormData({
        nombre: "",
        descripcion: "",
        tipo_area: "",
        ubicacion: "",
        capacidad_maxima: 1,
        hora_apertura: "",
        hora_cierre: "",
        estado: "",
        costo_hora: 0,
        requiere_reserva: false,
        tiempo_max_reserva: 0,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingArea ? "Actualizar Area Común" : "Registro de Area Común"}</CardTitle>
            <CardDescription>
              {editingArea ? "Modifica los datos del área común" : "Registra una nueva área común"}
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
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_area">Tipo de Area *</Label>
                <Select value={formData.tipo_area} onValueChange={(value) => handleInputChange("tipo_area", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recreativa">Recreativa</SelectItem>
                    <SelectItem value="Deportiva">Deportiva</SelectItem>
                    <SelectItem value="Eventos">Eventos</SelectItem>
                    <SelectItem value="Servicios">Servicios</SelectItem>
                    <SelectItem value="Estacionamiento">Estacionamiento</SelectItem>
                    <SelectItem value="Jardines">Jardines</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Describe el área común..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                  placeholder="Ej: Planta Baja - Área Norte"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidad_maxima">Capacidad Máxima</Label>
                <Input
                  id="capacidad_maxima"
                  type="number"
                  min="1"
                  value={formData.capacidad_maxima}
                  onChange={(e) => handleInputChange("capacidad_maxima", Number.parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_apertura">Hora de Apertura</Label>
                <Input
                  id="hora_apertura"
                  type="time"
                  value={formData.hora_apertura}
                  onChange={(e) => handleInputChange("hora_apertura", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_cierre">Hora de Cierre</Label>
                <Input
                  id="hora_cierre"
                  type="time"
                  value={formData.hora_cierre}
                  onChange={(e) => handleInputChange("hora_cierre", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costo_hora">Costo por Hora (COP)</Label>
                <Input
                  id="costo_hora"
                  type="number"
                  min="0"
                  value={formData.costo_hora}
                  onChange={(e) => handleInputChange("costo_hora", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiempo_max_reserva">Tiempo Máximo de Reserva (horas)</Label>
                <Input
                  id="tiempo_max_reserva"
                  type="number"
                  min="0"
                  value={formData.tiempo_max_reserva}
                  onChange={(e) => handleInputChange("tiempo_max_reserva", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiere_reserva"
                    checked={formData.requiere_reserva}
                    onCheckedChange={(checked) => {
                      handleInputChange("requiere_reserva", checked as boolean)
                      if (!checked) {
                        handleInputChange("tiempo_max_reserva", 0)
                      }
                    }}
                  />
                  <Label htmlFor="requiere_reserva">Requiere Reserva</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{editingArea ? "Actualizar Area" : "Registrar Area"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
