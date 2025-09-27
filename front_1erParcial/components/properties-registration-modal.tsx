"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 🔹 Importamos el servicio
import { listarNombrePropietarios } from "@/lib/Services/usuarios.service"

interface PropertyFormData {
  tipo_propiedad: string
  numero: string
  direccion: string
  metros_cuadrados: number
  estado: "Activo" | "Eliminado" | ""
  nombre_propietario: string
}

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

interface PropertiesRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingProperty?: Property | null
}

export function PropertiesRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  editingProperty,
}: PropertiesRegistrationModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    tipo_propiedad: "",
    numero: "",
    direccion: "",
    metros_cuadrados: 0,
    estado: "",
    nombre_propietario: "",
  })

  const [propietarios, setPropietarios] = useState<string[]>([])

  // 🔹 Cargar lista de propietarios al abrir modal
  useEffect(() => {
    async function fetchPropietarios() {
      try {
        const data = await listarNombrePropietarios()
        setPropietarios(data)
      } catch (error) {
        console.error("Error cargando propietarios:", error)
      }
    }
    if (isOpen) fetchPropietarios()
  }, [isOpen])

  // 🔹 Cargar datos si se está editando
  useEffect(() => {
    if (editingProperty) {
      setFormData({
        tipo_propiedad: editingProperty.tipo_propiedad,
        numero: editingProperty.numero,
        direccion: editingProperty.direccion,
        metros_cuadrados: editingProperty.metros_cuadrados,
        estado: editingProperty.estado,
        nombre_propietario: editingProperty.nombre_propietario,
      })
    } else {
      setFormData({
        tipo_propiedad: "",
        numero: "",
        direccion: "",
        metros_cuadrados: 0,
        estado: "",
        nombre_propietario: "",
      })
    }
  }, [editingProperty])

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.tipo_propiedad ||
      !formData.numero ||
      !formData.direccion ||
      !formData.estado ||
      !formData.nombre_propietario
    ) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    if (formData.metros_cuadrados <= 0) {
      alert("Los metros cuadrados deben ser mayor a 0")
      return
    }

    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingProperty ? "Actualizar Propiedad" : "Registro de Propiedad"}</CardTitle>
            <CardDescription>
              {editingProperty ? "Modifica los datos de la propiedad" : "Registra una nueva propiedad"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="tipo_propiedad">Tipo de Propiedad *</Label>
                <Select
                  value={formData.tipo_propiedad}
                  onValueChange={(value) => handleInputChange("tipo_propiedad", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Estudio">Estudio</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                    <SelectItem value="Oficina">Oficina</SelectItem>
                    <SelectItem value="Parqueadero">Parqueadero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Número */}
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  placeholder="Ej: 101, A-205, P-15"
                  required
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  placeholder="Ej: Torre A - Piso 1, Bloque B - Nivel 3"
                  required
                />
              </div>

              {/* Metros cuadrados */}
              <div className="space-y-2">
                <Label htmlFor="metros_cuadrados">Metros Cuadrados *</Label>
                <Input
                  id="metros_cuadrados"
                  type="number"
                  min="1"
                  value={formData.metros_cuadrados}
                  onChange={(e) => handleInputChange("metros_cuadrados", Number.parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Eliminado">Eliminado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Propietario: ahora es un ComboBox dinámico */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre_propietario">Nombre del Propietario *</Label>
                <Select
                  value={formData.nombre_propietario}
                  onValueChange={(value) => handleInputChange("nombre_propietario", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un propietario" />
                  </SelectTrigger>
                  <SelectContent>
                    {propietarios.map((nombre, idx) => (
                      <SelectItem key={idx} value={nombre}>
                        {nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{editingProperty ? "Actualizar Propiedad" : "Registrar Propiedad"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
