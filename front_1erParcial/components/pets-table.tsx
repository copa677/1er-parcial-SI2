"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PetsRegistrationModal } from "@/components/pets-registration-modal"

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

// Sample data
const initialPets: Pet[] = [
  {
    id_mascota: 1,
    especie: "Perro",
    raza: "Golden Retriever",
    nombre: "Max",
    descripcion: "Perro muy amigable y juguetón",
    fecha_nacimiento: "2020-05-15",
    sexo: "Macho",
    id_propietario: 1,
    id_residente: null,
  },
  {
    id_mascota: 2,
    especie: "Gato",
    raza: "Siamés",
    nombre: "Luna",
    descripcion: "Gata tranquila y cariñosa",
    fecha_nacimiento: "2021-08-22",
    sexo: "Hembra",
    id_propietario: null,
    id_residente: 1,
  },
  {
    id_mascota: 3,
    especie: "Perro",
    raza: "Bulldog Francés",
    nombre: "Rocky",
    descripcion: "Perro pequeño pero valiente",
    fecha_nacimiento: "2019-12-10",
    sexo: "Macho",
    id_propietario: 2,
    id_residente: null,
  },
]

export function PetsTable() {
  const [pets, setPets] = useState<Pet[]>(initialPets)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)

  const handleAddPet = (petData: any) => {
    const newPet: Pet = {
      id_mascota: Math.max(...pets.map((p) => p.id_mascota)) + 1,
      ...petData,
    }
    setPets([...pets, newPet])
    setIsModalOpen(false)
  }

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet)
    setIsModalOpen(true)
  }

  const handleUpdatePet = (petData: any) => {
    if (editingPet) {
      setPets(pets.map((p) => (p.id_mascota === editingPet.id_mascota ? { ...editingPet, ...petData } : p)))
      setEditingPet(null)
      setIsModalOpen(false)
    }
  }

  const handleDeletePet = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      setPets(pets.filter((p) => p.id_mascota !== id))
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPet(null)
  }

  const getOwnerType = (pet: Pet) => {
    if (pet.id_propietario) return "Propietario"
    if (pet.id_residente) return "Residente"
    return "Sin asignar"
  }

  const getOwnerBadgeVariant = (pet: Pet) => {
    if (pet.id_propietario) return "default"
    if (pet.id_residente) return "secondary"
    return "destructive"
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Mascotas</CardTitle>
            <CardDescription>Gestión de mascotas del condominio</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Mascota
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Especie</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Fecha Nac.</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>ID Prop.</TableHead>
                <TableHead>ID Res.</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet.id_mascota}>
                  <TableCell className="font-medium">{pet.id_mascota}</TableCell>
                  <TableCell>{pet.nombre}</TableCell>
                  <TableCell>{pet.especie}</TableCell>
                  <TableCell>{pet.raza}</TableCell>
                  <TableCell>
                    <Badge variant={pet.sexo === "Macho" ? "default" : "secondary"}>{pet.sexo}</Badge>
                  </TableCell>
                  <TableCell>{pet.fecha_nacimiento}</TableCell>
                  <TableCell>
                    <Badge variant={getOwnerBadgeVariant(pet)}>{getOwnerType(pet)}</Badge>
                  </TableCell>
                  <TableCell>{pet.id_propietario || "-"}</TableCell>
                  <TableCell>{pet.id_residente || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditPet(pet)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePet(pet.id_mascota)}
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
        </CardContent>
      </Card>

      <PetsRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingPet ? handleUpdatePet : handleAddPet}
        editingPet={editingPet}
      />
    </>
  )
}
