"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CommonAreasRegistrationModal } from "@/components/common-areas-registration-modal"

// 📌 Importamos el servicio
import {
  getAllAreasComunes,
  registrarAreaComun,
  editarAreaComun,
  eliminarAreaComun,
  AreaComun,
  AreaComunRegister,
} from "@/lib/Services/areasComunes.service"

export function CommonAreasTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<AreaComun | null>(null)
  const [commonAreas, setCommonAreas] = useState<AreaComun[]>([])
  const [loading, setLoading] = useState(true)

  // 📌 Cargar áreas comunes al iniciar
  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      setLoading(true)
      const data = await getAllAreasComunes()
      setCommonAreas(data)
    } catch (error) {
      console.error("Error cargando áreas comunes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (area: AreaComun) => {
    setEditingArea(area)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta área común?")) {
      try {
        await eliminarAreaComun(id)
        await fetchAreas()
      } catch (error) {
        console.error("Error eliminando área común:", error)
      }
    }
  }

  const handleSubmit = async (data: AreaComunRegister) => {
    try {
      if (editingArea) {
        // 📌 Editar
        await editarAreaComun(editingArea.id_area, data)
      } else {
        // 📌 Registrar
        await registrarAreaComun(data)
      }
      await fetchAreas()
      setIsModalOpen(false)
      setEditingArea(null)
    } catch (error) {
      console.error("Error guardando área común:", error)
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Activo
          </Badge>
        )
      case "Inactivo":
        return <Badge variant="secondary">Inactivo</Badge>
      case "Mantenimiento":
        return <Badge variant="destructive">Mantenimiento</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Áreas Comunes</CardTitle>
            <CardDescription>Gestiona las áreas comunes del condominio</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Área Común
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Cargando áreas...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Costo/Hora</TableHead>
                    <TableHead>Reserva</TableHead>
                    <TableHead>Tiempo Máx.</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commonAreas.map((area) => (
                    <TableRow key={area.id_area}>
                      <TableCell className="font-medium">{area.id_area}</TableCell>
                      <TableCell className="font-medium">{area.nombre}</TableCell>
                      <TableCell className="max-w-xs truncate" title={area.descripcion}>
                        {area.descripcion}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{area.tipo_area}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={area.ubicacion}>
                        {area.ubicacion}
                      </TableCell>
                      <TableCell>{area.capacidad_maxima}</TableCell>
                      <TableCell className="text-sm">
                        {area.hora_apertura} - {area.hora_cierre}
                      </TableCell>
                      <TableCell>{getStatusBadge(area.estado)}</TableCell>
                      <TableCell>{area.costo_hora > 0 ? formatCurrency(area.costo_hora) : "Gratis"}</TableCell>
                      <TableCell>
                        <Badge variant={area.requiere_reserva ? "default" : "secondary"}>
                          {area.requiere_reserva ? "Sí" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{area.tiempo_max_reserva > 0 ? `${area.tiempo_max_reserva}h` : "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(area)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(area.id_area)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

      <CommonAreasRegistrationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingArea(null)
        }}
        onSubmit={handleSubmit}
        editingArea={editingArea}
      />
    </div>
  )
}
