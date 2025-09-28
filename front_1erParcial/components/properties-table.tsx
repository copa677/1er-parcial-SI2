"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PropertiesRegistrationModal } from "@/components/properties-registration-modal"
import {
  getAllPropiedades,
  registrarPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
  Propiedad,
  PropiedadRegister,
} from "@/lib/Services/propiedades.service"

// 📌 Importar servicios de Bitácora y Usuario
import { registrarBitacora, getUserIP, getUserDateTime } from "@/lib/Services/bitacora.service"
import { getUsuario } from "@/lib/Services/usuarios.service"

export function PropertiesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Propiedad | null>(null)
  const [properties, setProperties] = useState<Propiedad[]>([])

  // 📌 Cargar propiedades al montar
  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const data = await getAllPropiedades()
      setProperties(data)
    } catch (error) {
      console.error("Error al cargar propiedades:", error)
    }
  }

  // ➕ Registrar Propiedad + Bitácora
  const handleAddProperty = async (propertyData: PropiedadRegister) => {
    try {
      await registrarPropiedad(propertyData)
      await fetchProperties()
      setIsModalOpen(false)

      // 🔹 Guardar en bitácora
      const user = getUsuario()
      const ip = await getUserIP()
      const fecha_hora = getUserDateTime()
      if (user) {
        await registrarBitacora({
          username: user.username,
          ip,
          fecha_hora,
          accion: "Registrar Propiedad",
          descripcion: `Se registró la propiedad tipo "${propertyData.tipo_propiedad}" con número ${propertyData.numero} y propietario ${propertyData.nombre_propietario}`,
        })
      }
    } catch (error) {
      console.error("Error al registrar propiedad:", error)
    }
  }

  // ✏️ Editar Propiedad + Bitácora
  const handleUpdateProperty = async (propertyData: PropiedadRegister) => {
    if (editingProperty) {
      try {
        await actualizarPropiedad(editingProperty.id_propiedad, propertyData)
        await fetchProperties()
        setEditingProperty(null)
        setIsModalOpen(false)

        // 🔹 Guardar en bitácora
        const user = getUsuario()
        const ip = await getUserIP()
        const fecha_hora = getUserDateTime()
        if (user) {
          await registrarBitacora({
            username: user.username,
            ip,
            fecha_hora,
            accion: "Editar Propiedad",
            descripcion: `Se actualizó la propiedad #${editingProperty.id_propiedad}: ahora tipo "${propertyData.tipo_propiedad}", número ${propertyData.numero}`,
          })
        }
      } catch (error) {
        console.error("Error al actualizar propiedad:", error)
      }
    }
  }

  // 🗑️ Eliminar Propiedad + Bitácora
  const handleDeleteProperty = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      try {
        const propiedadToDelete = properties.find((p) => p.id_propiedad === id)

        await eliminarPropiedad(id)
        await fetchProperties()

        // 🔹 Guardar en bitácora
        const user = getUsuario()
        const ip = await getUserIP()
        const fecha_hora = getUserDateTime()
        if (user && propiedadToDelete) {
          await registrarBitacora({
            username: user.username,
            ip,
            fecha_hora,
            accion: "Eliminar Propiedad",
            descripcion: `Se eliminó la propiedad #${propiedadToDelete.id_propiedad}: tipo "${propiedadToDelete.tipo_propiedad}", número ${propiedadToDelete.numero}`,
          })
        }
      } catch (error) {
        console.error("Error al eliminar propiedad:", error)
      }
    }
  }

  const getStatusBadge = (status: Propiedad["estado"]) => {
    const variants = {
      Activo: "default",
      Eliminado: "destructive",
    } as const
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Gestión de Propiedades</CardTitle>
            <CardDescription>Administra las propiedades del condominio</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Propiedad
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>m²</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>ID Propietario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id_propiedad}>
                    <TableCell>{property.id_propiedad}</TableCell>
                    <TableCell>{property.tipo_propiedad}</TableCell>
                    <TableCell>{property.numero}</TableCell>
                    <TableCell>{property.direccion}</TableCell>
                    <TableCell>{property.metros_cuadrados} m²</TableCell>
                    <TableCell>{getStatusBadge(property.estado as "Activo" | "Eliminado")}</TableCell>
                    <TableCell>{property.id_propietario}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProperty(property)
                            setIsModalOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id_propiedad)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
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

      <PropertiesRegistrationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProperty(null)
        }}
        onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty}
        editingProperty={editingProperty}
      />
    </div>
  )
}
