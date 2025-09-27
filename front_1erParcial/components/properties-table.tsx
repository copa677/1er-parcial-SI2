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

  // ➕ Registrar
  const handleAddProperty = async (propertyData: PropiedadRegister) => {
    try {
      await registrarPropiedad(propertyData)
      await fetchProperties() // refrescar lista
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error al registrar propiedad:", error)
    }
  }

  // ✏️ Editar
  const handleUpdateProperty = async (propertyData: PropiedadRegister) => {
    if (editingProperty) {
      try {
        await actualizarPropiedad(editingProperty.id_propiedad, propertyData)
        await fetchProperties()
        setEditingProperty(null)
        setIsModalOpen(false)
      } catch (error) {
        console.error("Error al actualizar propiedad:", error)
      }
    }
  }

  // 🗑️ Eliminar
  const handleDeleteProperty = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      try {
        await eliminarPropiedad(id)
        await fetchProperties()
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
