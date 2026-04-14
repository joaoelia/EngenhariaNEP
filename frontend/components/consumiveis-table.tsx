"use client"

import { useEffect, useRef, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Eye, Pencil, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { ViewDialog } from "@/components/view-dialog"
import { EditDialog } from "@/components/edit-dialog"
import { Pagination } from "@/components/pagination"

interface Consumivel {
  id: number
  nome: string
  part_number: string
  quantidade: number
  estoque_minimo?: number
  estoque_maximo?: number
  status_estoque?: "OK" | "ABAIXO_MINIMO" | "ACIMA_MAXIMO"
  fornecedor: string
  local_estoque: string
}

interface ConsumiveisTableProps {
  consumiveis: Consumivel[]
  onDelete?: (id: number, options: { quantidade: number; cancelarTudo: boolean }) => Promise<void>
  onEdit?: (id: number, data: Record<string, any>) => Promise<void>
}

export function ConsumiveisTable({ consumiveis, onDelete, onEdit }: ConsumiveisTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewItem, setViewItem] = useState<Consumivel | null>(null)
  const [editItem, setEditItem] = useState<Consumivel | null>(null)
  const [deleteItem, setDeleteItem] = useState<Consumivel | null>(null)
  const [cancelarTudo, setCancelarTudo] = useState(true)
  const [quantidadeExcluir, setQuantidadeExcluir] = useState("")
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const tableViewportRef = useRef<HTMLDivElement | null>(null)

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

  const handleSaveEdit = async (data: Record<string, any>) => {
    if (!editItem || !onEdit) return
    
    try {
      setIsLoading(true)
      setError(null)
      await onEdit(editItem.id, data)
      setEditItem(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar")
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (item: Consumivel) => {
    setDeleteItem(item)
    setCancelarTudo(true)
    setQuantidadeExcluir(String(item.quantidade ?? 0))
    setDeleteError(null)
  }

  const closeDeleteDialog = () => {
    setDeleteItem(null)
    setCancelarTudo(true)
    setQuantidadeExcluir("")
    setDeleteError(null)
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteItem || !onDelete) return

    if (!cancelarTudo) {
      const quantidade = Number(quantidadeExcluir)
      if (!Number.isFinite(quantidade) || quantidade <= 0 || !Number.isInteger(quantidade)) {
        setDeleteError("Informe uma quantidade inteira válida")
        return
      }
      if (quantidade > deleteItem.quantidade) {
        setDeleteError("A quantidade para exclusão não pode ser maior que o estoque atual")
        return
      }
    }
    
    try {
      setIsLoading(true)
      setError(null)
      setDeleteError(null)
      await onDelete(deleteItem.id, {
        quantidade: cancelarTudo ? deleteItem.quantidade : Number(quantidadeExcluir),
        cancelarTudo,
      })
      closeDeleteDialog()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Erro ao deletar")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConsumiveis = consumiveis.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      item.nome.toLowerCase().includes(searchLower) ||
      item.part_number.toLowerCase().includes(searchLower) ||
      item.fornecedor.toLowerCase().includes(searchLower) ||
      item.local_estoque.toLowerCase().includes(searchLower)
    )
  })

  // Paginação
  const totalPages = Math.ceil(filteredConsumiveis.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedConsumiveis = filteredConsumiveis.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    const viewport = tableViewportRef.current
    if (!viewport) return

    const calculateItemsPerPage = () => {
      const header = viewport.querySelector("thead") as HTMLElement | null
      const firstDataRow = viewport.querySelector('tbody tr[data-row="true"]') as HTMLElement | null

      const viewportHeight = viewport.clientHeight
      const headerHeight = header?.offsetHeight ?? 36
      const rowHeight = firstDataRow?.offsetHeight ?? 36

      const availableBodyHeight = Math.max(0, viewportHeight - headerHeight)
      const computed = Math.floor(availableBodyHeight / Math.max(1, rowHeight))
      const clamped = Math.max(3, Math.min(20, computed || 5))

      setItemsPerPage((previous) => (previous === clamped ? previous : clamped))
    }

    calculateItemsPerPage()

    const resizeObserver = new ResizeObserver(calculateItemsPerPage)
    resizeObserver.observe(viewport)
    window.addEventListener("resize", calculateItemsPerPage)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", calculateItemsPerPage)
    }
  }, [filteredConsumiveis.length])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Reset de página quando o filtro muda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  if (consumiveis.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Nenhum consumível cadastrado ainda.</p>
        <Link href="/dashboard/consumiveis/novo">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Cadastrar Primeiro Consumível</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="h-full min-h-0 space-y-2 flex flex-col">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Pesquisar consumíveis (nome, part number, fornecedor, local)..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="h-8 pl-8 text-xs"
        />
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden min-h-0 flex-1 flex flex-col">
        <div ref={tableViewportRef} className="min-h-0 flex-1 overflow-auto">
          <Table className="text-sm [&_th]:h-9 [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:whitespace-nowrap [&_td]:px-3 [&_td]:py-2 [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-slate-50">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Part Number</TableHead>
              <TableHead className="font-semibold">Quantidade</TableHead>
              <TableHead className="font-semibold">Estoque</TableHead>
              <TableHead className="font-semibold">Fornecedor</TableHead>
              <TableHead className="font-semibold">Local no Estoque</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedConsumiveis.map((item) => (
              <TableRow key={item.id} data-row="true" className="h-9 hover:bg-slate-50">
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="font-mono text-sm">{item.part_number}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="h-6 px-2 text-xs">{item.quantidade}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusEstoqueColor(item.status_estoque)}>{getStatusEstoqueLabel(item.status_estoque)}</Badge>
                </TableCell>
                <TableCell>{item.fornecedor}</TableCell>
                <TableCell>{item.local_estoque}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => setViewItem(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => setEditItem(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 cursor-pointer"
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
            {paginatedConsumiveis.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Nenhum consumível encontrado com "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
        {filteredConsumiveis.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredConsumiveis.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* View Dialog */}
      {viewItem && (
        <ViewDialog
          open={!!viewItem}
          onOpenChange={() => setViewItem(null)}
          title="Detalhes do Consumível"
          data={viewItem}
          fields={[
            { key: "nome", label: "Nome" },
            { key: "part_number", label: "Part Number" },
            { key: "quantidade", label: "Quantidade", type: "number" },
            { key: "estoque_minimo", label: "Estoque Mínimo", type: "number" },
            { key: "estoque_maximo", label: "Estoque Máximo", type: "number" },
            { key: "fornecedor", label: "Fornecedor" },
            { key: "local_estoque", label: "Local no Estoque" },
          ]}
        />
      )}

      {/* Edit Dialog */}
      {editItem && (
        <EditDialog
          open={!!editItem}
          onOpenChange={() => setEditItem(null)}
          title="Editar Consumível"
          data={editItem}
          fields={[
            { key: "nome", label: "Nome", required: true },
            { key: "part_number", label: "Part Number", required: true },
            { key: "quantidade", label: "Quantidade", type: "number", required: true },
            { key: "estoque_minimo", label: "Estoque Mínimo", type: "number" },
            { key: "estoque_maximo", label: "Estoque Máximo", type: "number" },
            { key: "fornecedor", label: "Fornecedor", required: true },
            { key: "local_estoque", label: "Local no Estoque", required: true },
          ]}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <AlertDialog open={!!deleteItem} onOpenChange={(open) => { if (!open) closeDeleteDialog() }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Consumível</AlertDialogTitle>
              <AlertDialogDescription>
                Escolha quanto do item {deleteItem.nome} deseja excluir do cadastro.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Quantidade atual: <span className="font-semibold text-slate-900">{deleteItem.quantidade}</span>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="consumivel-cancelar-tudo"
                  checked={cancelarTudo}
                  onCheckedChange={(checked) => setCancelarTudo(checked === true)}
                />
                <Label htmlFor="consumivel-cancelar-tudo" className="text-sm">Excluir todo cadastro (apagar item)</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consumivel-quantidade-excluir">Quantidade para excluir</Label>
                <Input
                  id="consumivel-quantidade-excluir"
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
              <Button variant="outline" onClick={closeDeleteDialog} disabled={isLoading}>
                Fechar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Excluindo..." : "Confirmar exclusão"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
