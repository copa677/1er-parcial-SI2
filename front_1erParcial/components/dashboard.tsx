"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { UsersTable } from "@/components/users-table"
import { StaffTable } from "@/components/staff-table"
import { OwnersTable } from "@/components/owners-table"
import { ResidentsTable } from "@/components/residents-table"
import { PetsTable } from "@/components/pets-table"
import { CommonAreasTable } from "@/components/common-areas-table"
import { PropertiesTable } from "@/components/properties-table"
import { VisitorsTable } from "@/components/visitors-table"
import { VehiclesTable } from "@/components/vehicles-table"

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("residentes")

  const renderContent = () => {
    switch (activeSection) {
      case "usuarios":
        return <UsersTable />
      case "personal":
        return <StaffTable />
      case "propietarios":
        return <OwnersTable />
      case "residentes":
        return <ResidentsTable />
      case "mascotas":
        return <PetsTable />
      case "areas-comunes":
        return <CommonAreasTable />
      case "propiedades":
        return <PropertiesTable />
      case "visitantes":
        return <VisitorsTable />
      case "vehiculos":
        return <VehiclesTable />
      default:
        return <ResidentsTable />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "usuarios":
        return "Usuarios"
      case "personal":
        return "Personal"
      case "propietarios":
        return "Propietarios"
      case "residentes":
        return "Residentes"
      case "mascotas":
        return "Mascotas"
      case "areas-comunes":
        return "Areas Comunes"
      case "propiedades":
        return "Propiedades"
      case "visitantes":
        return "Visitantes"
      case "vehiculos":
        return "Vehículos"
      default:
        return "Residentes"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-serif-display text-xl font-semibold text-foreground">{getSectionTitle()}</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
