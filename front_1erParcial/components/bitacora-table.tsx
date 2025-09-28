"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { getAllBitacoras, Bitacora } from "@/lib/Services/bitacora.service"

export function BitacoraTable() {
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔍 Filtros
  const [usuarioFilter, setUsuarioFilter] = useState("")
  const [accionFilter, setAccionFilter] = useState("")
  const [fechaFilter, setFechaFilter] = useState("")

  // 🔄 Cargar bitácoras desde API
  const fetchBitacoras = async () => {
    try {
      setLoading(true)
      const data = await getAllBitacoras()
      setBitacoras(data)
    } catch (err: any) {
      setError(err.message || "Error al cargar la bitácora")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBitacoras()
  }, [])

  // 📌 Filtrado
  const filteredBitacoras = bitacoras.filter((b) => {
    const matchUsuario = b.username.toLowerCase().includes(usuarioFilter.toLowerCase())
    const matchAccion = b.accion.toLowerCase().includes(accionFilter.toLowerCase())
    const matchFecha = fechaFilter ? b.fecha_hora.startsWith(fechaFilter) : true
    return matchUsuario && matchAccion && matchFecha
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Bitácora del Sistema</CardTitle>
            <CardDescription>Registro de todas las acciones realizadas</CardDescription>
          </div>
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Filtrar por usuario"
              value={usuarioFilter}
              onChange={(e) => setUsuarioFilter(e.target.value)}
              className="w-40"
            />
            <Input
              placeholder="Filtrar por acción"
              value={accionFilter}
              onChange={(e) => setAccionFilter(e.target.value)}
              className="w-40"
            />
            <Input
              type="date"
              value={fechaFilter}
              onChange={(e) => setFechaFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Cargando bitácora...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBitacoras.length > 0 ? (
                  filteredBitacoras.map((b) => (
                    <TableRow key={b.id_bitacora}>
                      <TableCell>{b.id_bitacora}</TableCell>
                      <TableCell>{b.username}</TableCell>
                      <TableCell>{b.ip}</TableCell>
                      <TableCell>{b.fecha_hora}</TableCell>
                      <TableCell>{b.accion}</TableCell>
                      <TableCell>{b.descripcion}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
