"use client"

import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Upload, X, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type PecaData = Record<string, any>

interface PecaEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: PecaData
  onSave: (formData: FormData) => Promise<void>
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

export function PecaEditDialog({ open, onOpenChange, data, onSave }: PecaEditDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    codigo_peca: "",
    numero_serie: "",
    descricao: "",
    aeronave_instalada: "",
    quantidade_produzida: "",
    estoque_minimo: "",
    estoque_maximo: "",
  })

  const [existingRelatorio, setExistingRelatorio] = useState<string | null>(null)
  const [existingFotos, setExistingFotos] = useState<string[]>([])
  const [newRelatorio, setNewRelatorio] = useState<File | null>(null)
  const [newFotos, setNewFotos] = useState<File[]>([])

  useEffect(() => {
    if (open && data) {
      setFormValues({
        codigo_peca: data.codigo_peca || "",
        numero_serie: data.numero_serie || data.numero_desenho || "",
        descricao: data.descricao || "",
        aeronave_instalada: data.aeronave_instalada || "",
        quantidade_produzida: data.quantidade_produzida?.toString() || "",
        estoque_minimo: data.estoque_minimo?.toString() || "",
        estoque_maximo: data.estoque_maximo?.toString() || "",
      })
      setExistingRelatorio(data.relatorio_inspecao || null)
      setExistingFotos(normalizeFiles(data.fotos))
      setNewRelatorio(null)
      setNewFotos([])
    }
  }, [open, data])

  const handleRemoveAttachment = async (tipo: "relatorio_inspecao" | "foto", nomeArquivo?: string) => {
    const token = localStorage.getItem("jwt_token")
    if (!token) return

    const params = new URLSearchParams({ tipo })
    if (nomeArquivo) params.append("nomeArquivo", nomeArquivo)

    try {
      const response = await fetch(`http://localhost:8080/api/pecas/${data.id}/anexos?${params.toString()}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Erro ao remover anexo")
      }

      if (tipo === "relatorio_inspecao") {
        setExistingRelatorio(null)
      } else if (tipo === "foto" && nomeArquivo) {
        setExistingFotos((prev) => prev.filter((f) => f !== nomeArquivo))
      }

      toast({ title: "Anexo removido com sucesso" })
    } catch (error) {
      toast({
        title: "Erro ao remover anexo",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const quantidade = parseInt(formValues.quantidade_produzida, 10)
      if (!formValues.quantidade_produzida || isNaN(quantidade) || quantidade < 1) {
        throw new Error("Quantidade deve ser um número inteiro maior que zero")
      }

      const minimo = formValues.estoque_minimo ? Number(formValues.estoque_minimo) : null
      const maximo = formValues.estoque_maximo ? Number(formValues.estoque_maximo) : null
      if (minimo !== null && maximo !== null && minimo > maximo) {
        throw new Error("Estoque mínimo não pode ser maior que o estoque máximo")
      }

      const fd = new FormData()
      fd.append("part_number", formValues.codigo_peca)
      fd.append("numero_serie", formValues.numero_serie)
      fd.append("descricao", formValues.descricao)
      fd.append("quantidade_produzida", String(quantidade))
      if (formValues.aeronave_instalada) {
        fd.append("aeronave_instalada", formValues.aeronave_instalada)
      }
      if (formValues.estoque_minimo) {
        fd.append("estoque_minimo", formValues.estoque_minimo)
      }
      if (formValues.estoque_maximo) {
        fd.append("estoque_maximo", formValues.estoque_maximo)
      }
      if (newRelatorio) {
        fd.append("relatorio_inspecao", newRelatorio)
      }
      newFotos.forEach((foto) => fd.append("fotos", foto))

      await onSave(fd)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Peça Fabricada</DialogTitle>
          <DialogDescription>Atualize os dados da peça. Arquivos novos substituem os existentes.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Basic fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-codigo_peca">Part Number *</Label>
              <Input
                id="edit-codigo_peca"
                required
                value={formValues.codigo_peca}
                onChange={(e) => setFormValues((prev) => ({ ...prev, codigo_peca: e.target.value }))}
                placeholder="Ex: PN-12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-numero_serie">Número de Série *</Label>
              <Input
                id="edit-numero_serie"
                required
                value={formValues.numero_serie}
                onChange={(e) => setFormValues((prev) => ({ ...prev, numero_serie: e.target.value }))}
                placeholder="Ex: SN-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-descricao">Descrição *</Label>
            <Textarea
              id="edit-descricao"
              required
              rows={3}
              value={formValues.descricao}
              onChange={(e) => setFormValues((prev) => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição detalhada da peça fabricada"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-aeronave">Aeronave Instalada</Label>
            <Input
              id="edit-aeronave"
              value={formValues.aeronave_instalada}
              onChange={(e) => setFormValues((prev) => ({ ...prev, aeronave_instalada: e.target.value }))}
              placeholder="Ex: Boeing 737-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantidade">Quantidade *</Label>
              <Input
                id="edit-quantidade"
                type="number"
                min={1}
                step={1}
                required
                value={formValues.quantidade_produzida}
                onChange={(e) => setFormValues((prev) => ({ ...prev, quantidade_produzida: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-estoque-minimo">Estoque Mínimo</Label>
              <Input
                id="edit-estoque-minimo"
                type="number"
                min={0}
                step={1}
                value={formValues.estoque_minimo}
                onChange={(e) => setFormValues((prev) => ({ ...prev, estoque_minimo: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-estoque-maximo">Estoque Máximo</Label>
              <Input
                id="edit-estoque-maximo"
                type="number"
                min={0}
                step={1}
                value={formValues.estoque_maximo}
                onChange={(e) => setFormValues((prev) => ({ ...prev, estoque_maximo: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Relatório de Inspeção */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Relatório de Inspeção</Label>
            {existingRelatorio && (
              <div className="flex items-center justify-between p-2 bg-slate-50 border rounded-lg">
                <a
                  href={`http://localhost:8080/api/files/download/${existingRelatorio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1 text-sm truncate"
                >
                  <Download className="h-3.5 w-3.5 shrink-0" />
                  Arquivo atual
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 h-7 px-2"
                  onClick={() => handleRemoveAttachment("relatorio_inspecao")}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remover
                </Button>
              </div>
            )}
            <div>
              <Label htmlFor="edit-relatorio" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {existingRelatorio ? "Substituir relatório" : "Adicionar relatório"}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                  </div>
                </div>
              </Label>
              <Input
                id="edit-relatorio"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files?.[0]) setNewRelatorio(e.target.files[0])
                }}
              />
              {newRelatorio && (
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg mt-1">
                  <span className="text-sm truncate">{newRelatorio.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setNewRelatorio(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Fotos */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Fotos da Peça</Label>
            {existingFotos.length > 0 && (
              <div className="space-y-1.5">
                {existingFotos.map((foto, index) => (
                  <div key={`${foto}-${index}`} className="flex items-center justify-between p-2 bg-slate-50 border rounded-lg">
                    <a
                      href={`http://localhost:8080/api/files/download/${foto}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1 text-sm truncate"
                    >
                      <Download className="h-3.5 w-3.5 shrink-0" />
                      Foto {index + 1}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 h-7 px-2"
                      onClick={() => handleRemoveAttachment("foto", foto)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Label htmlFor="edit-fotos" className="cursor-pointer">
              <div className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Adicionar fotos</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, JPEG — Múltiplas</p>
                </div>
              </div>
            </Label>
            <Input
              id="edit-fotos"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) setNewFotos((prev) => [...prev, ...Array.from(e.target.files!)])
              }}
            />
            {newFotos.length > 0 && (
              <div className="flex flex-col gap-1 mt-1">
                {newFotos.map((foto, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span className="text-sm truncate">{foto.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setNewFotos((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
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
