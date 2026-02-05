"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

export function MateriaPrimaForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [certComposicao, setCertComposicao] = useState<File | null>(null)
  const [relatorioPropriedades, setRelatorioPropriedades] = useState<File | null>(null)
  const [laudoPenetrante, setLaudoPenetrante] = useState<File | null>(null)
  const [notaFiscal, setNotaFiscal] = useState<File | null>(null)
  const [imagens, setImagens] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    router.push("/dashboard/materia-prima")
  }

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    const file = e.target.files?.[0]
    if (file) setter(file)
  }

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImagens((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Matéria-Prima</CardTitle>
        <CardDescription>Campos marcados com * são obrigatórios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" name="nome" required placeholder="Nome da matéria-prima" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input id="quantidade" name="quantidade" type="number" step="0.01" required placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lote">Lote</Label>
              <Input id="lote" name="lote" placeholder="Número do lote" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altura">Altura (mm)</Label>
              <Input id="altura" name="altura" type="number" step="0.01" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="largura">Largura (mm)</Label>
              <Input id="largura" name="largura" type="number" step="0.01" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="espessura">Espessura (mm)</Label>
              <Input id="espessura" name="espessura" type="number" step="0.01" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input id="fornecedor" name="fornecedor" required placeholder="Nome do fornecedor" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_entrada">Data de Entrada/Recepção/Fabricação</Label>
              <Input id="data_entrada" name="data_entrada" type="date" />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Documentos</h3>

            <div className="space-y-2">
              <Label htmlFor="cert_composicao">Certificado de Composição Química (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cert_composicao"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, setCertComposicao)}
                  className="cursor-pointer"
                />
                {certComposicao && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setCertComposicao(null)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {certComposicao && <p className="text-sm text-muted-foreground">Arquivo: {certComposicao.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relatorio_propriedades">Relatório de Propriedades Mecânicas (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="relatorio_propriedades"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, setRelatorioPropriedades)}
                  className="cursor-pointer"
                />
                {relatorioPropriedades && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setRelatorioPropriedades(null)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {relatorioPropriedades && (
                <p className="text-sm text-muted-foreground">Arquivo: {relatorioPropriedades.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="laudo_penetrante">Laudo de Ensaio de Líquido Penetrante (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="laudo_penetrante"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, setLaudoPenetrante)}
                  className="cursor-pointer"
                />
                {laudoPenetrante && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setLaudoPenetrante(null)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {laudoPenetrante && <p className="text-sm text-muted-foreground">Arquivo: {laudoPenetrante.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nota_fiscal">Nota Fiscal *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="nota_fiscal"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, setNotaFiscal)}
                  className="cursor-pointer"
                  required
                />
                {notaFiscal && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotaFiscal(null)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {notaFiscal && <p className="text-sm text-muted-foreground">Arquivo: {notaFiscal.name}</p>}
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Imagens</h3>
            <div className="space-y-2">
              <Label htmlFor="imagens">Carregar Imagens</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="imagens"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                  className="cursor-pointer"
                />
                <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
              {imagens.length > 0 && (
                <div className="grid gap-2 md:grid-cols-3 mt-4">
                  {imagens.map((img, index) => (
                    <div key={index} className="relative rounded-lg border p-2 flex items-center gap-2">
                      <div className="flex-1 truncate">
                        <p className="text-sm truncate">{img.name}</p>
                        <p className="text-xs text-muted-foreground">{(img.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Matéria-Prima"}
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
