"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VehiclesRegistrationModal } from "@/components/vehicles-registration-modal"

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

export function VehiclesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id_vehiculo: 1,
      marca: "Toyota",
      modelo: "Corolla",
      placa: "ABC-123",
      color: "Blanco",
      estado: "Activo",
      id_propietario: 1,
      propietario_nombre: "Juan Pérez",
    },
    {
      id_vehiculo: 2,
      marca: "Honda",
      modelo: "Civic",
      placa: "DEF-456",
      color: "Negro",
      estado: "Activo",
      id_residente: 2,
      residente_nombre: "María García",
    },
    {
      id_vehiculo: 3,
      marca: "Chevrolet",
      modelo: "Spark",
      placa: "GHI-789",
      color: "Rojo",
      estado: "Activo",
      id_visitante: 1,
      visitante_nombre: "Carlos López",
    },
  ])

  const handleAddVehicle = (vehicleData: any) => {
    const newVehicle: Vehicle = {
      id_vehiculo: vehicles.length + 1,
      ...vehicleData,
    }
    setVehicles([...vehicles, newVehicle])
    setIsModalOpen(false)
  }

  const handleEditVehicle = (vehicleData: any) => {
    if (editingVehicle) {
      const updatedVehicles = vehicles.map((vehicle) =>
        vehicle.id_vehiculo === editingVehicle.id_vehiculo
          ? {
              ...vehicle,
              ...vehicleData,
            }
          : vehicle,
      )
      setVehicles(updatedVehicles)
      setEditingVehicle(null)
      setIsModalOpen(false)
    }
  }

  const handleDeleteVehicle = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id_vehiculo !== id))
    }
  }

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingVehicle(null)
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Activo
          </Badge>
        )
      case "Eliminado":
        return <Badge variant="destructive">Eliminado</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const getOwnerInfo = (vehicle: Vehicle) => {
    if (vehicle.id_propietario) {
      return `Propietario: ${vehicle.propietario_nombre}`
    } else if (vehicle.id_residente) {
      return `Residente: ${vehicle.residente_nombre}`
    } else if (vehicle.id_visitante) {
      return `Visitante: ${vehicle.visitante_nombre}`
    }
    return "Sin asignar"
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Vehículos</CardTitle>
              <CardDescription>Administra los vehículos del condominio</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar Vehículo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id_vehiculo}>
                    <TableCell className="font-medium">{vehicle.id_vehiculo}</TableCell>
                    <TableCell>{vehicle.marca}</TableCell>
                    <TableCell>{vehicle.modelo}</TableCell>
                    <TableCell className="font-mono">{vehicle.placa}</TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.estado)}</TableCell>
                    <TableCell className="text-sm">{getOwnerInfo(vehicle)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(vehicle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVehicle(vehicle.id_vehiculo)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <VehiclesRegistrationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
        editingVehicle={editingVehicle}
      />
    </>
  )
}
