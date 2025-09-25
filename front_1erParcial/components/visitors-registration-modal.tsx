"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface VisitorFormData {
  nombre_completo: string
  ci: string
  telefono: string
  correo: string
  fecha_agregacion: string
  fecha_visita: string
  estado: "Activo" | "Eliminado" | ""
  anfitrion_tipo: "propietario" | "residente" | ""
  anfitrion_nombre: string
}

interface Visitor {
  id_visitante: number
  nombre_completo: string
  ci: string
  telefono: string
  correo: string
  fecha_agregacion: string
  fecha_visita: string
  estado: "Activo" | "Eliminado"
  id_propietario?: number
  id_residente?: number
  propietario_nombre?: string
  residente_nombre?: string
}

interface VisitorsRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
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
    ci: "",
    telefono: "",
    correo: "",
    fecha_agregacion: "",
    fecha_visita: "",
    estado: "",
    anfitrion_tipo: "",
    anfitrion_nombre: "",
  })

  // Load data when editing
  useEffect(() => {
    if (editingVisitor) {
      setFormData({
        nombre_completo: editingVisitor.nombre_completo,
        ci: editingVisitor.ci,
        telefono: editingVisitor.telefono,
        correo: editingVisitor.correo,
        fecha_agregacion: editingVisitor.fecha_agregacion,
        fecha_visita: editingVisitor.fecha_visita,
        estado: editingVisitor.estado,
        anfitrion_tipo: editingVisitor.id_propietario ? "propietario" : "residente",
        anfitrion_nombre: editingVisitor.propietario_nombre || editingVisitor.residente_nombre || "",
      })
    } else {
      // Reset form for new visitor
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        nombre_completo: "",
        ci: "",
        telefono: "",
        correo: "",
        fecha_agregacion: today,
        fecha_visita: "",
        estado: "Activo",
        anfitrion_tipo: "",
        anfitrion_nombre: "",
      })
    }
  }, [editingVisitor])

  const handleInputChange = (field: keyof VisitorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that either propietario or residente is selected, but not both
    if (!formData.anfitrion_tipo) {
      alert("Debe seleccionar si el anfitrión es propietario o residente")
      return
    }

    const visitorData = {
      nombre_completo: formData.nombre_completo,
      ci: formData.ci,
      telefono: formData.telefono,
      correo: formData.correo,
      fecha_agregacion: formData.fecha_agregacion,
      fecha_visita: formData.fecha_visita,
      estado: formData.estado,
      // Set either id_propietario or id_residente based on selection
      ...(formData.anfitrion_tipo === "propietario"
        ? {
            id_propietario: Math.floor(Math.random() * 10) + 1,
            propietario_nombre: formData.anfitrion_nombre,
            id_residente: undefined,
            residente_nombre: undefined,
          }
        : {
            id_residente: Math.floor(Math.random() * 10) + 1,
            residente_nombre: formData.anfitrion_nombre,
            id_propietario: undefined,
            propietario_nombre: undefined,
          }),
    }

    onSubmit(visitorData)

    // Reset form if not editing
    if (!editingVisitor) {
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        nombre_completo: "",
        ci: "",
        telefono: "",
        correo: "",
        fecha_agregacion: today,
        fecha_visita: "",
        estado: "Activo",
        anfitrion_tipo: "",
        anfitrion_nombre: "",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingVisitor ? "Actualizar Visitante" : "Registro de Visitante"}</CardTitle>
            <CardDescription>
              {editingVisitor ? "Modifica los datos del visitante" : "Registra un nuevo visitante"}
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
                <Label htmlFor="ci">CI (Carnet de Identidad)</Label>
                <Input id="ci" value={formData.ci} onChange={(e) => handleInputChange("ci", e.target.value)} required />
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
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleInputChange("correo", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_agregacion">Fecha de Agregación</Label>
                <Input
                  id="fecha_agregacion"
                  type="date"
                  value={formData.fecha_agregacion}
                  onChange={(e) => handleInputChange("fecha_agregacion", e.target.value)}
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
                <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Eliminado">Eliminado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Tipo de Anfitrión</Label>
                <RadioGroup
                  value={formData.anfitrion_tipo}
                  onValueChange={(value) => handleInputChange("anfitrion_tipo", value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="propietario" id="propietario" />
                    <Label htmlFor="propietario">Propietario</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residente" id="residente" />
                    <Label htmlFor="residente">Residente</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="anfitrion_nombre">
                  Nombre Completo del {formData.anfitrion_tipo === "propietario" ? "Propietario" : "Residente"}
                </Label>
                <Input
                  id="anfitrion_nombre"
                  value={formData.anfitrion_nombre}
                  onChange={(e) => handleInputChange("anfitrion_nombre", e.target.value)}
                  placeholder={`Nombre del ${formData.anfitrion_tipo || "anfitrión"}`}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{editingVisitor ? "Actualizar Visitante" : "Registrar Visitante"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
