"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { ViewDialog } from "@/components/view-dialog"
import { MateriaPrimaEditDialog } from "@/components/materia-prima-edit-dialog"
import { Pagination } from "@/components/pagination"

// Função para ajustar data de timezone
const formatDateForDisplay = (dateString?: string) => {
  if (!dateString) return "-"
  const dateParts = dateString.split("-")
  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
  // Subtrair 1 dia para compensar o ajuste feito no submit
  dateObj.setDate(dateObj.getDate() - 1)
  return dateObj.toLocaleDateString("pt-BR")
}

interface MateriaPrima {
  id: number
  codigo: string
  descricao: string
  tipo_material?: string
  quantidade_estoque: number
  estoque_minimo?: number
  estoque_maximo?: number
  status_estoque?: "OK" | "ABAIXO_MINIMO" | "ACIMA_MAXIMO"
  unidade_medida: string
  fornecedor: string
  lote?: string
  data_entrada?: string
  especificacao?: string
  densidade?: number
  altura?: number
  largura?: number
  espessura?: number
  cert_composicao?: string
  relatorio_propriedades?: string
  laudo_penetrante?: string
  nota_fiscal?: string
  imagens?: string
  certificado_qualidade?: string
}

interface MateriaPrimaTableProps {
  materiaPrima: MateriaPrima[]
}

