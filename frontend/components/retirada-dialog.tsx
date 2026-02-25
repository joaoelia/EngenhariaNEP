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
  id: number
  nome: string
  part_number: string
  quantidade: number
  fornecedor: string
  local_estoque: string
}

interface RetiradaDialogProps {
  consumiveis: Consumivel[]
  children: React.ReactNode
  tipo?: "consumivel" | "materia-prima" | "peca"
  onRetiradaAdded?: () => void
}

export function RetiradaDialog({ consumiveis, children, tipo = "consumivel", onRetiradaAdded }: RetiradaDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    itemId: "",
    quantidade: "",
    pessoa: "",
    data: new Date().toISOString().split("T")[0],
  })

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

  const getTipoItemAPI = () => {
    switch (tipo) {
      case "materia-prima":
        return "materia-prima"
      case "peca":
        return "peca"
      default:
        return "consumivel"
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      itemId: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!formData.itemId) {
        throw new Error("Selecione um item")
      }

      const token = localStorage.getItem("jwt_token")
      if (!token) {
        throw new Error("Token não encontrado. Por favor, faça login novamente.")
      }

      const response = await fetch("http://localhost:8080/api/retiradas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo_item: getTipoItemAPI(),
          item_id: parseInt(formData.itemId),
          item_nome: consumiveis.find((c) => String(c.id) === formData.itemId)?.nome || "",
          quantidade: parseFloat(formData.quantidade),
          pessoa: formData.pessoa,
          data: formData.data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao registrar retirada")
      }

      // Reset form
      setFormData({
        itemId: "",
        quantidade: "",
        pessoa: "",
        data: new Date().toISOString().split("T")[0],
      })

      setOpen(false)

      // Chamar callback para atualizar lista
      if (onRetiradaAdded) {
        onRetiradaAdded()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="item">Item *</Label>
            <Select value={formData.itemId} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o item" />
              </SelectTrigger>
              <SelectContent>
                {consumiveis.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.nome} - {item.part_number} (Disponível: {item.quantidade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade *</Label>
            <Input
              id="quantidade"
              name="quantidade"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0"
              value={formData.quantidade}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pessoa">Pessoa que Retirou *</Label>
            <Input
              id="pessoa"
              name="pessoa"
              required
              placeholder="Nome completo"
              value={formData.pessoa}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input
              id="data"
              name="data"
              type="date"
              required
              value={formData.data}
              onChange={handleChange}
              disabled={isLoading}
            />
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
