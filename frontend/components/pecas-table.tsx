"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, Trash2, Pencil } from "lucide-react"
import Link from "next/link"
import { DeleteDialog } from "@/components/delete-dialog"

const formatDateWithoutTimezoneShift = (dateString?: string) => {
  if (!dateString) return "-"
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR")
}

interface Peca {
  id: string
  codigo_peca: string
  descricao: string
  numero_serie?: string
  aeronave_instalada?: string
  relatorio_inspecao?: string
  fotos?: string
  numero_desenho: string
  quantidade_produzida: number
  data_fabricacao: string
  operador_responsavel: string
  status_qualidade: string
}

interface PecasTableProps {
  pecas: Peca[]
  onChanged?: () => Promise<void> | void
}

export function PecasTable({ pecas, onChanged }: PecasTableProps) {
  const { toast } = useToast()
  const [viewItem, setViewItem] = useState<Peca | null>(null)
  const [statusValue, setStatusValue] = useState("Em_Inspecao")
  const [isSavingStatus, setIsSavingStatus] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Peca | null>(null)

  const formatDisplayStatus = (status: string): string => {
    switch (status) {
      case "Em_Inspecao":
        return "Inspeção"
      case "Aprovada":
        return "Aprovada"
      case "Reprovada":
        return "Reprovada"
      default:
        return status
    }
  }

  const normalizeFiles = (value?: string): string[] => {
    if (!value) return []
    const trimmed = value.trim()
    if (!trimmed) return []

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).replace(/^"+|"+$/g, "")).filter(Boolean)
        }
      } catch {
        return [trimmed.replace(/^"+|"+$/g, "")]
      }
    }

    return [trimmed.replace(/^"+|"+$/g, "")]
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    const token = localStorage.getItem("jwt_token")
    if (!token) {
      toast({
        title: "Sesão expirada",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      })
      return
    }

    const response = await fetch(`http://localhost:8080/api/pecas/${deleteItem.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao excluir peça")
    }

    if (onChanged) {
      await onChanged()
    }
  }

  const handleStatusSave = async () => {
    if (!viewItem) return

    try {
      setIsSavingStatus(true)
      const token = localStorage.getItem("jwt_token")
      if (!token) {
        throw new Error("Token não encontrado. Por favor, faça login novamente.")
      }

      const response = await fetch(
        `http://localhost:8080/api/pecas/${viewItem.id}/status?status=${encodeURIComponent(statusValue)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao atualizar status")
      }

      if (onChanged) {
        await onChanged()
      }
      setViewItem(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSavingStatus(false)
    }
  }

  if (pecas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Nenhuma peça cadastrada ainda.</p>
        <Link href="/dashboard/pecas/novo">
          <Button className="mt-4 bg-orange-600 hover:bg-orange-700">Cadastrar Primeira Peça</Button>
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovada":
        return "bg-green-100 text-green-800 border-green-200"
      case "reprovada":
        return "bg-red-100 text-red-800 border-red-200"
      case "em_inspecao":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className="rounded-md border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Part Number</TableHead>
            <TableHead className="font-semibold">Número de Série</TableHead>
            <TableHead className="font-semibold">Aeronave Instalada</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pecas.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50">
              <TableCell className="font-mono text-sm">{item.codigo_peca}</TableCell>
              <TableCell className="font-mono text-xs">{item.numero_serie || item.numero_desenho || "-"}</TableCell>
              <TableCell>{item.aeronave_instalada || "-"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status_qualidade)}>{formatDisplayStatus(item.status_qualidade)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => {
                      setViewItem(item)
                      setStatusValue(item.status_qualidade || "Em_Inspecao")
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Link href={`/dashboard/pecas/${item.id}/editar`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={() => setDeleteItem(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {viewItem && (
        <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Peça</DialogTitle>
              <DialogDescription>Visualização detalhada com controle de status</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Part Number:</div>
                <div className="col-span-2 text-sm text-slate-900">{viewItem.codigo_peca}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Número de Série:</div>
                <div className="col-span-2 text-sm text-slate-900">{viewItem.numero_serie || viewItem.numero_desenho || "-"}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Aeronave Instalada:</div>
                <div className="col-span-2 text-sm text-slate-900">{viewItem.aeronave_instalada || "-"}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Descrição:</div>
                <div className="col-span-2 text-sm text-slate-900 whitespace-pre-wrap">{viewItem.descricao}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Relatório de Inspeção:</div>
                <div className="col-span-2 text-sm text-slate-900">
                  {viewItem.relatorio_inspecao ? (
                    <a
                      href={`http://localhost:8080/api/files/download/${viewItem.relatorio_inspecao}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Baixar arquivo
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Fotos da Peça:</div>
                <div className="col-span-2 text-sm text-slate-900 flex flex-col gap-2">
                  {normalizeFiles(viewItem.fotos).length > 0 ? (
                    normalizeFiles(viewItem.fotos).map((file, index) => (
                      <a
                        key={`${file}-${index}`}
                        href={`http://localhost:8080/api/files/download/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Baixar arquivo
                      </a>
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="status_qualidade">Status</Label>
                <Select value={statusValue} onValueChange={setStatusValue}>
                  <SelectTrigger id="status_qualidade">
                    <SelectValue placeholder="Selecione o status">{formatDisplayStatus(statusValue)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em_Inspecao">Inspeção</SelectItem>
                    <SelectItem value="Aprovada">Aprovada</SelectItem>
                    <SelectItem value="Reprovada">Reprovada</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={handleStatusSave}
                  disabled={isSavingStatus}
                >
                  {isSavingStatus ? "Salvando status..." : "Salvar Status"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <DeleteDialog
          open={!!deleteItem}
          onOpenChange={() => setDeleteItem(null)}
          title="Excluir Peça"
          description="Tem certeza que deseja excluir esta peça fabricada?"
          itemName={deleteItem.descricao}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
