"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VisitorsRegistrationModal } from "@/components/visitors-registration-modal"
import {
  getAllVisitantes,
  registrarVisitante,
  actualizarVisitante,
  eliminarVisitante,
  Visitor,
  VisitorRegister
} from "@/lib/Services/visitantes.service"

export function VisitorsTable() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const data = await getAllVisitantes()
        setVisitors(data)
      } catch (err: any) {
        setError("Error al cargar visitantes: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVisitors()
  }, [])

  const handleAddVisitor = async (visitorData: VisitorRegister) => {
    try {
      await registrarVisitante(visitorData)
      const updated = await getAllVisitantes()
      setVisitors(updated)
      setIsModalOpen(false)
    } catch (error: any) {
      alert("Error al registrar visitante: " + error.message)
    }
  }


  const handleEditVisitor = (visitor: Visitor) => {
    setEditingVisitor(visitor)
    setIsModalOpen(true)
  }

  const handleUpdateVisitor = async (visitorData: VisitorRegister) => {
    if (!editingVisitor) return

    try {
      await actualizarVisitante(editingVisitor.id_visitante, visitorData)
      const updated = await getAllVisitantes()
      setVisitors(updated)
      setIsModalOpen(false)
      setEditingVisitor(null)
    } catch (error: any) {
      alert("Error al actualizar visitante: " + error.message)
    }
  }

  const handleDeleteVisitor = async (id: number) => {
    if (confirm("¿Deseas eliminar este visitante?")) {
      try {
        await eliminarVisitante(id)
        const updated = await getAllVisitantes()
        setVisitors(updated)
      } catch (error: any) {
        alert("Error al eliminar visitante: " + error.message)
      }
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
                  <TableHead>Teléfono</TableHead>
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
                    <TableCell>{visitor.telefono}</TableCell>
                    <TableCell>{visitor.fecha_agregacion}</TableCell>
                    <TableCell>{visitor.fecha_visita}</TableCell>
                    <TableCell>{getStatusBadge(visitor.estado)}</TableCell>
                    <TableCell>{visitor.nombre_anfitrion}</TableCell>
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
