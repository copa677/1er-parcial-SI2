"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReglasRegisterModal } from "@/components/reglas-registers"
import {
  listarReglas,
  registrarRegla,
  editarRegla,
  eliminarRegla,
  Regla,
} from "../lib/Services/reglas.service"

export function ReglasTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRegla, setEditingRegla] = useState<Regla | null>(null)
  const [reglas, setReglas] = useState<Regla[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔄 Cargar reglas desde la API
  const fetchReglas = async () => {
    try {
      setLoading(true)
      const data = await listarReglas()
      setReglas(data)
    } catch (err: any) {
      setError(err.message || "Error al cargar las reglas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReglas()
  }, [])

  // ➕ Registrar nueva regla
  const handleAddRegla = async (data: any) => {
    try {
      await registrarRegla({
        descripcion: data.descripcion,
        monto: Number(data.monto),
      })
      await fetchReglas()
      setIsModalOpen(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ✏️ Editar regla
  const handleEditRegla = async (data: any) => {
    if (!editingRegla?.id_regla) return
    try {
      await editarRegla(editingRegla.id_regla, {
        descripcion: data.descripcion,
        monto: Number(data.monto),
      })
      await fetchReglas()
      setEditingRegla(null)
      setIsModalOpen(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ❌ Eliminar regla
  const handleDeleteRegla = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta regla?")) {
      try {
        await eliminarRegla(id)
        await fetchReglas()
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const openEditModal = (regla: Regla) => {
    setEditingRegla(regla)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRegla(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reglas de Convivencia</CardTitle>
              <CardDescription>Administra las reglas del condominio</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar Regla
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando reglas...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Monto a Pagar (Bs)</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reglas.map((regla) => (
                    <TableRow key={regla.id_regla}>
                      <TableCell className="font-medium">{regla.id_regla}</TableCell>
                      <TableCell>{regla.descripcion}</TableCell>
                      <TableCell>{regla.monto}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditModal(regla)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRegla(regla.id_regla!)}
                            className="text-destructive hover:text-destructive"
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

      <ReglasRegisterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingRegla ? handleEditRegla : handleAddRegla}
        editingRule={
          editingRegla
            ? {
                descripcion: editingRegla.descripcion,
                monto: String(editingRegla.monto),
              }
            : undefined
        }
      />
    </>
  )
}
