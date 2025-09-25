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

interface VehicleFormData {
  marca: string
  modelo: string
  placa: string
  color: string
  estado: "Activo" | "Eliminado" | ""
  propietario_tipo: "propietario" | "residente" | "visitante" | ""
  propietario_nombre: string
}

interface Vehicle {
  id_vehiculo: number
  marca: string
  modelo: string
  placa: string
  color: string
  estado: "Activo" | "Eliminado"
  id_propietario?: number
  id_residente?: number
  id_visitante?: number
  propietario_nombre?: string
  residente_nombre?: string
  visitante_nombre?: string
}

interface VehiclesRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingVehicle?: Vehicle | null
}

export function VehiclesRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  editingVehicle,
}: VehiclesRegistrationModalProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    marca: "",
    modelo: "",
    placa: "",
    color: "",
    estado: "",
    propietario_tipo: "",
    propietario_nombre: "",
  })

  // Load data when editing
  useEffect(() => {
    if (editingVehicle) {
      let propietario_tipo: "propietario" | "residente" | "visitante" | "" = ""
      let propietario_nombre = ""

      if (editingVehicle.id_propietario) {
        propietario_tipo = "propietario"
        propietario_nombre = editingVehicle.propietario_nombre || ""
      } else if (editingVehicle.id_residente) {
        propietario_tipo = "residente"
        propietario_nombre = editingVehicle.residente_nombre || ""
      } else if (editingVehicle.id_visitante) {
        propietario_tipo = "visitante"
        propietario_nombre = editingVehicle.visitante_nombre || ""
      }

      setFormData({
        marca: editingVehicle.marca,
        modelo: editingVehicle.modelo,
        placa: editingVehicle.placa,
        color: editingVehicle.color,
        estado: editingVehicle.estado,
        propietario_tipo,
        propietario_nombre,
      })
    } else {
      // Reset form for new vehicle
      setFormData({
        marca: "",
        modelo: "",
        placa: "",
        color: "",
        estado: "Activo",
        propietario_tipo: "",
        propietario_nombre: "",
      })
    }
  }, [editingVehicle])

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that one of the three owner types is selected
    if (!formData.propietario_tipo) {
      alert("Debe seleccionar el tipo de propietario del vehículo")
      return
    }

    const vehicleData = {
      marca: formData.marca,
      modelo: formData.modelo,
      placa: formData.placa,
      color: formData.color,
      estado: formData.estado,
      // Set the appropriate ID and name based on selection
      ...(formData.propietario_tipo === "propietario"
        ? {
            id_propietario: Math.floor(Math.random() * 10) + 1,
            propietario_nombre: formData.propietario_nombre,
            id_residente: undefined,
            id_visitante: undefined,
            residente_nombre: undefined,
            visitante_nombre: undefined,
          }
        : formData.propietario_tipo === "residente"
          ? {
              id_residente: Math.floor(Math.random() * 10) + 1,
              residente_nombre: formData.propietario_nombre,
              id_propietario: undefined,
              id_visitante: undefined,
              propietario_nombre: undefined,
              visitante_nombre: undefined,
            }
          : {
              id_visitante: Math.floor(Math.random() * 10) + 1,
              visitante_nombre: formData.propietario_nombre,
              id_propietario: undefined,
              id_residente: undefined,
              propietario_nombre: undefined,
              residente_nombre: undefined,
            }),
    }

    onSubmit(vehicleData)

    // Reset form if not editing
    if (!editingVehicle) {
      setFormData({
        marca: "",
        modelo: "",
        placa: "",
        color: "",
        estado: "Activo",
        propietario_tipo: "",
        propietario_nombre: "",
      })
    }
  }

  const getOwnerTypeLabel = () => {
    switch (formData.propietario_tipo) {
      case "propietario":
        return "Propietario"
      case "residente":
        return "Residente"
      case "visitante":
        return "Visitante"
      default:
        return "propietario"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingVehicle ? "Actualizar Vehículo" : "Registro de Vehículo"}</CardTitle>
            <CardDescription>
              {editingVehicle ? "Modifica los datos del vehículo" : "Registra un nuevo vehículo"}
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
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                  placeholder="Toyota, Honda, Chevrolet..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange("modelo", e.target.value)}
                  placeholder="Corolla, Civic, Spark..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => handleInputChange("placa", e.target.value.toUpperCase())}
                  placeholder="ABC-123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Blanco, Negro, Rojo..."
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
                <Label>Tipo de Propietario</Label>
                <RadioGroup
                  value={formData.propietario_tipo}
                  onValueChange={(value) => handleInputChange("propietario_tipo", value)}
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visitante" id="visitante" />
                    <Label htmlFor="visitante">Visitante</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="propietario_nombre">Nombre Completo del {getOwnerTypeLabel()}</Label>
                <Input
                  id="propietario_nombre"
                  value={formData.propietario_nombre}
                  onChange={(e) => handleInputChange("propietario_nombre", e.target.value)}
                  placeholder={`Nombre del ${formData.propietario_tipo || "propietario"}`}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{editingVehicle ? "Actualizar Vehículo" : "Registrar Vehículo"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
