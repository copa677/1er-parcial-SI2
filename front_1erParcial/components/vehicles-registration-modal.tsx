"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VehicleFormData {
  marca: string
  modelo: string
  placa: string
  color: string
  propietario_vehiculo: string
}

interface Vehicle {
  id_vehiculo: number
  marca: string
  modelo: string
  placa: string
  color: string
  propietario_vehiculo: string
}

interface VehiclesRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: VehicleFormData) => void
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
    propietario_vehiculo: "",
  })

  // ✅ Cargar datos al editar
  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        marca: editingVehicle.marca,
        modelo: editingVehicle.modelo,
        placa: editingVehicle.placa,
        color: editingVehicle.color,
        propietario_vehiculo: editingVehicle.propietario_vehiculo,
      })
    } else {
      // resetear si es nuevo
      setFormData({
        marca: "",
        modelo: "",
        placa: "",
        color: "",
        propietario_vehiculo: "",
      })
    }
  }, [editingVehicle])

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)

    if (!editingVehicle) {
      setFormData({
        marca: "",
        modelo: "",
        placa: "",
        color: "",
        propietario_vehiculo: "",
      })
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
              {editingVehicle ? "Modifica los datos del vehículo" : "Agrega un nuevo vehículo al sistema"}
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange("modelo", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => handleInputChange("placa", e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="propietario_vehiculo">Propietario</Label>
                <Input
                  id="propietario_vehiculo"
                  value={formData.propietario_vehiculo}
                  onChange={(e) => handleInputChange("propietario_vehiculo", e.target.value)}
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
