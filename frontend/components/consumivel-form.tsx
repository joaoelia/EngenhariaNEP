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
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    partNumber: "",
    quantidade: "",
    fornecedor: "",
    localEstoque: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) {
        throw new Error("Token não encontrado. Por favor, faça login novamente.")
      }

      const response = await fetch("http://localhost:8080/api/consumiveis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formData.nome,
          partNumber: formData.partNumber,
          quantidade: parseInt(formData.quantidade),
          fornecedor: formData.fornecedor,
          localEstoque: formData.localEstoque,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao salvar consumível")
      }

      router.push("/dashboard/consumiveis")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Consumível</CardTitle>
        <CardDescription>Campos marcados com * são obrigatórios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                name="nome"
                required
                placeholder="Nome do consumível"
                value={formData.nome}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partNumber">Part Number *</Label>
              <Input
                id="partNumber"
                name="partNumber"
                required
                placeholder="Ex: PN-12345"
                value={formData.partNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                step="1"
                required
                placeholder="0"
                value={formData.quantidade}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input
                id="fornecedor"
                name="fornecedor"
                required
                placeholder="Nome do fornecedor"
                value={formData.fornecedor}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="localEstoque">Local no Estoque *</Label>
              <Input
                id="localEstoque"
                name="localEstoque"
                required
                placeholder="Ex: Estoque A - Prateleira 3"
                value={formData.localEstoque}
                onChange={handleChange}
                disabled={isLoading}
              />
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
