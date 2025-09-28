"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/Services/usuarios.service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { registrarBitacora, getUserIP, getUserDateTime } from "@/lib/Services/bitacora.service"


interface LoginFormProps {
  onLogin?: () => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const user = await login(username, password)
      console.log("Login correcto:", user.username)
      // ✅ Guardar en la bitácora
      const ip = await getUserIP()
      const fecha_hora = getUserDateTime()
      await registrarBitacora({
        username: user.username,
        ip,
        fecha_hora,
        accion: "Inicio de sesión",
        descripcion: "El usuario accedió al sistema desde el portal de login"

      })
      setSuccess("Inicio de sesión exitoso 🎉 Redirigiendo...")

      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err) {
      setError("Usuario o contraseña incorrectos ❌")
      console.error("Login fallido:", err)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Image
              src="/condominium-logo.png"
              alt="Condominium Logo"
              width={156}
              height={156}
              className="rounded-lg shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif-display text-4xl font-semibold text-foreground tracking-tight">
              Portal Residencial
            </h1>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-serif-display text-center text-card-foreground">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Nombre de Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 bg-input border-border/50 focus:border-primary focus:ring-primary/20 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-input border-border/50 focus:border-primary focus:ring-primary/20 transition-colors"
                />
              </div>
              {error && (
                <div className="w-full text-sm text-red-600 bg-red-100 border border-red-300 rounded-md px-4 py-2 text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="w-full text-sm text-green-700 bg-green-100 border border-green-300 rounded-md px-4 py-2 text-center">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
              {error && <p className="text-center text-sm text-red-500">{error}</p>}
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 Portal Residencial. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
