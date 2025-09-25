"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VisitorsRegistrationModal } from "@/components/visitors-registration-modal"

interface Visitor {
  id_visitante: number
  nombre_completo: string
  ci: string
  telefono: string
  correo: string
  fecha_agregacion: string
  fecha_visita: string
  estado: "Activo" | "Eliminado"
  id_propietario?: number
  id_residente?: number
  propietario_nombre?: string
  residente_nombre?: string
}

const mockVisitors: Visitor[] = [
  {
    id_visitante: 1,
    nombre_completo: "Carlos Mendoza",
    ci: "12345678",
    telefono: "3001234567",
    correo: "carlos.mendoza@email.com",
    fecha_agregacion: "2024-01-15",
    fecha_visita: "2024-01-20",
    estado: "Activo",
    id_propietario: 1,
    propietario_nombre: "Ana García",
  },
  {
    id_visitante: 2,
    nombre_completo: "María López",
    ci: "87654321",
    telefono: "3009876543",
    correo: "maria.lopez@email.com",
    fecha_agregacion: "2024-01-16",
    fecha_visita: "2024-01-22",
    estado: "Activo",
    id_residente: 2,
    residente_nombre: "Pedro Martínez",
  },
  {
    id_visitante: 3,
    nombre_completo: "Juan Pérez",
    ci: "11223344",
    telefono: "3005566778",
    correo: "juan.perez@email.com",
    fecha_agregacion: "2024-01-10",
    fecha_visita: "2024-01-18",
    estado: "Eliminado",
    id_propietario: 3,
    propietario_nombre: "Laura Rodríguez",
  },
]

export function VisitorsTable() {
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)

  const handleAddVisitor = (visitorData: any) => {
    const newVisitor: Visitor = {
      id_visitante: Math.max(...visitors.map((v) => v.id_visitante)) + 1,
      ...visitorData,
    }
    setVisitors([...visitors, newVisitor])
    setIsModalOpen(false)
  }

  const handleEditVisitor = (visitor: Visitor) => {
    setEditingVisitor(visitor)
    setIsModalOpen(true)
  }

  const handleUpdateVisitor = (visitorData: any) => {
    if (editingVisitor) {
      setVisitors(visitors.map((v) => (v.id_visitante === editingVisitor.id_visitante ? { ...v, ...visitorData } : v)))
      setEditingVisitor(null)
      setIsModalOpen(false)
    }
  }

  const handleDeleteVisitor = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este visitante?")) {
      setVisitors(visitors.filter((v) => v.id_visitante !== id))
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingVisitor(null)
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
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
            Eliminado
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Visitantes</CardTitle>
            <CardDescription>Gestiona los visitantes del condominio</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Visitante
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>CI</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Fecha Agregación</TableHead>
                  <TableHead>Fecha Visita</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Anfitrión</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor.id_visitante}>
                    <TableCell className="font-medium">{visitor.id_visitante}</TableCell>
                    <TableCell>{visitor.nombre_completo}</TableCell>
                    <TableCell>{visitor.ci}</TableCell>
                    <TableCell>{visitor.telefono}</TableCell>
                    <TableCell>{visitor.correo}</TableCell>
                    <TableCell>{visitor.fecha_agregacion}</TableCell>
                    <TableCell>{visitor.fecha_visita}</TableCell>
                    <TableCell>{getStatusBadge(visitor.estado)}</TableCell>
                    <TableCell>
                      {visitor.propietario_nombre && (
                        <div className="text-sm">
                          <span className="font-medium">Propietario:</span> {visitor.propietario_nombre}
                        </div>
                      )}
                      {visitor.residente_nombre && (
                        <div className="text-sm">
                          <span className="font-medium">Residente:</span> {visitor.residente_nombre}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditVisitor(visitor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVisitor(visitor.id_visitante)}
                          className="text-red-600 hover:text-red-700"
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

      <VisitorsRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingVisitor ? handleUpdateVisitor : handleAddVisitor}
        editingVisitor={editingVisitor}
      />
    </div>
  )
}
