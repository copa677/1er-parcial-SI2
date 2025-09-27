const API = process.env.NEXT_PUBLIC_API_URL

export interface Regla {
  id_regla: number
  descripcion: string
  monto: number
}

// 📋 Listar todas las reglas
export async function listarReglas(): Promise<Regla[]> {
  const res = await fetch(`${API}/reglas/listar_reglas`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al listar reglas")
  }

  const data = await res.json()
  return data // Asegúrate que el backend devuelva así
}

// ➕ Registrar una nueva regla
export async function registrarRegla(data: any) {
  const res = await fetch(`${API}/reglas/registrar_regla`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al registrar regla")
  }

  return res.json()
}

// ✏️ Editar una regla existente
export async function editarRegla(id_regla: number, data: any) {
  const res = await fetch(`${API}/reglas/editar_regla/${id_regla}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al editar regla")
  }

  return res.json()
}

// ❌ Eliminar una regla por su ID
export async function eliminarRegla(id_regla: number) {
  const res = await fetch(`${API}/reglas/eliminar_regla/${id_regla}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al eliminar regla")
  }

  return res.json()
}
