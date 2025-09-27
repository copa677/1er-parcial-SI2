import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

// 📌 Interfaces según tu serializer y tabla
export interface Propiedad {
  id_propiedad: number   
  tipo_propiedad: string
  numero: string
  direccion: string
  metros_cuadrados: number
  estado: "Activo" | "Eliminado"
  id_propietario: number
}

export interface PropiedadRegister {
  tipo_propiedad: string
  numero: string
  direccion: string
  metros_cuadrados: number
  estado: string
  nombre_propietario: string
}

// 📋 Obtener todas las propiedades
export async function getAllPropiedades(): Promise<Propiedad[]> {
  const response = await axios.get(`${API}/propiedades/listar_propiedades`)
  return response.data
}

// 📥 Registrar propiedad
export async function registrarPropiedad(data: PropiedadRegister): Promise<Propiedad> {
  const response = await axios.post(`${API}/propiedades/registrar_propiedad`, data)
  return response.data
}

// ✏️ Actualizar propiedad
export async function actualizarPropiedad(id: number, data: PropiedadRegister): Promise<Propiedad> {
  const response = await axios.put(`${API}/propiedades/actualizar_propiedad/${id}`, data)
  return response.data
}

// 🗑️ Eliminar propiedad
export async function eliminarPropiedad(id: number): Promise<void> {
  await axios.delete(`${API}/propiedades/eliminar_propiedad/${id}`)
}
