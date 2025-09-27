import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface Visitor {
  id_visitante: number
  nombre_completo: string
  telefono: string
  fecha_agregacion: string
  fecha_visita: string
  estado: string
  nombre_anfitrion: string
}

export interface VisitorRegister {
  nombre_completo: string
  telefono: string
  fecha_visita: string
  estado: string
  nombre_anfitrion: string
}

// ✅ GET - listar visitantes
export async function getAllVisitantes(): Promise<Visitor[]> {
  const response = await axios.get(`${API_URL}/visitantes/listar_visitantes`)
  return response.data
}

// ✅ POST - registrar visitante
export async function registrarVisitante(data: VisitorRegister): Promise<Visitor> {
  const response = await axios.post(`${API_URL}/visitantes/registrar_visitante`, data)
  return response.data
}

// ✅ PUT - actualizar visitante
export async function actualizarVisitante(id: number, data: VisitorRegister): Promise<Visitor> {
  const response = await axios.put(`${API_URL}/visitantes/actualizar_visitante/${id}`, data)
  return response.data
}

// ✅ DELETE - eliminar visitante
export async function eliminarVisitante(id: number): Promise<void> {
  await axios.delete(`${API_URL}/visitantes/elimnar_visitante/${id}`)
}
