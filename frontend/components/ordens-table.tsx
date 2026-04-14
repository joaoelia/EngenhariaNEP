"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, Download } from "lucide-react"
import Link from "next/link"
import { DeleteDialog } from "@/components/delete-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/pagination"
import { OrdemEditDialog } from "@/components/ordem-edit-dialog"

interface Ordem {
  id: number
  numero_ordem: string
  tipo_ordem: string
  projeto: string
  part_number: string
  status: string
  data_criacao: string
  arquivo_pdf?: string
  dados_formulario?: string
}

interface OrdensTableProps {
  ordens: Ordem[]
  onUpdate: () => void
}

export function OrdensTable({ ordens, onUpdate }: OrdensTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [viewItem, setViewItem] = useState<Ordem | null>(null)
  const [deleteItem, setDeleteItem] = useState<Ordem | null>(null)
  const [editItem, setEditItem] = useState<Ordem | null>(null)
  const [editingStatus, setEditingStatus] = useState<string>("")
  const [savingStatus, setSavingStatus] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleDownloadPDF = async (ordem: Ordem) => {
    if (!ordem.arquivo_pdf) {
      toast({
        title: "Aviso",
        description: "PDF não disponível para este pedido.",
        variant: "default",
      })
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/files/download/${ordem.arquivo_pdf}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao baixar PDF (${response.status}): ${errorText || "Arquivo não encontrado"}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${ordem.numero_ordem}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao baixar PDF. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    try {
      const token = localStorage.getItem("jwt_token")
      const response = await fetch(`http://localhost:8080/api/ordens/${deleteItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error("Erro ao excluir ordem")
      }

      setDeleteItem(null)
      onUpdate()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir ordem. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!viewItem) return

    try {
      setSavingStatus(true)
      const token = localStorage.getItem("jwt_token")
      const response = await fetch(`http://localhost:8080/api/ordens/${viewItem.id}/status?status=${encodeURIComponent(newStatus)}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error("Erro ao atualizar status")
      }

      setEditingStatus(newStatus)
      onUpdate()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSavingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  const openViewDialog = (item: Ordem) => {
    setViewItem(item)
    setEditingStatus(item.status)
  }

  if (ordens.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Nenhuma ordem cadastrada ainda.</p>
        <Link href="/dashboard/ordens/novo">
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Criar Primeira Ordem</Button>
        </Link>
      </div>
    )
  }

  // Paginação
  const totalPages = Math.ceil(ordens.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrdens = ordens.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluída":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200"
      case "em andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pausada":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "aberta":
        return "bg-slate-100 text-slate-800 border-slate-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "fabricacao":
      case "fabricação":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "producao":
      case "produção":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "projeto":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const formatTipoDisplay = (tipo: string) => {
    if (tipo === "fabricacao") return "Fabricação"
    if (tipo === "producao") return "Produção"
    if (tipo === "projeto") return "Projeto"
    return tipo
  }

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      <div className="max-h-[430px] overflow-auto">
        <Table className="text-sm [&_th]:h-9 [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:whitespace-nowrap [&_td]:px-3 [&_td]:py-2 [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-slate-50">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Número</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Projeto</TableHead>
            <TableHead className="font-semibold">Part Number</TableHead>
            <TableHead className="font-semibold">Data Criação</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrdens.map((item) => (
            <TableRow key={item.id} className="h-10 hover:bg-slate-50">
              <TableCell className="font-mono text-sm font-semibold">{item.numero_ordem}</TableCell>
              <TableCell>
                <Badge className={getTipoColor(item.tipo_ordem)}>{formatTipoDisplay(item.tipo_ordem)}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate font-medium">{item.projeto}</TableCell>
              <TableCell className="font-mono text-sm">{item.part_number}</TableCell>
              <TableCell>{formatDate(item.data_criacao)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => openViewDialog(item)}>
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
                  {item.arquivo_pdf && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-blue-600 hover:text-blue-700"
                      onClick={() => handleDownloadPDF(item)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={(event) => {
                      event.currentTarget.blur()
                      setDeleteItem(item)
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
      {ordens.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={ordens.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* View Dialog */}
      {viewItem && (
        <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Ordem — {viewItem.numero_ordem}</DialogTitle>
              <DialogDescription>
                <Badge className={getTipoColor(viewItem.tipo_ordem)}>{formatTipoDisplay(viewItem.tipo_ordem)}</Badge>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-500">Projeto</Label>
                  <p className="text-sm">{viewItem.projeto}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-500">Part Number</Label>
                  <p className="text-sm font-mono">{viewItem.part_number}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-500">Data de Criação</Label>
                  <p className="text-sm">{formatDate(viewItem.data_criacao)}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-500">Status</Label>
                  <div className="mt-1">
                    <Select value={editingStatus} onValueChange={handleStatusChange} disabled={savingStatus}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fazer">Fazer</SelectItem>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Concluída">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {viewItem.arquivo_pdf && (
                <div>
                  <Label className="text-xs font-semibold text-slate-500">PDF</Label>
                  <div className="mt-1">
                    <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700" onClick={() => handleDownloadPDF(viewItem)}>
                      <Download className="h-3 w-3 mr-2" /> Baixar PDF
                    </Button>
                  </div>
                </div>
              )}

              {viewItem.dados_formulario && (() => {
                let parsed: Record<string, any> = {}
                try { parsed = JSON.parse(viewItem.dados_formulario) } catch {}
                const skip = new Set(["projeto", "partNumber", "part_number"])
                const entries = Object.entries(parsed).filter(([k]) => !skip.has(k))
                if (entries.length === 0) return null
                return (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1">Dados do Formulário</p>
                    {entries.map(([key, value]) => {
                      if (Array.isArray(value)) {
                        if (value.length === 0) return null
                        const cols = Object.keys(value[0] || {}).filter((c) => c !== "item")
                        return (
                          <div key={key} className="space-y-1">
                            <p className="text-xs font-semibold text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50">
                                    {cols.map((c) => <th key={c} className="border px-2 py-1 text-left capitalize">{c.replace(/([A-Z])/g, " $1")}</th>)}
                                  </tr>
                                </thead>
                                <tbody>
                                  {value.map((row: any, i: number) => (
                                    <tr key={i}>
                                      {cols.map((c) => <td key={c} className="border px-2 py-1">{row[c] ?? "-"}</td>)}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      }
                      if (!value && value !== 0) return null
                      return (
                        <div key={key} className="grid grid-cols-3 gap-2 items-start">
                          <span className="text-xs font-semibold text-slate-500 capitalize col-span-1">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className="text-sm text-slate-900 col-span-2 break-words">{String(value)}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      <OrdemEditDialog
        open={!!editItem}
        onOpenChange={(o) => { if (!o) setEditItem(null) }}
        data={editItem ?? {}}
        onSave={onUpdate}
      />

      {/* Delete Dialog */}
      {deleteItem && (
        <DeleteDialog
          open={!!deleteItem}
          onOpenChange={() => setDeleteItem(null)}
          title="Excluir Ordem"
          description="Tem certeza que deseja excluir esta ordem?"
          itemName={`${deleteItem.numero_ordem} - ${deleteItem.projeto}`}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
