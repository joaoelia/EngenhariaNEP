"use client"

import { useEffect, useState } from "react"
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload, X, Trash2 } from "lucide-react"

type MateriaPrimaData = Record<string, any>

interface MateriaPrimaEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: MateriaPrimaData
  onSave: (formData: FormData) => Promise<void>
}

const adjustDateForDisplay = (dateString?: string) => {
  if (!dateString) return ""
  const dateParts = dateString.split("-")
  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
  dateObj.setDate(dateObj.getDate() - 1)
  return dateObj.toISOString().split("T")[0]
}

const adjustDateForSubmit = (dateString?: string) => {
  if (!dateString) return ""
  const dateParts = dateString.split("-")
  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
  dateObj.setDate(dateObj.getDate() + 1)
  return dateObj.toISOString().split("T")[0]
}

const normalizeFiles = (value: any): string[] => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return []

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean)
        }
      } catch {
        return [trimmed.replace(/^"+|"+$/g, "")]
      }
    }

    return [trimmed.replace(/^"+|"+$/g, "")]
  }

  return []
}

export function MateriaPrimaEditDialog({ open, onOpenChange, data, onSave }: MateriaPrimaEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    quantidade: "",
    estoque_minimo: "",
    estoque_maximo: "",
    lote: "",
    altura: "",
    largura: "",
    espessura: "",
    fornecedor: "",
    data_entrada: "",
  })

  const [certComposicao, setCertComposicao] = useState<File | null>(null)
  const [relatorioPropriedades, setRelatorioPropriedades] = useState<File | null>(null)
  const [laudoPenetrante, setLaudoPenetrante] = useState<File | null>(null)
  const [notaFiscal, setNotaFiscal] = useState<File | null>(null)
  const [imagens, setImagens] = useState<File[]>([])
  const [existingCertComposicao, setExistingCertComposicao] = useState<string | null>(null)
  const [existingRelatorioPropriedades, setExistingRelatorioPropriedades] = useState<string | null>(null)
  const [existingLaudoPenetrante, setExistingLaudoPenetrante] = useState<string | null>(null)
  const [existingNotaFiscal, setExistingNotaFiscal] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [removingType, setRemovingType] = useState<string | null>(null)

  useEffect(() => {
    setFormData({
      nome: data?.descricao || "",
      quantidade: data?.quantidade_estoque?.toString() || "",
      estoque_minimo: data?.estoque_minimo?.toString() || "",
      estoque_maximo: data?.estoque_maximo?.toString() || "",
      lote: data?.lote || "",
      altura: data?.altura?.toString() || "",
      largura: data?.largura?.toString() || "",
      espessura: data?.espessura?.toString() || "",
      fornecedor: data?.fornecedor || "",
      data_entrada: adjustDateForDisplay(data?.data_entrada),
    })

    setCertComposicao(null)
    setRelatorioPropriedades(null)
    setLaudoPenetrante(null)
    setNotaFiscal(null)
    setImagens([])
    setExistingCertComposicao(data?.cert_composicao || null)
    setExistingRelatorioPropriedades(data?.relatorio_propriedades || null)
    setExistingLaudoPenetrante(data?.laudo_penetrante || null)
    setExistingNotaFiscal(data?.nota_fiscal || null)
    setExistingImages(normalizeFiles(data?.imagens))
    setRemovingType(null)
  }, [data, open])

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<File | null>>,
  ) => {
    const file = e.target.files?.[0]
    if (file) setter(file)
  }

  const handleImagesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImagens((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveAttachment = async (tipo: "certComposicao" | "relatorioPropriedades" | "laudoPenetrante" | "notaFiscal" | "imagem", nomeArquivo?: string) => {
    if (!data?.id) return

    const token = localStorage.getItem("jwt_token")
    if (!token) {
      alert("Token não encontrado. Faça login novamente.")
      return
    }

    setRemovingType(tipo)

    try {
      const params = new URLSearchParams({ tipo })
      if (nomeArquivo) params.append("nomeArquivo", nomeArquivo)

      const response = await fetch(`http://localhost:8080/api/materia-prima/${data.id}/anexos?${params.toString()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao remover anexo")
      }

      if (tipo === "certComposicao") setExistingCertComposicao(null)
      if (tipo === "relatorioPropriedades") setExistingRelatorioPropriedades(null)
      if (tipo === "laudoPenetrante") setExistingLaudoPenetrante(null)
      if (tipo === "notaFiscal") setExistingNotaFiscal(null)
      if (tipo === "imagem" && nomeArquivo) {
        setExistingImages((prev) => prev.filter((item) => item !== nomeArquivo))
      }
    } catch (error) {
      alert("Falha ao remover anexo. Tente novamente.")
    } finally {
      setRemovingType(null)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = new FormData()
      payload.append("nome", formData.nome)
      const quantidadeInt = Math.round(Number(formData.quantidade))
      if (!Number.isInteger(quantidadeInt) || quantidadeInt <= 0) {
        throw new Error("Quantidade deve ser um número inteiro maior que zero")
      }
      payload.append("quantidade", String(quantidadeInt))
      const estoqueMinimoInt = formData.estoque_minimo ? Number.parseInt(formData.estoque_minimo, 10) : null
      const estoqueMaximoInt = formData.estoque_maximo ? Number.parseInt(formData.estoque_maximo, 10) : null

      if (formData.estoque_minimo && !Number.isInteger(Number(formData.estoque_minimo))) {
        throw new Error("Estoque mínimo deve ser um número inteiro")
      }

      if (formData.estoque_maximo && !Number.isInteger(Number(formData.estoque_maximo))) {
        throw new Error("Estoque máximo deve ser um número inteiro")
      }

      if (estoqueMinimoInt !== null) payload.append("estoque_minimo", String(estoqueMinimoInt))
      if (estoqueMaximoInt !== null) payload.append("estoque_maximo", String(estoqueMaximoInt))
      payload.append("fornecedor", formData.fornecedor)

      if (formData.estoque_minimo && formData.estoque_maximo && Number(formData.estoque_minimo) > Number(formData.estoque_maximo)) {
        throw new Error("Estoque mínimo não pode ser maior que o estoque máximo")
      }

      if (formData.lote) payload.append("lote", formData.lote)
      if (formData.altura) payload.append("altura", formData.altura)
      if (formData.largura) payload.append("largura", formData.largura)
      if (formData.espessura) payload.append("espessura", formData.espessura)
      if (formData.data_entrada) payload.append("data_entrada", adjustDateForSubmit(formData.data_entrada))

      if (certComposicao) payload.append("certComposicao", certComposicao)
      if (relatorioPropriedades) payload.append("relatorioPropriedades", relatorioPropriedades)
      if (laudoPenetrante) payload.append("laudoPenetrante", laudoPenetrante)
      if (notaFiscal) payload.append("notaFiscal", notaFiscal)
      imagens.forEach((img) => payload.append("imagens", img))

      await onSave(payload)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Matéria-Prima</DialogTitle>
          <DialogDescription>Atualize todos os dados e anexos necessários.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                step="1"
                min="1"
                value={formData.quantidade}
                onChange={(e) => handleChange("quantidade", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lote">Lote</Label>
              <Input id="lote" value={formData.lote} onChange={(e) => handleChange("lote", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                type="number"
                step="1"
                min="0"
                value={formData.estoque_minimo}
                onChange={(e) => handleChange("estoque_minimo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_maximo">Estoque Máximo</Label>
              <Input
                id="estoque_maximo"
                type="number"
                step="1"
                min="0"
                value={formData.estoque_maximo}
                onChange={(e) => handleChange("estoque_maximo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altura">Altura (mm)</Label>
              <Input id="altura" type="number" step="0.01" value={formData.altura} onChange={(e) => handleChange("altura", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="largura">Largura (mm)</Label>
              <Input id="largura" type="number" step="0.01" value={formData.largura} onChange={(e) => handleChange("largura", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="espessura">Espessura (mm)</Label>
              <Input
                id="espessura"
                type="number"
                step="0.01"
                value={formData.espessura}
                onChange={(e) => handleChange("espessura", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input
                id="fornecedor"
                value={formData.fornecedor}
                onChange={(e) => handleChange("fornecedor", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_entrada">Data de Entrada/Recepção/Fabricação</Label>
              <Input
                id="data_entrada"
                type="date"
                value={formData.data_entrada}
                onChange={(e) => handleChange("data_entrada", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Documentos e Anexos</h3>

            <div className="space-y-2">
              <Label htmlFor="cert_composicao">Certificado de Composição Química</Label>
              {existingCertComposicao && (
                <div className="flex items-center gap-2">
                  <a
                    href={`http://localhost:8080/api/files/download/${existingCertComposicao}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Baixar arquivo atual
                  </a>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    variant="outline"
                    onClick={() => handleRemoveAttachment("certComposicao")}
                    disabled={removingType !== null}
                  >
                    {removingType === "certComposicao" ? "Removendo..." : "Remover atual"}
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input id="cert_composicao" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, setCertComposicao)} />
                {certComposicao && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setCertComposicao(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relatorio_propriedades">Relatório de Propriedades Mecânicas</Label>
              {existingRelatorioPropriedades && (
                <div className="flex items-center gap-2">
                  <a
                    href={`http://localhost:8080/api/files/download/${existingRelatorioPropriedades}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Baixar arquivo atual
                  </a>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    variant="outline"
                    onClick={() => handleRemoveAttachment("relatorioPropriedades")}
                    disabled={removingType !== null}
                  >
                    {removingType === "relatorioPropriedades" ? "Removendo..." : "Remover atual"}
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="relatorio_propriedades"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, setRelatorioPropriedades)}
                />
                {relatorioPropriedades && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setRelatorioPropriedades(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="laudo_penetrante">Laudo de Ensaio de Líquido Penetrante</Label>
              {existingLaudoPenetrante && (
                <div className="flex items-center gap-2">
                  <a
                    href={`http://localhost:8080/api/files/download/${existingLaudoPenetrante}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Baixar arquivo atual
                  </a>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    variant="outline"
                    onClick={() => handleRemoveAttachment("laudoPenetrante")}
                    disabled={removingType !== null}
                  >
                    {removingType === "laudoPenetrante" ? "Removendo..." : "Remover atual"}
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input id="laudo_penetrante" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, setLaudoPenetrante)} />
                {laudoPenetrante && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setLaudoPenetrante(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nota_fiscal">Nota Fiscal</Label>
              {existingNotaFiscal && (
                <div className="flex items-center gap-2">
                  <a
                    href={`http://localhost:8080/api/files/download/${existingNotaFiscal}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Baixar arquivo atual
                  </a>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    variant="outline"
                    onClick={() => handleRemoveAttachment("notaFiscal")}
                    disabled={removingType !== null}
                  >
                    {removingType === "notaFiscal" ? "Removendo..." : "Remover atual"}
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input id="nota_fiscal" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, setNotaFiscal)} />
                {notaFiscal && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setNotaFiscal(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagens">Imagens (adicionar novas)</Label>
              <div className="flex items-center gap-2">
                <Input id="imagens" type="file" accept="image/*" multiple onChange={handleImagesUpload} />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>

              {existingImages.length > 0 && (
                <div className="space-y-2 mt-2">
                  {existingImages.map((imageName) => (
                    <div key={imageName} className="flex items-center justify-between rounded border p-2">
                      <a
                        href={`http://localhost:8080/api/files/download/${imageName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Imagem atual
                      </a>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleRemoveAttachment("imagem", imageName)}
                        disabled={removingType !== null}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {removingType === "imagem" ? "Removendo..." : "Remover"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {imagens.length > 0 && (
                <div className="grid gap-2 md:grid-cols-2 mt-2">
                  {imagens.map((img, index) => (
                    <div key={`${img.name}-${index}`} className="relative rounded-lg border p-2 flex items-center gap-2">
                      <div className="flex-1 truncate">
                        <p className="text-sm truncate">{img.name}</p>
                        <p className="text-xs text-muted-foreground">{(img.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
