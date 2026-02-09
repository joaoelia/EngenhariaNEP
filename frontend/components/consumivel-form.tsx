"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ConsumivelForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    router.push("/dashboard/consumiveis")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Consumível</CardTitle>
        <CardDescription>Campos marcados com * são obrigatórios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" name="nome" required placeholder="Nome do consumível" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="part_number">Part Number *</Label>
              <Input id="part_number" name="part_number" required placeholder="Ex: PN-12345" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input id="quantidade" name="quantidade" type="number" step="1" required placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input id="fornecedor" name="fornecedor" required placeholder="Nome do fornecedor" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="local_estoque">Local no Estoque *</Label>
              <Input id="local_estoque" name="local_estoque" required placeholder="Ex: Estoque A - Prateleira 3" />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Consumível"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
