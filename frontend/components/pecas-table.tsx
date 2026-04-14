"use client"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, Trash2, Pencil } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { PecaEditDialog } from "@/components/peca-edit-dialog"

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
  estoque_minimo?: number
  estoque_maximo?: number
  status_estoque?: "OK" | "ABAIXO_MINIMO" | "ACIMA_MAXIMO"
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
  const [cancelarTudo, setCancelarTudo] = useState(true)
  const [quantidadeExcluir, setQuantidadeExcluir] = useState("")
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editItem, setEditItem] = useState<Peca | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const openDeleteDialog = (item: Peca) => {
    setDeleteItem(item)
    setCancelarTudo(true)
    setQuantidadeExcluir(String(item.quantidade_produzida ?? 0))
    setDeleteError(null)
  }

  const closeDeleteDialog = () => {
    setDeleteItem(null)
    setCancelarTudo(true)
    setQuantidadeExcluir("")
    setDeleteError(null)
    setIsDeleting(false)
  }

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

  const handleSaveEdit = async (formData: FormData) => {
    if (!editItem) return
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      toast({ title: "Sessão expirada", description: "Por favor, faça login novamente.", variant: "destructive" })
      return
    }
    const response = await fetch(`http://localhost:8080/api/pecas/${editItem.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao atualizar peça")
    }
    setEditItem(null)
    if (onChanged) await onChanged()
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    if (!cancelarTudo) {
      const quantidade = Number(quantidadeExcluir)
      if (!Number.isFinite(quantidade) || quantidade <= 0 || !Number.isInteger(quantidade)) {
        setDeleteError("Informe uma quantidade inteira válida")
        return
      }
      if (quantidade > deleteItem.quantidade_produzida) {
        setDeleteError("A quantidade para exclusão não pode ser maior que o estoque atual")
        return
      }
    }

    setIsDeleting(true)
    setDeleteError(null)

    const token = localStorage.getItem("jwt_token")
    if (!token) {
      toast({
        title: "Sesão expirada",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      })
      setIsDeleting(false)
      return
    }

    const query = new URLSearchParams({
      cancelar_tudo: cancelarTudo ? "true" : "false",
    })

    if (!cancelarTudo) {
      query.append("quantidade", String(Number(quantidadeExcluir)))
    }

    const response = await fetch(`http://localhost:8080/api/pecas/${deleteItem.id}?${query.toString()}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      setDeleteError(errorData.message || "Erro ao excluir peça")
      setIsDeleting(false)
      return
    }

    closeDeleteDialog()

    if (onChanged) {
      await onChanged()
    }

    setIsDeleting(false)
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

  // Paginação
  const totalPages = Math.ceil(pecas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPecas = pecas.slice(startIndex, startIndex + itemsPerPage)

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

  const getStatusEstoqueLabel = (status?: string) => {
    switch (status) {
      case "ABAIXO_MINIMO":
        return "Abaixo do mínimo"
      case "ACIMA_MAXIMO":
        return "Acima do máximo"
      default:
        return "Dentro da faixa"
    }
  }

  const getStatusEstoqueColor = (status?: string) => {
    switch (status) {
      case "ABAIXO_MINIMO":
        return "bg-red-100 text-red-800 border-red-200"
      case "ACIMA_MAXIMO":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      <div className="max-h-[430px] overflow-auto">
        <Table className="text-sm [&_th]:h-9 [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:whitespace-nowrap [&_td]:px-3 [&_td]:py-2 [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-slate-50">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Part Number</TableHead>
            <TableHead className="font-semibold">Número de Série</TableHead>
            <TableHead className="font-semibold">Aeronave Instalada</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Estoque</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPecas.map((item) => (
            <TableRow key={item.id} className="h-10 hover:bg-slate-50">
              <TableCell className="font-mono text-sm">{item.codigo_peca}</TableCell>
              <TableCell className="font-mono text-xs">{item.numero_serie || item.numero_desenho || "-"}</TableCell>
              <TableCell>{item.aeronave_instalada || "-"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status_qualidade)}>{formatDisplayStatus(item.status_qualidade)}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusEstoqueColor(item.status_estoque)}>
                  {getStatusEstoqueLabel(item.status_estoque)}
                </Badge>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => setEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={(event) => {
                      event.currentTarget.blur()
                      openDeleteDialog(item)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
      {pecas.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={pecas.length}
          itemsPerPage={itemsPerPage}
        />
      )}

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
                <div className="font-semibold text-sm text-slate-600">Quantidade Atual:</div>
                <div className="col-span-2 text-sm text-slate-900">{viewItem.quantidade_produzida ?? 0}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Estoque Mínimo:</div>
                <div className="col-span-2 text-sm text-slate-900">{viewItem.estoque_minimo ?? "-"}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="font-semibold text-sm text-slate-600">Estoque Máximo:</div>
                <div className="col-span-2 text-sm text-slate-900">{viewItem.estoque_maximo ?? "-"}</div>
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
        <AlertDialog open={!!deleteItem} onOpenChange={(open) => { if (!open) closeDeleteDialog() }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Peça</AlertDialogTitle>
              <AlertDialogDescription>
                Escolha quanto do item {deleteItem.descricao} deseja excluir do cadastro.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Quantidade atual: <span className="font-semibold text-slate-900">{deleteItem.quantidade_produzida}</span>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="peca-cancelar-tudo"
                  checked={cancelarTudo}
                  onCheckedChange={(checked) => setCancelarTudo(checked === true)}
                />
                <Label htmlFor="peca-cancelar-tudo" className="text-sm">Excluir todo cadastro (apagar item)</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="peca-quantidade-excluir">Quantidade para excluir</Label>
                <Input
                  id="peca-quantidade-excluir"
                  type="number"
                  min="1"
                  step="1"
                  disabled={cancelarTudo}
                  value={quantidadeExcluir}
                  onChange={(e) => setQuantidadeExcluir(e.target.value)}
                  placeholder="0"
                />
              </div>

              {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
            </div>

            <AlertDialogFooter>
              <Button variant="outline" onClick={closeDeleteDialog} disabled={isDeleting}>
                Fechar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Edit Dialog */}
      <PecaEditDialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
        data={editItem ?? {}}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
