"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCircle } from "lucide-react"
import { API_CONFIG, buildApiUrl, getAuthHeaders, getAuthToken } from "@/lib/api-config"

interface ConsumivelApiItem {
  id: number
  nome: string
  part_number: string
  quantidade: number
  fornecedor: string
  local_estoque: string
}

type DuplicateReason = "nome" | "part_number" | "ambos"

export function ConsumivelForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [duplicateItem, setDuplicateItem] = useState<ConsumivelApiItem | null>(null)
  const [duplicateReason, setDuplicateReason] = useState<DuplicateReason | null>(null)
  const [pendingPayload, setPendingPayload] = useState<{
    nome: string
    part_number: string
    quantidade: number
    estoque_minimo: number | null
    estoque_maximo: number | null
    fornecedor: string
    local_estoque: string
  } | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    partNumber: "",
    quantidade: "",
    estoqueMinimo: "",
    estoqueMaximo: "",
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

  const normalizeText = (value: string) => value.trim().toLowerCase()

  const createConsumivel = async (payload: {
    nome: string
    part_number: string
    quantidade: number
    estoque_minimo: number | null
    estoque_maximo: number | null
    fornecedor: string
    local_estoque: string
  }) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CONSUMIVEIS.CREATE), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao salvar consumível")
    }
  }

  const sumQuantidadeNoExistente = async () => {
    if (!duplicateItem || !pendingPayload) {
      return
    }

    const quantidadeAtualizada = duplicateItem.quantidade + pendingPayload.quantidade
    const response = await fetch(
      buildApiUrl(`/consumiveis/${duplicateItem.id}/quantidade?quantidade=${quantidadeAtualizada}`),
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao somar quantidade no item existente")
    }
  }

  const handleConfirmSum = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await sumQuantidadeNoExistente()
      router.push("/dashboard/consumiveis")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
      setDuplicateDialogOpen(false)
      setPendingPayload(null)
      setDuplicateItem(null)
      setDuplicateReason(null)
    }
  }

  const handleConfirmSeparate = async () => {
    if (!pendingPayload) {
      return
    }

    if (duplicateReason === "part_number" || duplicateReason === "ambos") {
      setError(
        "Este Part Number já está cadastrado. Para registrar separadamente, informe um Part Number diferente e salve novamente.",
      )
      setDuplicateDialogOpen(false)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await createConsumivel(pendingPayload)
      router.push("/dashboard/consumiveis")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
      setDuplicateDialogOpen(false)
      setPendingPayload(null)
      setDuplicateItem(null)
      setDuplicateReason(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error("Token não encontrado. Por favor, faça login novamente.")
      }

      const payload = {
        nome: formData.nome,
        part_number: formData.partNumber,
        quantidade: parseInt(formData.quantidade),
        estoque_minimo: formData.estoqueMinimo ? parseInt(formData.estoqueMinimo) : null,
        estoque_maximo: formData.estoqueMaximo ? parseInt(formData.estoqueMaximo) : null,
        fornecedor: formData.fornecedor,
        local_estoque: formData.localEstoque,
      }

      if (!Number.isInteger(payload.quantidade) || payload.quantidade <= 0) {
        throw new Error("Quantidade deve ser um número inteiro maior que zero")
      }

      if (payload.estoque_minimo !== null && payload.estoque_maximo !== null && payload.estoque_minimo > payload.estoque_maximo) {
        throw new Error("Estoque mínimo não pode ser maior que o estoque máximo")
      }

      const listResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CONSUMIVEIS.LIST), {
        headers: getAuthHeaders(),
      })

      if (!listResponse.ok) {
        throw new Error("Erro ao validar consumíveis já cadastrados")
      }

      const consumiveis: ConsumivelApiItem[] = await listResponse.json()

      const samePartNumber = consumiveis.find(
        (item) => normalizeText(item.part_number) === normalizeText(payload.part_number),
      )

      const sameNome = consumiveis.find((item) => normalizeText(item.nome) === normalizeText(payload.nome))

      const duplicate = samePartNumber ?? sameNome

      if (duplicate) {
        const reason: DuplicateReason =
          samePartNumber && sameNome ? "ambos" : samePartNumber ? "part_number" : "nome"

        setPendingPayload(payload)
        setDuplicateItem(duplicate)
        setDuplicateReason(reason)
        setDuplicateDialogOpen(true)
        return
      }

      await createConsumivel(payload)

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
                min="1"
                required
                placeholder="0"
                value={formData.quantidade}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <Input
                id="estoqueMinimo"
                name="estoqueMinimo"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={formData.estoqueMinimo}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoqueMaximo">Estoque Máximo</Label>
              <Input
                id="estoqueMaximo"
                name="estoqueMaximo"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={formData.estoqueMaximo}
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

      <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <AlertDialogTitle>Item já cadastrado no estoque</AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="sr-only">
            Encontramos um item com mesmo nome ou part number. Escolha entre somar quantidade ao cadastro existente ou registrar separadamente.
          </AlertDialogDescription>

          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              {duplicateReason === "ambos" &&
                "Este nome e este Part Number já estão registrados. Você pode somar ao item existente."}
              {duplicateReason === "part_number" &&
                "Este Part Number já está registrado. Você pode somar ao item existente."}
              {duplicateReason === "nome" &&
                "Este nome já está registrado. Você pode somar a quantidade no item atual ou registrar separado."}
            </p>

            {duplicateItem && (
              <div className="rounded-md bg-slate-100 p-3">
                <p className="font-semibold text-slate-900">{duplicateItem.nome}</p>
                <p className="text-slate-600">Part Number: {duplicateItem.part_number}</p>
                <p className="text-slate-600">Quantidade atual: {duplicateItem.quantidade}</p>
              </div>
            )}

            <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-blue-600">
                  ?
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-blue-900">Como funciona cada opção</p>
                  <p className="text-blue-800">
                    <strong>Somar quantidade:</strong> atualiza o item já existente no estoque.
                  </p>
                  <p className="text-blue-800">
                    <strong>Registrar separado:</strong> cria uma nova linha independente no estoque.
                    {duplicateReason !== "nome" &&
                      " Para este caso, é necessário informar um Part Number diferente para separar o cadastro."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={handleConfirmSeparate}
              disabled={isLoading}
            >
              Registrar Separado
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirmSum} disabled={isLoading}>
              Somar Quantidade
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
