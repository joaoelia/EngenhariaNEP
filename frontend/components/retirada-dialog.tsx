"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Consumivel {
  id: string
  nome: string
  part_number: string
  quantidade: number
}

interface RetiradaDialogProps {
  consumiveis: Consumivel[]
  children: React.ReactNode
  tipo?: "consumivel" | "materia-prima" | "peca"
}

export function RetiradaDialog({ consumiveis, children, tipo = "consumivel" }: RetiradaDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getTituloTipo = () => {
    switch (tipo) {
      case "materia-prima":
        return "Matéria-Prima"
      case "peca":
        return "Peça"
      default:
        return "Consumível"
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Retirada</DialogTitle>
          <DialogDescription>Preencha os dados da retirada de {getTituloTipo().toLowerCase()}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item *</Label>
            <Select name="item" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o item" />
              </SelectTrigger>
              <SelectContent>
                {consumiveis.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.nome} - {item.part_number} (Disponível: {item.quantidade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade *</Label>
            <Input id="quantidade" name="quantidade" type="number" step="1" min="1" required placeholder="0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pessoa">Pessoa que Retirou *</Label>
            <Input id="pessoa" name="pessoa" required placeholder="Nome completo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input id="data" name="data" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 flex-1" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar Retirada"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
