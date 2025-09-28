"use client"

import { useEffect, useState } from "react"
import { Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { OwnersRegistrationModal } from "@/components/owners-registration-modal"
import { getAllPropietarios, registrarPropietario, actualizarPropietario, getUsuario } from "@/lib/Services/usuarios.service"
import { OwnersEditModal } from "@/components/owners-edit"
import { registrarBitacora, getUserIP, getUserDateTime } from "@/lib/Services/bitacora.service"

interface Owner {
  id_propietario: number
  nombre_completo: string
  telefono: string
  fecha_nacimiento: string
  id_user: number
}

export function OwnersTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // ✅ Cargar propietarios desde la API
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const data = await getAllPropietarios()
        setOwners(data) // ← si tu servicio ya devuelve solo el array
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOwners()
  }, [])

  const handleAddOwner = async (ownerData: any) => {
    try {
      const payload = { ...ownerData, tipo_user: "Propietario" }
      await registrarPropietario(payload)

      // 🔹 Bitácora
      const usuario = getUsuario()
      const ip = await getUserIP()
      const fecha_hora = getUserDateTime()
      await registrarBitacora({
        username: usuario?.username || "desconocido",
        ip,
        fecha_hora,
        accion: "Registrar",
        descripcion: `Se registró nuevo propietario: ${payload.nombre_completo}`,
      })

      // 🔹 Refrescar lista
      const nuevos = await getAllPropietarios()
      setOwners(nuevos)
      setIsModalOpen(false)
    } catch (error: any) {
      console.error("❌ Error al registrar propietario:", error.message)
      alert("Error al registrar propietario: " + error.message)
    }
  }

  const handleEditOwner = (ownerData: any) => {
    if (editingOwner) {
      setOwners(
        owners.map((owner) =>
          owner.id_propietario === editingOwner.id_propietario ? { ...owner, ...ownerData } : owner,
        ),
      )
      setEditingOwner(null)
      setIsModalOpen(false)
    }
  }

  const handleUpdateOwner = async (updatedOwner: Owner) => {
    try {
      // 🔹 1. API update
      await actualizarPropietario(updatedOwner.id_propietario, updatedOwner)

      // 🔹 2. Bitácora
      const usuario = getUsuario()
      const ip = await getUserIP()
      const fecha_hora = getUserDateTime()
      await registrarBitacora({
        username: usuario?.username || "desconocido",
        ip,
        fecha_hora,
        accion: "Actualizar",
        descripcion: `Se actualizó propietario ID ${updatedOwner.id_propietario}`,
      })

      // 🔹 3. Refrescar lista
      const nuevos = await getAllPropietarios()
      setOwners(nuevos)

      setIsEditModalOpen(false)
      setSelectedOwner(null)
    } catch (error: any) {
      console.error("❌ Error al actualizar propietario:", error.message)
      alert("Error al actualizar propietario: " + error.message)
    }
  }


  const openEditModal = (owner: Owner) => {
    setSelectedOwner(owner)
    setIsEditModalOpen(true)
  }


  const openAddModal = () => {
    setEditingOwner(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditingOwner(null)
    setIsModalOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Propietarios</CardTitle>
            <CardDescription>Gestión de propietarios del condominio</CardDescription>
          </div>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Propietario
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando propietarios...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha Nacimiento</TableHead>
                  <TableHead>ID Usuario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.id_propietario}>
                    <TableCell className="font-medium">{owner.id_propietario}</TableCell>
                    <TableCell>{owner.nombre_completo}</TableCell>
                    <TableCell>{owner.telefono}</TableCell>
                    <TableCell>{new Date(owner.fecha_nacimiento).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{owner.id_user}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(owner)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <OwnersEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateOwner}
        ownerToEdit={selectedOwner}
      />

      <OwnersRegistrationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingOwner ? handleEditOwner : handleAddOwner}
        editingOwner={editingOwner}
      />
    </>
  )
}
