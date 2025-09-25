"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CommonAreasRegistrationModal } from "@/components/common-areas-registration-modal"

interface CommonArea {
  id_area: number
  nombre: string
  descripcion: string
  tipo_area: string
  ubicacion: string
  capacidad_maxima: number
  hora_apertura: string
  hora_cierre: string
  estado: "Activo" | "Inactivo" | "Mantenimiento"
  costo_hora: number
  requiere_reserva: boolean
  tiempo_max_reserva: number
  fecha_creacion: string
  fecha_actualizacion: string
}

export function CommonAreasTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<CommonArea | null>(null)
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([
    {
      id_area: 1,
      nombre: "Piscina Principal",
      descripcion: "Piscina olímpica con área de recreación",
      tipo_area: "Recreativa",
      ubicacion: "Planta Baja - Área Norte",
      capacidad_maxima: 50,
      hora_apertura: "06:00",
      hora_cierre: "22:00",
      estado: "Activo",
      costo_hora: 0,
      requiere_reserva: false,
      tiempo_max_reserva: 0,
      fecha_creacion: "2024-01-15",
      fecha_actualizacion: "2024-01-15",
    },
    {
      id_area: 2,
      nombre: "Salón de Eventos",
      descripcion: "Salón para celebraciones y reuniones",
      tipo_area: "Eventos",
      ubicacion: "Piso 2 - Área Central",
      capacidad_maxima: 100,
      hora_apertura: "08:00",
      hora_cierre: "23:00",
      estado: "Activo",
      costo_hora: 25000,
      requiere_reserva: true,
      tiempo_max_reserva: 8,
      fecha_creacion: "2024-01-10",
      fecha_actualizacion: "2024-02-01",
    },
    {
      id_area: 3,
      nombre: "Gimnasio",
      descripcion: "Área de ejercicios con equipos modernos",
      tipo_area: "Deportiva",
      ubicacion: "Sótano 1",
      capacidad_maxima: 20,
      hora_apertura: "05:00",
      hora_cierre: "23:00",
      estado: "Mantenimiento",
      costo_hora: 0,
      requiere_reserva: false,
      tiempo_max_reserva: 0,
      fecha_creacion: "2024-01-05",
      fecha_actualizacion: "2024-03-10",
    },
  ])

  const handleEdit = (area: CommonArea) => {
    setEditingArea(area)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta área común?")) {
      setCommonAreas(commonAreas.filter((area) => area.id_area !== id))
    }
  }

  const handleSubmit = (data: any) => {
    if (editingArea) {
      // Update existing area
      setCommonAreas(
        commonAreas.map((area) =>
          area.id_area === editingArea.id_area
            ? {
                ...area,
                ...data,
                fecha_actualizacion: new Date().toISOString().split("T")[0],
              }
            : area,
        ),
      )
    } else {
      // Add new area
      const newArea: CommonArea = {
        id_area: Math.max(...commonAreas.map((a) => a.id_area)) + 1,
        ...data,
        fecha_creacion: new Date().toISOString().split("T")[0],
        fecha_actualizacion: new Date().toISOString().split("T")[0],
      }
      setCommonAreas([...commonAreas, newArea])
    }

    setIsModalOpen(false)
    setEditingArea(null)
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
            <CardTitle>Areas Comunes</CardTitle>
            <CardDescription>Gestiona las áreas comunes del condominio</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Area Común
          </Button>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Creación</TableHead>
                  <TableHead>Actualización</TableHead>
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
                    <TableCell className="text-sm text-muted-foreground">{area.fecha_creacion}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{area.fecha_actualizacion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(area)} className="h-8 w-8 p-0">
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
