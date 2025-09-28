import { jwtDecode } from "jwt-decode"

const API = process.env.NEXT_PUBLIC_API_URL

interface LoginResponse {
  token: string
}

interface TokenPayload {
  id: number
  username: string
  exp: number
  iat: number
}

// Login: obtiene el token y lo guarda
export async function login(username: string, password: string): Promise<TokenPayload> {
  const res = await fetch(`${API}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    throw new Error("Usuario o contraseña incorrectos")
  }

  const data: LoginResponse = await res.json()
  const token = data.token

  // Guardar token
  localStorage.setItem("token", token)

  // Decodificar y guardar usuario
  const user = jwtDecode<TokenPayload>(token)
  localStorage.setItem("user", JSON.stringify(user))

  return user
}

// 👤 Obtener usuario actual desde el token
export function getUsuario(): TokenPayload | null {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    return jwtDecode<TokenPayload>(token)
  } catch {
    return null
  }
}

// ⛔ Cerrar sesión
export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// ⏱️ Validar expiración
export function isTokenExpired(): boolean {
  const token = localStorage.getItem("token")
  if (!token) return true

  try {
    const { exp } = jwtDecode<TokenPayload>(token)
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}

// 🔐 Obtener permisos del usuario (opcional)
export async function getPermisos(username: string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API}/usuarios/permisos/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("No se pudieron obtener los permisos")
  }

  return res.json()
}

// Obtener todos los usuarios
export async function getAllUsuarios() {
  const res = await fetch(`${API}/usuarios/obtener_all_usuarios`)

  if (!res.ok) throw new Error("Error al obtener usuarios")

  const data = await res.json()
  console.log("Respuesta del backend:", data)
  return data.usuarios // ✅ solo devolvemos el array
}

// Obtener todo el personal
export async function getAllPersonal() {
  const res = await fetch(`${API}/usuarios/obtener_all_personal`)
  if (!res.ok) throw new Error("Error al obtener personal")
  const data = await res.json()
  console.log("Respuesta del backend:", data)
  return data.personal // ✅ solo devolvemos el array
}

// Obtener todos los propietarios
export async function getAllPropietarios() {
  const res = await fetch(`${API}/usuarios/obtener_all_propietarios`)
  if (!res.ok) throw new Error("Error al obtener propietarios")
  const data = await res.json()
  return data.propietarios // ✅ solo devolvemos el array
}

// Obtener todos los residentes
export async function getAllResidentes() {
  const res = await fetch(`${API}/usuarios/obtener_all_residentes`)
  if (!res.ok) throw new Error("Error al obtener residentes")
  const data = await res.json()
  return data.residentes // ✅ solo devolvemos el array
}

// 📌 Registrar Personal
export async function registrarPersonal(data: any) {
  const res = await fetch(`${API}/usuarios/registrar_personal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al registrar personal")
  }

  return res.json()
}

// 📌 Registrar Propietario
export async function registrarPropietario(data: any) {
  const res = await fetch(`${API}/usuarios/registrar_propietario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al registrar propietario")
  }

  return res.json()
}

// 📌 Registrar Residente
export async function registrarResidente(data: any) {
  const res = await fetch(`${API}/usuarios/registrar_residente`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al registrar residente")
  }

  return res.json()
}


// 📋 Obtener nombres de todos los propietarios
export async function listarNombrePropietarios(): Promise<string[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/listar_nombre_propietarios`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al listar nombres de propietarios")
  }

  const data = await res.json()
  return data.nombres_propietarios
}

// 📋 Obtener nombres de todos los anfitriones (propietarios + residentes)
export async function listarNombresAnfitriones(): Promise<{ nombre_completo: string }[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/listar_nombres_anfitriones`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al listar nombres de anfitriones")
  }

  return res.json()
}

// 📌 Actualizar Personal
export async function actualizarPersonal(id_personal: number, data: any) {
  const res = await fetch(`${API}/usuarios/actualizar_personal/${id_personal}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al actualizar personal")
  }

  return res.json()
}

// 📌 Actualizar Propietario
export async function actualizarPropietario(id_propietario: number, data: any) {
  const res = await fetch(`${API}/usuarios/actualizar_propietario/${id_propietario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al actualizar propietario")
  }

  return res.json()
}

// 📌 Actualizar Residente
export async function actualizarResidente(id_residente: number, data: any) {
  const res = await fetch(`${API}/usuarios/actualizar_residente/${id_residente}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al actualizar residente")
  }

  return res.json()
}
