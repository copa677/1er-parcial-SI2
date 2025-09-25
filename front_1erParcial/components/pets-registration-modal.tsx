"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface PetFormData {
  nombre: string
  especie: string
  raza: string
  descripcion: string
  fecha_nacimiento: string
  sexo: "Macho" | "Hembra" | ""
  owner_type: "Propietario" | "Residente" | ""
  id_propietario: number | null
  id_residente: number | null
}

interface Pet {
  id_mascota: number
  especie: string
  raza: string
  nombre: string
  descripcion: string
  fecha_nacimiento: string
  sexo: "Macho" | "Hembra"
  id_propietario: number | null
  id_residente: number | null
}

interface PetsRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingPet?: Pet | null
}

export function PetsRegistrationModal({ isOpen, onClose, onSubmit, editingPet }: PetsRegistrationModalProps) {
  const [formData, setFormData] = useState<PetFormData>({
    nombre: "",
    especie: "",
    raza: "",
    descripcion: "",
    fecha_nacimiento: "",
    sexo: "",
    owner_type: "",
    id_propietario: null,
    id_residente: null,
  })

  // Load data when editing
  useEffect(() => {
    if (editingPet) {
      setFormData({
        nombre: editingPet.nombre,
        especie: editingPet.especie,
        raza: editingPet.raza,
        descripcion: editingPet.descripcion,
        fecha_nacimiento: editingPet.fecha_nacimiento,
        sexo: editingPet.sexo,
        owner_type: editingPet.id_propietario ? "Propietario" : "Residente",
        id_propietario: editingPet.id_propietario,
        id_residente: editingPet.id_residente,
      })
    } else {
      // Reset form for new pet
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        descripcion: "",
        fecha_nacimiento: "",
        sexo: "",
        owner_type: "",
        id_propietario: null,
        id_residente: null,
      })
    }
  }, [editingPet])

  const handleInputChange = (field: keyof PetFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOwnerTypeChange = (value: "Propietario" | "Residente") => {
    setFormData((prev) => ({
      ...prev,
      owner_type: value,
      id_propietario: value === "Propietario" ? Math.floor(Math.random() * 10) + 1 : null,
      id_residente: value === "Residente" ? Math.floor(Math.random() * 10) + 1 : null,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that only one owner type is selected
    if (!formData.owner_type) {
      alert("Debe seleccionar si la mascota pertenece a un Propietario o Residente")
      return
    }

    const petData = {
      nombre: formData.nombre,
      especie: formData.especie,
      raza: formData.raza,
      descripcion: formData.descripcion,
      fecha_nacimiento: formData.fecha_nacimiento,
      sexo: formData.sexo,
      id_propietario: formData.owner_type === "Propietario" ? formData.id_propietario : null,
      id_residente: formData.owner_type === "Residente" ? formData.id_residente : null,
    }

    onSubmit(petData)

    // Reset form if not editing
    if (!editingPet) {
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        descripcion: "",
        fecha_nacimiento: "",
        sexo: "",
        owner_type: "",
        id_propietario: null,
        id_residente: null,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingPet ? "Actualizar Mascota" : "Registro de Mascota"}</CardTitle>
            <CardDescription>
              {editingPet ? "Modifica los datos de la mascota" : "Registra una nueva mascota"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>¿De quién es la mascota?</Label>
                <RadioGroup
                  value={formData.owner_type}
                  onValueChange={handleOwnerTypeChange}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Propietario" id="propietario" />
                    <Label htmlFor="propietario">Propietario</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Residente" id="residente" />
                    <Label htmlFor="residente">Residente</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="especie">Especie</Label>
                <Select value={formData.especie} onValueChange={(value) => handleInputChange("especie", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perro">Perro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Ave">Ave</SelectItem>
                    <SelectItem value="Pez">Pez</SelectItem>
                    <SelectItem value="Hamster">Hamster</SelectItem>
                    <SelectItem value="Conejo">Conejo</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="raza">Raza</Label>
                <Input
                  id="raza"
                  value={formData.raza}
                  onChange={(e) => handleInputChange("raza", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Hembra">Hembra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Describe las características de la mascota..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{editingPet ? "Actualizar Mascota" : "Registrar Mascota"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
