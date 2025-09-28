import axios from "axios"

// URL base del backend
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/avisos/"

// Definir el tipo Aviso (puedes ajustarlo según tus serializers)
export interface Aviso {
  id_aviso?: number
  titulo: string
  mensaje: string
  fecha_envio: string   // formato: YYYY-MM-DD
  hora_envio: string    // formato: HH:MM:SS
  estado: string
  tipo: string          // "Global" | "Individual"
  id_user?: number | null
  username?: string     // solo cuando sea individual
}

// 🔹 Registrar aviso
export const registrarAviso = async (aviso: Aviso) => {
  const response = await axios.post(`${API_URL}registrar/`, aviso)
  return response.data
}

// 🔹 Listar todos los avisos
export const listarAvisos = async () => {
  const response = await axios.get(`${API_URL}listar/`)
  return response.data
}

// 🔹 Listar avisos para un usuario
export const listarAvisosUsuario = async (id_user: number) => {
  const response = await axios.get(`${API_URL}usuario/${id_user}/`)
  return response.data
}

// 🔹 Actualizar un aviso
export const actualizarAviso = async (id_aviso: number, aviso: Aviso) => {
  const response = await axios.put(`${API_URL}actualizar/${id_aviso}/`, aviso)
  return response.data
}

// 🔹 Eliminar un aviso
export const eliminarAviso = async (id_aviso: number) => {
  const response = await axios.delete(`${API_URL}eliminar/${id_aviso}/`)
  return response.data
}
