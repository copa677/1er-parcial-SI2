"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PetsRegistrationModal } from "@/components/pets-registration-modal"

import {
  getAllMascotas,
  registrarMascota,
  actualizarMascota,
  eliminarMascota,
  Mascota,
} from "@/lib/Services/mascotas.service"

export function PetsTable() {
  const [pets, setPets] = useState<Mascota[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Mascota | null>(null)

  // 🔹 Cargar mascotas al iniciar
  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      setIsLoading(true)
      const data = await getAllMascotas()
      setPets(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar mascotas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPet = async (petData: Omit<Mascota, "id_mascota">) => {
    try {
      await registrarMascota(petData)
      fetchPets()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error al registrar mascota:", error)
    }
  }

  const handleUpdatePet = async (petData: Omit<Mascota, "id_mascota">) => {
    try {
      if (editingPet) {
        await actualizarMascota(editingPet.id_mascota, petData)
        fetchPets()
        setEditingPet(null)
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error al actualizar mascota:", error)
    }
  }

  const handleDeletePet = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      try {
        await eliminarMascota(id)
        fetchPets()
      } catch (error) {
        console.error("Error al eliminar mascota:", error)
      }
    }
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
          {isLoading ? (
            <p className="text-center text-muted-foreground p-4">Cargando mascotas...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Fecha Nac.</TableHead>
                  <TableHead>Dueño</TableHead>
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
                    <TableCell>{pet.dueno}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingPet(pet); setIsModalOpen(true) }}>
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
          )}
        </CardContent>
      </Card>

      <PetsRegistrationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPet(null) }}
        onSubmit={editingPet ? handleUpdatePet : handleAddPet}
        editingPet={editingPet}
      />
    </>
  )
}
