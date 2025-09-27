"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VehiclesRegistrationModal } from "@/components/vehicles-registration-modal"
import {
  getAllVehiculos,
  registrarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  Vehiculo,
} from "@/lib/Services/vehiculos.service"

export function VehiclesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehiculo | null>(null)
  const [vehicles, setVehicles] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔁 Cargar lista desde API
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const data = await getAllVehiculos()
        setVehicles(data)
      } catch (err: any) {
        setError("Error al cargar vehículos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVehiculos()
  }, [])

  // 📥 Registrar
  const handleAddVehicle = async (vehicleData: Omit<Vehiculo, "id_vehiculo">) => {
    try {
      await registrarVehiculo(vehicleData)
      const updated = await getAllVehiculos()
      setVehicles(updated)
      setIsModalOpen(false)
    } catch (err: any) {
      alert("Error al registrar vehículo: " + err.message)
    }
  }

  // ✏️ Editar
  const handleEditVehicle = async (vehicleData: Omit<Vehiculo, "id_vehiculo">) => {
    if (editingVehicle?.id_vehiculo) {
      try {
        await actualizarVehiculo(editingVehicle.id_vehiculo, vehicleData)
        const updated = await getAllVehiculos()
        setVehicles(updated)
        setEditingVehicle(null)
        setIsModalOpen(false)
      } catch (err: any) {
        alert("Error al actualizar vehículo: " + err.message)
      }
    }
  }

  // 🗑️ Eliminar
  const handleDeleteVehicle = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      try {
        await eliminarVehiculo(id)
        setVehicles(vehicles.filter((v) => v.id_vehiculo !== id))
      } catch (err: any) {
        alert("Error al eliminar vehículo: " + err.message)
      }
    }
  }

  const openEditModal = (vehicle: Vehiculo) => {
    setEditingVehicle(vehicle)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingVehicle(null)
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
          {loading ? (
            <p>Cargando vehículos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id_vehiculo}>
                      <TableCell>{vehicle.id_vehiculo}</TableCell>
                      <TableCell className="font-mono">{vehicle.placa}</TableCell>
                      <TableCell>{vehicle.marca}</TableCell>
                      <TableCell>{vehicle.modelo}</TableCell>
                      <TableCell>{vehicle.color}</TableCell>
                      <TableCell>{vehicle.propietario_vehiculo}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditModal(vehicle)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVehicle(vehicle.id_vehiculo!)}
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
          )}
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
