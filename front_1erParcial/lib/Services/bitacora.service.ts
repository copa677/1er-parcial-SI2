import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/bitacora"

export interface Bitacora {
  id_bitacora?: number
  ip: string
  fecha_hora: string
  descripcion: string
}

// 📋 Listar todas las bitácoras
export async function getAllBitacoras(): Promise<Bitacora[]> {
  const res = await axios.get(`${API}/listar`)
  return res.data
}

// 📝 Registrar una nueva bitácora
export async function registrarBitacora(data: Bitacora) {
  const res = await axios.post(`${API}/registrar`, data)
  return res.data
}

// 🌐 Obtener la IP pública del usuario
export async function getUserIP(): Promise<string> {
  try {
    // Usamos un servicio externo gratuito
    const res = await axios.get("https://api.ipify.org?format=json")
    return res.data.ip
  } catch (error) {
    console.error("Error al obtener la IP del usuario:", error)
    return "0.0.0.0"
  }
}

// ⏱️ Obtener la fecha y hora actual en ISO
export function getUserDateTime(): string {
  return new Date().toLocaleString()
}

function obtenerresultado(){

}