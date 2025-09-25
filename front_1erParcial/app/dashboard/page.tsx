"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isTokenExpired, getUsuario } from "@/lib/Services/usuarios.service"
import { Dashboard } from "@/components/dashboard"

export default function DashboardPage() {
  const router = useRouter()

  // 🔒 Redirigir al login si no hay token o expiró
  useEffect(() => {
    if (isTokenExpired()) {
      router.push("/") // Redirige al login
    }
  }, [])

  const user = getUsuario()

    return <Dashboard />}
