"use client"

import { Users, Building, LogOut, UserCog, UserCheck, Crown, Heart, MapPin, UserPlus, Car, Scale } from "lucide-react"
import Image from "next/image"
import { logout } from "@/lib/Services/usuarios.service"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const items = [
  {
    title: "Residentes",
    url: "#",
    icon: Users,
    key: "residentes",
  },
  {
    title: "Usuarios",
    url: "#",
    icon: UserCog,
    key: "usuarios",
  },
  {
    title: "Personal",
    url: "#",
    icon: UserCheck,
    key: "personal",
  },
  {
    title: "Propietarios",
    url: "#",
    icon: Crown,
    key: "propietarios",
  },
  {
    title: "Mascotas",
    url: "#",
    icon: Heart,
    key: "mascotas",
  },
  {
    title: "Areas Comunes",
    url: "#",
    icon: MapPin,
    key: "areas-comunes",
  },
  {
    title: "Propiedades",
    url: "#",
    icon: Building,
    key: "propiedades",
  },
  {
    title: "Visitantes",
    url: "#",
    icon: UserPlus,
    key: "visitantes",
  },
  {
    title: "Vehículos",
    url: "#",
    icon: Car,
    key: "vehiculos",
  },
  {
    title: "Reglas",
    url: "#",
    icon: Scale,
    key: "reglas",
  }
]

interface AppSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function AppSidebar({ activeSection = "residentes", onSectionChange }: AppSidebarProps) {
  const router = useRouter()
  const handleLogout = () => {
    logout()
    router.push("/") // Redirigir al login
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center gap-3 px-2">
          <Image src="/condominium-logo.png" alt="Condominium Logo" width={52} height={52} className="rounded-lg" />
          <div className="flex flex-col">
            <span className="font-serif-display text-lg font-semibold text-foreground">Portal</span>
            <span className="text-sm text-muted-foreground">Residencial</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={activeSection === item.key}>
                    <button onClick={() => onSectionChange?.(item.key)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 pt-4">
        <div className="px-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200 font-medium shadow-sm bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
