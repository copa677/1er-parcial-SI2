"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PropertiesRegistrationModal } from "@/components/properties-registration-modal"

interface Property {
  id_propiedad: number
  tipo_propiedad: string
  numero: string
  direccion: string
  metros_cuadrados: number
  estado: "Activo" | "Eliminado"
  id_propietario: number
  nombre_propietario: string
}

export function PropertiesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [properties, setProperties] = useState<Property[]>([
    {
      id_propiedad: 1,
      tipo_propiedad: "Apartamento",
      numero: "101",
      direccion: "Torre A - Piso 1",
      metros_cuadrados: 85,
      estado: "Activo",
      id_propietario: 1,
      nombre_propietario: "Juan Pérez",
    },
    {
      id_propiedad: 2,
      tipo_propiedad: "Apartamento",
      numero: "102",
      direccion: "Torre A - Piso 1",
      metros_cuadrados: 92,
      estado: "Activo",
      id_propietario: 2,
      nombre_propietario: "María García",
    },
    {
      id_propiedad: 3,
      tipo_propiedad: "Penthouse",
      numero: "501",
      direccion: "Torre B - Piso 5",
      metros_cuadrados: 150,
      estado: "Eliminado",
      id_propietario: 3,
      nombre_propietario: "Carlos López",
    },
  ])

  const handleAddProperty = (propertyData: any) => {
    const newProperty: Property = {
      id_propiedad: properties.length + 1,
      ...propertyData,
      id_propietario: properties.length + 1, // Simulated ID
    }
    setProperties([...properties, newProperty])
    setIsModalOpen(false)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setIsModalOpen(true)
  }

  const handleUpdateProperty = (propertyData: any) => {
    if (editingProperty) {
      setProperties(
        properties.map((property) =>
          property.id_propiedad === editingProperty.id_propiedad ? { ...property, ...propertyData } : property,
        ),
      )
      setEditingProperty(null)
      setIsModalOpen(false)
    }
  }

  const handleDeleteProperty = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      setProperties(properties.filter((property) => property.id_propiedad !== id))
    }
  }

  const getStatusBadge = (status: Property["estado"]) => {
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
                  <TableHead>Propietario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id_propiedad}>
                    <TableCell className="font-medium">{property.id_propiedad}</TableCell>
                    <TableCell>{property.tipo_propiedad}</TableCell>
                    <TableCell className="font-semibold">{property.numero}</TableCell>
                    <TableCell>{property.direccion}</TableCell>
                    <TableCell>{property.metros_cuadrados} m²</TableCell>
                    <TableCell>{getStatusBadge(property.estado)}</TableCell>
                    <TableCell>{property.id_propietario}</TableCell>
                    <TableCell>{property.nombre_propietario}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id_propiedad)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
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
