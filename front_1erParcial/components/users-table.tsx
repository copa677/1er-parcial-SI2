"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersEditModal } from "@/components/users-edit-modal"
import { getAllUsuarios } from "@/lib/Services/usuarios.service"

// 🧠 Interfaz esperada desde el backend (sin contraseña)
interface User {
  id_user: number
  username: string
  email: string
  tipo_user: string
  estado: "activo" | "inactivo"
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const API = process.env.NEXT_PUBLIC_API_URL

  // 📡 Cargar usuarios desde la API
  useEffect(() => {
  const fetchUsuarios = async () => {
    try {
      const usuarios = await getAllUsuarios()
      setUsers(usuarios)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchUsuarios()
}, [])


  // ✏️ Editar usuario
  const handleEdit = (userId: number) => {
    const user = users.find((u) => u.id_user === userId)
    if (user) {
      setSelectedUser(user)
      setIsEditModalOpen(true)
    }
  }

  // 🗑️ Eliminar usuario (local, no backend aún)
  const handleDelete = (userId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id_user !== userId))
    }
  }

  // ✅ Actualizar usuario editado
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id_user === updatedUser.id_user ? updatedUser : user)))
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }

  const getStatusBadge = (estado: string) => {
    return <Badge variant={estado.toLowerCase() === "activo" ? "default" : "secondary"}>{estado}</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Administra los usuarios del sistema del condominio</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre de Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo de Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id_user}>
                    <TableCell className="font-medium">{user.id_user}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.tipo_user}</TableCell>
                    <TableCell>{getStatusBadge(user.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user.id_user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id_user)}
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

      <UsersEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />
    </>
  )
}
