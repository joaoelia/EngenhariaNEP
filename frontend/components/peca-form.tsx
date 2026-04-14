"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PecaFormProps {
  initialData?: {
    id: string
    codigo_peca: string
    descricao: string
    numero_serie?: string
    numero_desenho: string
    aeronave_instalada?: string
    quantidade_produzida?: number
    estoque_minimo?: number
    estoque_maximo?: number
    relatorio_inspecao?: string
    fotos?: string
  }
}

export function PecaForm({ initialData }: PecaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!initialData
  const [isLoading, setIsLoading] = useState(false)
  const [relatorioInspecao, setRelatorioInspecao] = useState<File | null>(null)
  const [fotos, setFotos] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formElement = e.currentTarget
      const codigoPeca = (formElement.querySelector("#partnumber") as HTMLInputElement)?.value
      const numeroSerie = (formElement.querySelector("#numero_serie") as HTMLInputElement)?.value
      const descricao = (formElement.querySelector("#descricao") as HTMLTextAreaElement)?.value
      const aeronaveInstalada = (formElement.querySelector("#aeronave_instalada") as HTMLInputElement)?.value
      const estoqueMinimo = (formElement.querySelector("#estoque_minimo") as HTMLInputElement)?.value
      const estoqueMaximo = (formElement.querySelector("#estoque_maximo") as HTMLInputElement)?.value
      const quantidadeProduzida = (formElement.querySelector("#quantidade_produzida") as HTMLInputElement)?.value

      if (!codigoPeca || !numeroSerie || !descricao || !quantidadeProduzida) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      const quantidadeInt = parseInt(quantidadeProduzida, 10)
      if (isNaN(quantidadeInt) || quantidadeInt < 1) {
        throw new Error("Quantidade deve ser um número inteiro maior que zero")
      }

      if (estoqueMinimo && estoqueMaximo && Number(estoqueMinimo) > Number(estoqueMaximo)) {
        throw new Error("Estoque mínimo não pode ser maior que o estoque máximo")
      }

      const token = localStorage.getItem("jwt_token")
      if (!token) {
        throw new Error("Token não encontrado. Por favor, faça login novamente.")
      }

      if (!isEditing && !relatorioInspecao) {
        throw new Error("Anexe o relatório de inspeção")
      }

      const formData = new FormData()
      formData.append("part_number", codigoPeca)
      formData.append("numero_serie", numeroSerie)
      formData.append("descricao", descricao)
      if (aeronaveInstalada) {
        formData.append("aeronave_instalada", aeronaveInstalada)
      }
      if (estoqueMinimo) {
        formData.append("estoque_minimo", estoqueMinimo)
      }
      if (estoqueMaximo) {
        formData.append("estoque_maximo", estoqueMaximo)
      }
      formData.append("quantidade_produzida", String(quantidadeInt))
      if (relatorioInspecao) {
        formData.append("relatorio_inspecao", relatorioInspecao)
      }
      fotos.forEach((foto) => formData.append("fotos", foto))

      const url = isEditing ? `http://localhost:8080/api/pecas/${initialData.id}` : "http://localhost:8080/api/pecas"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao salvar peça")
      }

      router.push("/dashboard/pecas")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar peça"
      toast({
        title: "Erro",
        description: "Falha ao salvar. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRelatorioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRelatorioInspecao(e.target.files[0])
    }
  }

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos([...fotos, ...Array.from(e.target.files)])
    }
  }

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Peça Fabricada" : "Informações da Peça Fabricada"}</CardTitle>
        <CardDescription>Campos marcados com * são obrigatórios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partnumber">Part Number *</Label>
              <Input 
                id="partnumber" 
                name="partnumber" 
                required 
                placeholder="Ex: PN-12345"
                defaultValue={initialData?.codigo_peca || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_serie">Número de Série *</Label>
              <Input 
                id="numero_serie" 
                name="numero_serie" 
                required 
                placeholder="Ex: SN-001"
                defaultValue={initialData?.numero_serie || ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                name="descricao"
                required
                placeholder="Descrição detalhada da peça fabricada"
                rows={3}
                defaultValue={initialData?.descricao || ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="aeronave_instalada">Aeronave Instalada (Opcional)</Label>
              <Input 
                id="aeronave_instalada" 
                name="aeronave_instalada" 
                placeholder="Ex: Boeing 737-800"
                defaultValue={initialData?.aeronave_instalada || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade_produzida">Quantidade *</Label>
              <Input
                id="quantidade_produzida"
                name="quantidade_produzida"
                type="number"
                min={1}
                step="1"
                required
                placeholder="0"
                defaultValue={initialData?.quantidade_produzida?.toString() || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                name="estoque_minimo"
                type="number"
                min={0}
                step="1"
                placeholder="0"
                defaultValue={initialData?.estoque_minimo?.toString() || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_maximo">Estoque Máximo</Label>
              <Input
                id="estoque_maximo"
                name="estoque_maximo"
                type="number"
                min={0}
                step="1"
                placeholder="0"
                defaultValue={initialData?.estoque_maximo?.toString() || ""}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Relatório de Inspeção {!isEditing && "*"}
            </h3>
            <div className="space-y-2">
              <Label htmlFor="relatorio_inspecao" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Clique para {isEditing ? "atualizar o" : "selecionar o"} relatório de inspeção</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX</p>
                  </div>
                </div>
              </Label>
              <Input
                id="relatorio_inspecao"
                name="relatorio_inspecao"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleRelatorioChange}
                className="hidden"
                required={!isEditing}
              />
              {relatorioInspecao && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm truncate">{relatorioInspecao.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRelatorioInspecao(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {isEditing && initialData?.relatorio_inspecao && !relatorioInspecao && (
                <p className="text-sm text-muted-foreground">Arquivo atual: {initialData.relatorio_inspecao}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fotos da Peça</h3>
            <div className="space-y-2">
              <Label htmlFor="fotos" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Clique para adicionar fotos</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, JPEG - Múltiplas fotos permitidas</p>
                  </div>
                </div>
              </Label>
              <Input
                id="fotos"
                name="fotos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFotosChange}
                className="hidden"
              />
              {fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {fotos.map((foto, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg border-2 border-muted overflow-hidden">
                        <img
                          src={URL.createObjectURL(foto) || "/placeholder.svg"}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFoto(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{foto.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
              {isLoading ? (isEditing ? "Atualizando..." : "Salvando...") : (isEditing ? "Atualizar Peça" : "Salvar Peça")}
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
