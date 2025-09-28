"use client"

import { useEffect, useState } from "react"
import { Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResidentsRegistrationModal } from "@/components/residents-registration-modal"
import { getAllResidentes, registrarResidente, actualizarResidente, getUsuario } from "@/lib/Services/usuarios.service"
import { ResidentsEditModal } from "@/components/residents-edit"
import { registrarBitacora, getUserIP, getUserDateTime } from "@/lib/Services/bitacora.service"

export interface Resident {
  id_residente: number
  nombre_completo: string
  telefono: string
  tipo_residente: "Inquilinos" | "Copropietarios"
  fecha_nacimiento: string
  id_user: number
  id_propietario: number
}

export function ResidentsTable() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResident, setEditingResident] = useState<Resident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)


  // ✅ Cargar residentes desde la API
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const data = await getAllResidentes()
        setResidents(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResidents()
  }, [])

  const handleAddResident = async (residentData: any) => {
    try {
      // 🔹 1. Registrar residente en backend
      const response = await registrarResidente(residentData)
      console.log("✅ Residente registrado:", response)

      // 🔹 2. Registrar en bitácora
      const usuario = getUsuario()
      const ip = await getUserIP()
      const fecha_hora = getUserDateTime()

      await registrarBitacora({
        username: usuario?.username || "desconocido",
        ip,
        fecha_hora,
        accion: "Registrar",
        descripcion: `Se registró un nuevo residente: ${residentData.nombre_completo}`,
      })

      // 🔹 3. Refrescar lista
      const updatedResidents = await getAllResidentes()
      setResidents(updatedResidents)

      // 🔹 4. Cerrar modal
      setIsModalOpen(false)
    } catch (error: any) {
      console.error("❌ Error al registrar residente:", error.message)
      alert("Error al registrar residente: " + error.message)
    }
  }

  const handleUpdateResident = async (updatedResident: Resident) => {
    try {
      // 🔹 1. Llamar API para actualizar en backend
      await actualizarResidente(updatedResident.id_residente, updatedResident)

      // 🔹 2. Registrar en bitácora
      const usuario = getUsuario()
      const ip = await getUserIP()
      const fecha_hora = getUserDateTime()

      await registrarBitacora({
        username: usuario?.username || "desconocido",
        ip,
        fecha_hora,
        accion: "Actualizar",
        descripcion: `Se actualizó residente ID ${updatedResident.id_residente}`,
      })

      // 🔹 3. Refrescar lista
      const updatedList = await getAllResidentes()
      setResidents(updatedList)

      // 🔹 4. Cerrar modal
      setIsEditModalOpen(false)
      setSelectedResident(null)
    } catch (error: any) {
      console.error("❌ Error al actualizar residente:", error.message)
      alert("Error al actualizar residente: " + error.message)
    }
  }


  const handleEditResident = (residentData: Partial<Resident>) => {
    if (editingResident) {
      setResidents(
        residents.map((resident) =>
          resident.id_residente === editingResident.id_residente
            ? { ...resident, ...residentData }
            : resident,
        ),
      )
      setEditingResident(null)
      setIsModalOpen(false)
    }
  }

  const handleSubmit = (residentData: any) => {
    if (editingResident) {
      handleEditResident(residentData)
    } else {
      handleAddResident(residentData)
    }
  }

  const openEditModal = (resident: Resident) => {
    setEditingResident(resident)
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setEditingResident(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingResident(null)
  }

  const getResidentTypeBadge = (tipo: Resident["tipo_residente"]) => {
    return <Badge variant={tipo === "Copropietarios" ? "default" : "secondary"}>{tipo}</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Gestión de Residentes</CardTitle>
            <CardDescription>Administra los residentes del condominio</CardDescription>
          </div>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Residente
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando residentes...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Tipo Residente</TableHead>
                  <TableHead>Fecha Nacimiento</TableHead>
                  <TableHead>ID User</TableHead>
                  <TableHead>ID Propietario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents.map((resident) => (
                  <TableRow key={resident.id_residente}>
                    <TableCell className="font-medium">{resident.id_residente}</TableCell>
                    <TableCell>{resident.nombre_completo}</TableCell>
                    <TableCell>{resident.telefono}</TableCell>
                    <TableCell>{getResidentTypeBadge(resident.tipo_residente)}</TableCell>
                    <TableCell>{new Date(resident.fecha_nacimiento).toLocaleDateString()}</TableCell>
                    <TableCell>{resident.id_user}</TableCell>
                    <TableCell>{resident.id_propietario}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedResident(resident)
                        setIsEditModalOpen(true)
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Actualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <ResidentsEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateResident}
        residentToEdit={selectedResident}
      />
      <ResidentsRegistrationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingResident={editingResident}
      />
    </>
  )
}
