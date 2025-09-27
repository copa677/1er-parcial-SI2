import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ✅ Interface de un área común
export interface AreaComun {
  id_area: number
  nombre: string
  descripcion?: string
  tipo_area: string
  ubicacion: string
  capacidad_maxima: number
  hora_apertura: string
  hora_cierre: string
  estado: string
  costo_hora: number
  requiere_reserva: boolean
  tiempo_max_reserva: number
}

// ✅ Interface para registrar/editar (sin id_area)
export interface AreaComunRegister {
  nombre: string
  descripcion?: string
  tipo_area: string
  ubicacion: string
  capacidad_maxima: number
  hora_apertura: string
  hora_cierre: string
  estado: string
  costo_hora: number
  requiere_reserva: boolean
  tiempo_max_reserva: number
}

// 📌 Listar todas las áreas comunes
export async function getAllAreasComunes(): Promise<AreaComun[]> {
  const response = await axios.get(`${API_URL}/areas_comunes/listar`)
  return response.data
}

// 📌 Registrar nueva área común
export async function registrarAreaComun(data: AreaComunRegister): Promise<void> {
  await axios.post(`${API_URL}/areas_comunes/registrar`, data)
}

// 📌 Editar área común
export async function editarAreaComun(id: number, data: AreaComunRegister): Promise<void> {
  await axios.put(`${API_URL}/areas_comunes/editar/${id}`, data)
}

// 📌 Eliminar área común
export async function eliminarAreaComun(id: number): Promise<void> {
  await axios.delete(`${API_URL}/areas_comunes/eliminar/${id}`)
}