export function MateriaPrimaTable({ materiaPrima }: MateriaPrimaTableProps) {
  const { toast } = useToast()
  const [viewItem, setViewItem] = useState<MateriaPrima | null>(null)
  const [editItem, setEditItem] = useState<MateriaPrima | null>(null)
  const [deleteItem, setDeleteItem] = useState<MateriaPrima | null>(null)
  const [cancelarTudo, setCancelarTudo] = useState(true)
  const [quantidadeExcluir, setQuantidadeExcluir] = useState("")
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const openDeleteDialog = (item: MateriaPrima) => {
    setDeleteItem(item)
    setCancelarTudo(true)
    setQuantidadeExcluir(String(item.quantidade_estoque ?? 0))
    setDeleteError(null)
  }

  const closeDeleteDialog = () => {
    setDeleteItem(null)
    setCancelarTudo(true)
    setQuantidadeExcluir("")
    setDeleteError(null)
    setIsDeleting(false)
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

  const handleSaveEdit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) {
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`http://localhost:8080/api/materia-prima/${editItem?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar matéria-prima")
      }

      setEditItem(null)
      window.location.reload()
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    if (!cancelarTudo) {
      const quantidade = Number(quantidadeExcluir)
      if (!Number.isFinite(quantidade) || quantidade <= 0) {
        setDeleteError("Informe uma quantidade válida para exclusão")
        return
      }
      if (quantidade > deleteItem.quantidade_estoque) {
        setDeleteError("A quantidade para exclusão não pode ser maior que o estoque atual")
        return
      }
    }

    try {
      setIsDeleting(true)
      setDeleteError(null)
      const token = localStorage.getItem("jwt_token")
      if (!token) {
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        })
        return
      }

      const query = new URLSearchParams({
        cancelar_tudo: cancelarTudo ? "true" : "false",
      })

      if (!cancelarTudo) {
        query.append("quantidade", String(Math.round(Number(quantidadeExcluir))))
      }

      const response = await fetch(`http://localhost:8080/api/materia-prima/${deleteItem.id}?${query.toString()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        let apiMessage = "Erro ao excluir matéria-prima"
        try {
          const errorData = await response.json()
          apiMessage = errorData?.message || errorData?.error || apiMessage
        } catch {
          // ignore parse error and keep default message
        }
        throw new Error(apiMessage)
      }

      closeDeleteDialog()
      window.location.reload()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Falha ao deletar")
    } finally {
      setIsDeleting(false)
    }
  }

  if (materiaPrima.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Nenhuma matéria-prima cadastrada ainda.</p>
        <Link href="/dashboard/materia-prima/novo">
          <Button className="mt-4 bg-green-600 hover:bg-green-700">Cadastrar Primeira Matéria-Prima</Button>
        </Link>
      </div>
    )
  }

  // Paginação
  const totalPages = Math.ceil(materiaPrima.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMateriaPrima = materiaPrima.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      <div className="max-h-[430px] overflow-auto">
        <Table className="text-sm [&_th]:h-9 [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:whitespace-nowrap [&_td]:px-3 [&_td]:py-2 [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-slate-50">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Quantidade</TableHead>
            <TableHead className="font-semibold">Estoque</TableHead>
            <TableHead className="font-semibold">Lote</TableHead>
            <TableHead className="font-semibold">Fornecedor</TableHead>
            <TableHead className="font-semibold">Data Entrada</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMateriaPrima.map((item) => (
            <TableRow key={item.id} className="h-10 hover:bg-slate-50">
              <TableCell>{item.descricao}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {item.quantidade_estoque}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusEstoqueColor(item.status_estoque)}>
                  {getStatusEstoqueLabel(item.status_estoque)}
                </Badge>
              </TableCell>
              <TableCell>{item.lote || "-"}</TableCell>
              <TableCell>{item.fornecedor}</TableCell>
              <TableCell>{formatDateForDisplay(item.data_entrada)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setViewItem(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setEditItem(item)}>
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
      {materiaPrima.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={materiaPrima.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* View Dialog */}
      {viewItem && (
        <ViewDialog
          open={!!viewItem}
          onOpenChange={() => setViewItem(null)}
          title="Detalhes da Matéria-Prima"
          data={viewItem}
          fields={[
            { key: "descricao", label: "Nome" },
            {
              key: "quantidade_estoque",
              label: "Quantidade",
              render: (value) => `${value}`,
            },
            { key: "estoque_minimo", label: "Estoque Mínimo", type: "number" },
            { key: "estoque_maximo", label: "Estoque Máximo", type: "number" },
            { key: "lote", label: "Lote" },
            { key: "fornecedor", label: "Fornecedor" },
            { key: "data_entrada", label: "Data de Entrada", render: (value) => formatDateForDisplay(value) },
            { key: "altura", label: "Altura (mm)", type: "number" },
            { key: "largura", label: "Largura (mm)", type: "number" },
            { key: "espessura", label: "Espessura (mm)", type: "number" },
            { key: "cert_composicao", label: "Certificado de Composição", type: "files" },
            { key: "relatorio_propriedades", label: "Relatório de Propriedades", type: "files" },
            { key: "laudo_penetrante", label: "Laudo de Ensaio Penetrante", type: "files" },
            { key: "nota_fiscal", label: "Nota Fiscal", type: "files" },
            { key: "imagens", label: "Imagens", type: "files" },
          ]}
        />
      )}

      {/* Edit Dialog */}
      {editItem && (
        <MateriaPrimaEditDialog
          open={!!editItem}
          onOpenChange={() => setEditItem(null)}
          data={editItem}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <AlertDialog open={!!deleteItem} onOpenChange={(open) => { if (!open) closeDeleteDialog() }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Matéria-Prima</AlertDialogTitle>
              <AlertDialogDescription>
                Escolha quanto do item {deleteItem.descricao} deseja excluir do cadastro.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Quantidade atual: <span className="font-semibold text-slate-900">{deleteItem.quantidade_estoque}</span>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="materia-prima-cancelar-tudo"
                  checked={cancelarTudo}
                  onCheckedChange={(checked) => setCancelarTudo(checked === true)}
                />
                <Label htmlFor="materia-prima-cancelar-tudo" className="text-sm">Excluir todo cadastro (apagar item)</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="materia-prima-quantidade-excluir">Quantidade para excluir</Label>
                <Input
                  id="materia-prima-quantidade-excluir"
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
    </div>
  )
}
