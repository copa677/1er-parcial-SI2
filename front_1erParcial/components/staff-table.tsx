"use client"

import { useEffect, useState } from "react"
import { Edit, Plus } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StaffRegistrationModal } from "@/components/staff-registration-modal"
import { StaffEditModal } from "@/components/staff-editt"
import { getAllPersonal, registrarPersonal } from "@/lib/Services/usuarios.service"


interface Staff {
  id_personal: number
  nombre_completo: string
  telefono: string
  direccion: string
  fecha_nacimiento: string
  rol: string
  id_user: number
}

interface StaffRegister {
  username: string,
  password: string,
  email: string,
  tipo_user: string,       // debe ser "Personal"
  estado?: string,         // opcional, por defecto "ACTIVO"
  nombre_completo: string,
  telefono: string,
  direccion: string,
  fecha_nacimiento: string,
  rol: string              // Ejemplo: "Seguridad"
}

export function StaffTable() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)


  // ✅ Cargar datos reales desde la API
  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const personal = await getAllPersonal()
        setStaff(personal) // ← asegúrate de que el backend responde con { personal: [...] }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPersonal()
  }, [])

  const handleEdit = (staffId: number) => {
    const staffToEdit = staff.find((s) => s.id_personal === staffId)
    if (staffToEdit) {
      setSelectedStaff(staffToEdit)
      setIsEditModalOpen(true)
    }
  }

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff((prev) =>
      prev.map((person) =>
        person.id_personal === updatedStaff.id_personal ? updatedStaff : person
      )
    )
    setIsEditModalOpen(false)
    setSelectedStaff(null)
  }


  const handleAddStaff = async (newStaff: Omit<StaffRegister, "id_personal">) => {
    try {
      const payload = {
        username: newStaff.username,
        password: newStaff.password,
        email: newStaff.email,
        tipo_user: "Personal",
        nombre_completo: newStaff.nombre_completo,
        telefono: newStaff.telefono,
        direccion: newStaff.direccion,
        fecha_nacimiento: newStaff.fecha_nacimiento,
        rol: newStaff.rol,
      }

      const response = await registrarPersonal(payload)
      console.log("✅ Personal registrado:", response)

      // Volver a cargar lista
      const updatedList = await getAllPersonal()
      setStaff(updatedList)

      setIsModalOpen(false)
    } catch (error: any) {
      console.error("❌ Error al registrar personal:", error.message)
      alert("Error al registrar personal: " + error.message)
    }
  }


  const getRoleBadge = (rol: string) => {
    const variant = rol === "Administrador" ? "default" : "secondary"
    return <Badge variant={variant}>{rol}</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Personal</CardTitle>
              <CardDescription>Administra el personal del condominio</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Registro de Personal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando personal...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Fecha Nacimiento</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>ID Usuario</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((person) => (
                  <TableRow key={person.id_personal}>
                    <TableCell className="font-medium">{person.id_personal}</TableCell>
                    <TableCell>{person.nombre_completo}</TableCell>
                    <TableCell>{person.telefono}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{person.direccion}</TableCell>
                    <TableCell>{new Date(person.fecha_nacimiento).toLocaleDateString()}</TableCell>
                    <TableCell>{getRoleBadge(person.rol)}</TableCell>
                    <TableCell>{person.id_user}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(person.id_personal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <StaffEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateStaff}
        staffToEdit={selectedStaff}
      />

      <StaffRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStaff}
      />
    </>
  )
}
