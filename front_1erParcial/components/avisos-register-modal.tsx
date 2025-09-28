"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Aviso } from "../lib/Services/avisos.service"

interface AvisosRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Aviso) => void
  editingAviso?: Aviso
}

export function AvisosRegisterModal({ isOpen, onClose, onSubmit, editingAviso }: AvisosRegisterModalProps) {
  const [formData, setFormData] = useState<Aviso>({
    titulo: "",
    mensaje: "",
    fecha_envio: "",
    hora_envio: "",
    estado: "Pendiente",
    tipo: "Global",
    username: "",
  })

  useEffect(() => {
    if (editingAviso) {
      setFormData(editingAviso)
    } else {
      setFormData({
        titulo: "",
        mensaje: "",
        fecha_envio: "",
        hora_envio: "",
        estado: "Pendiente",
        tipo: "Global",
        username: "",
      })
    }
  }, [editingAviso])

  const handleInputChange = (field: keyof Aviso, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingAviso ? "Actualizar Aviso" : "Registrar Nuevo Aviso"}</CardTitle>
            <CardDescription>
              {editingAviso ? "Modifica los datos del aviso" : "Crea un nuevo aviso para el condominio"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="mensaje">Mensaje</Label>
              <Input
                id="mensaje"
                value={formData.mensaje}
                onChange={(e) => handleInputChange("mensaje", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_envio">Fecha</Label>
              <Input
                id="fecha_envio"
                type="date"
                value={formData.fecha_envio}
                onChange={(e) => handleInputChange("fecha_envio", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="hora_envio">Hora</Label>
              <Input
                id="hora_envio"
                type="time"
                value={formData.hora_envio}
                onChange={(e) => handleInputChange("hora_envio", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => handleInputChange("estado", e.target.value)}
              />
            </div>

            <div>
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Global">Global</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo === "Individual" && (
              <div>
                <Label htmlFor="username">Usuario destinatario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingAviso ? "Actualizar Aviso" : "Registrar Aviso"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
