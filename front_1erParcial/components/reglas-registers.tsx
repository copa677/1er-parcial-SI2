"use client"

import { useState } from "react"
import { X } from "lucide-react"
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

interface ReglaFormData {
  descripcion: string
  monto: number | string
}

interface ReglasRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReglaFormData) => void
  editingRule?: ReglaFormData | null
}

export function ReglasRegisterModal({ isOpen, onClose, onSubmit, editingRule }: ReglasRegisterModalProps) {
  const [formData, setFormData] = useState<ReglaFormData>({
    descripcion: "",
    monto: "",
  })

  // Cargar datos si se está editando
  useState(() => {
    if (editingRule) {
      setFormData({
        descripcion: editingRule.descripcion,
        monto: editingRule.monto,
      })
    } else {
      setFormData({ descripcion: "", monto: "" })
    }
  })

  const handleInputChange = (field: keyof ReglaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!editingRule) {
      setFormData({ descripcion: "", monto: "" })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{editingRule ? "Actualizar Regla" : "Registrar Nueva Regla"}</CardTitle>
            <CardDescription>{editingRule ? "Modifica los datos de la regla" : "Crea una nueva regla para la convivencia"}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción de la Regla</Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Ej. No hacer ruido después de las 22:00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monto">Monto a Pagar (Bs)</Label>
              <Input
                id="monto"
                type="number"
                inputMode="decimal"
                pattern="^[0-9]+(\\.[0-9]{1,2})?$"
                value={formData.monto}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="Ej. 50"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingRule ? "Actualizar Regla" : "Registrar Regla"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}