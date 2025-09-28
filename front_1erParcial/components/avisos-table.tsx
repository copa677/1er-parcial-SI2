"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AvisosRegisterModal } from "./avisos-register-modal"

import {
  listarAvisos,
  registrarAviso,
  actualizarAviso,
  eliminarAviso,
  Aviso,
} from "../lib/Services/avisos.service"

export function AvisosTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAviso, setEditingAviso] = useState<Aviso | null>(null)
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔄 Cargar avisos desde la API
  const fetchAvisos = async () => {
    try {
      setLoading(true)
      const data = await listarAvisos()
      setAvisos(data)
    } catch (err: any) {
      setError(err.message || "Error al cargar los avisos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvisos()
  }, [])

  // ➕ Registrar aviso
  const handleAddAviso = async (data: Aviso) => {
    try {
      await registrarAviso(data)
      await fetchAvisos()
      setIsModalOpen(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ✏️ Editar aviso
  const handleEditAviso = async (data: Aviso) => {
    if (!editingAviso?.id_aviso) return
    try {
      await actualizarAviso(editingAviso.id_aviso, data)
      await fetchAvisos()
      setEditingAviso(null)
      setIsModalOpen(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ❌ Eliminar aviso
  const handleDeleteAviso = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este aviso?")) {
      try {
        await eliminarAviso(id)
        await fetchAvisos()
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const openEditModal = (aviso: Aviso) => {
    setEditingAviso(aviso)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAviso(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Avisos</CardTitle>
              <CardDescription>Administra los avisos del condominio</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar Aviso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando avisos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avisos.map((aviso) => (
                    <TableRow key={aviso.id_aviso}>
                      <TableCell>{aviso.id_aviso}</TableCell>
                      <TableCell>{aviso.titulo}</TableCell>
                      <TableCell>{aviso.mensaje}</TableCell>
                      <TableCell>{aviso.fecha_envio}</TableCell>
                      <TableCell>{aviso.hora_envio}</TableCell>
                      <TableCell>{aviso.estado}</TableCell>
                      <TableCell>{aviso.tipo}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditModal(aviso)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAviso(aviso.id_aviso!)}
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

      <AvisosRegisterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingAviso ? handleEditAviso : handleAddAviso}
        editingAviso={editingAviso || undefined}
      />
    </>
  )
}
