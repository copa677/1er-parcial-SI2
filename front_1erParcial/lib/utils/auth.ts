import {jwtDecode} from "jwt-decode"

interface TokenPayload {
  id: number
  username: string
  exp: number
  iat: number
}

export function getUserFromToken(): TokenPayload | null {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    return jwtDecode<TokenPayload>(token)
  } catch (error) {
    console.error("Error decodificando el token", error)
    return null
  }
}
