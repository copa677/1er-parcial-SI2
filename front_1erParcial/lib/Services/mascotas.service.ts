import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ✅ Interfaces
export interface Mascota {
  id_mascota: number
  especie: string
  raza: string
  nombre: string
  descripcion: string
  fecha_nacimiento: string   // formato ISO "YYYY-MM-DD"
  sexo: string
  dueno: string
}

export interface MascotaRegister {
  especie: string
  raza: string
  nombre: string
  descripcion: string
  fecha_nacimiento: string
  sexo: string
  dueno: string
}

// ✅ Obtener todas las mascotas
export async function getAllMascotas(): Promise<Mascota[]> {
  const response = await axios.get(`${API_URL}/mascotas/listar_mascotas`)
  return response.data
}

// ✅ Registrar nueva mascota
export async function registrarMascota(data: MascotaRegister): Promise<Mascota> {
  const response = await axios.post(`${API_URL}/mascotas/registrar_mascota`, data)
  return response.data
}

// ✅ Actualizar mascota existente
export async function actualizarMascota(id: number, data: MascotaRegister): Promise<Mascota> {
  const response = await axios.put(`${API_URL}/mascotas/actualizar_mascota/${id}`, data)
  return response.data
}

// ✅ Eliminar mascota
export async function eliminarMascota(id: number): Promise<void> {
  await axios.delete(`${API_URL}/mascotas/eliminar_mascota/${id}`)
}
