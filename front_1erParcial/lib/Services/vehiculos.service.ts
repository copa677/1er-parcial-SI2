import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

export interface Vehiculo {
  id_vehiculo?: number  // opcional al registrar
  placa: string
  marca: string
  modelo: string
  color: string
  propietario_vehiculo: string
}

// 📋 Obtener todos los vehículos
export async function getAllVehiculos(): Promise<Vehiculo[]> {
  const response = await axios.get(`${API}/vehiculos/listar_vehiculos`)
  return response.data
}

// 📥 Registrar un nuevo vehículo
export async function registrarVehiculo(data: Omit<Vehiculo, "id_vehiculo">): Promise<Vehiculo> {
  const response = await axios.post(`${API}/vehiculos/registrar_vehiculo`, data)
  return response.data
}

// ✏️ Actualizar un vehículo
export async function actualizarVehiculo(id: number, data: Omit<Vehiculo, "id_vehiculo">): Promise<Vehiculo> {
  const response = await axios.put(`${API}/vehiculos/actualizar_vehiculo/${id}`, data)
  return response.data
}

// 🗑️ Eliminar un vehículo
export async function eliminarVehiculo(id: number): Promise<void> {
  await axios.delete(`${API}/vehiculos/eliminar_vehiculo/${id}`)
}
