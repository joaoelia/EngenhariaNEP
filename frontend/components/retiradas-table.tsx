"use client"

import { useEffect, useRef, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Pagination } from "@/components/pagination"

// Função para formatar data sem ajuste de timezone (para datas que vêm do backend)
const formatDateWithoutAdjustment = (dateString?: string) => {
  if (!dateString) return "-"
  const dateParts = dateString.split("-")
  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR })
}

interface Retirada {
  id: string
  item_nome: string
  quantidade: number
  pessoa: string
  data: string
}

interface RetiradasTableProps {
  retiradas: Retirada[]
  onDelete?: (id: string, options: { quantidade: number; cancelarTudo: boolean }) => Promise<void>
}

export function RetiradasTable({ retiradas, onDelete }: RetiradasTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"todos" | "nome" | "data">("todos")
  const [deleteItem, setDeleteItem] = useState<Retirada | null>(null)
  const [cancelarTudo, setCancelarTudo] = useState(true)
  const [quantidadeCancelar, setQuantidadeCancelar] = useState("")
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const tableViewportRef = useRef<HTMLDivElement | null>(null)

  const filteredRetiradas = retiradas.filter((retirada) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()

    if (filterType === "nome") {
      return (
        retirada.item_nome.toLowerCase().includes(searchLower) || retirada.pessoa.toLowerCase().includes(searchLower)
      )
    } else if (filterType === "data") {
      const formattedDate = formatDateWithoutAdjustment(retirada.data)
      return formattedDate.includes(searchTerm)
    } else {
      // todos - search in all fields
      const formattedDate = formatDateWithoutAdjustment(retirada.data)
      return (
        retirada.item_nome.toLowerCase().includes(searchLower) ||
        retirada.pessoa.toLowerCase().includes(searchLower) ||
        formattedDate.includes(searchTerm)
      )
    }
  })

  // Paginação
  const totalPages = Math.ceil(filteredRetiradas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRetiradas = filteredRetiradas.slice(startIndex, startIndex + itemsPerPage)

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
  }, [filteredRetiradas.length])

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

  const handleFilterChange = (value: "todos" | "nome" | "data") => {
    setFilterType(value)
    setCurrentPage(1)
  }

  const openDeleteDialog = (retirada: Retirada) => {
    setDeleteItem(retirada)
    setCancelarTudo(true)
    setQuantidadeCancelar(retirada.quantidade.toString())
    setDeleteError(null)
  }

  const closeDeleteDialog = () => {
    setDeleteItem(null)
    setCancelarTudo(true)
    setQuantidadeCancelar("")
    setDeleteError(null)
    setIsDeleting(false)
  }

  const handleConfirmDelete = async () => {
    if (!deleteItem || !onDelete) return

    if (!cancelarTudo) {
      const quantidade = Number(quantidadeCancelar)
      if (!Number.isFinite(quantidade) || quantidade <= 0) {
        setDeleteError("Informe uma quantidade válida para cancelar")
        return
      }
      if (quantidade > deleteItem.quantidade) {
        setDeleteError("A quantidade para cancelamento não pode ser maior que a retirada registrada")
        return
      }
    }

    try {
      setIsDeleting(true)
      setDeleteError(null)

      await onDelete(deleteItem.id, {
        quantidade: cancelarTudo ? deleteItem.quantidade : Math.round(Number(quantidadeCancelar)),
        cancelarTudo,
      })

      closeDeleteDialog()
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Erro ao cancelar retirada")
    } finally {
      setIsDeleting(false)
    }
  }

  if (retiradas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Nenhuma retirada registrada ainda.</p>
      </div>
    )
  }

  return (
    <div className="h-full min-h-0 space-y-2 flex flex-col">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Pesquisar retiradas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Select value={filterType} onValueChange={handleFilterChange}>
          <SelectTrigger className="h-8 w-[160px] text-xs">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os campos</SelectItem>
            <SelectItem value="nome">Nome/Pessoa</SelectItem>
            <SelectItem value="data">Data</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden min-h-0 flex-1 flex flex-col">
        <div ref={tableViewportRef} className="min-h-0 flex-1 overflow-auto">
          <Table className="text-sm [&_th]:h-9 [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:whitespace-nowrap [&_td]:px-3 [&_td]:py-2 [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-slate-50">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Nome do Item</TableHead>
              <TableHead className="font-semibold">Quantidade</TableHead>
              <TableHead className="font-semibold">Pessoa que Retirou</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              {onDelete && <TableHead className="font-semibold text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRetiradas.map((retirada) => (
              <TableRow key={retirada.id} data-row="true" className="h-9 hover:bg-slate-50">
                <TableCell className="font-medium">{retirada.item_nome}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="h-6 px-2 text-xs bg-green-50 text-green-700 border-green-200">
                    {retirada.quantidade}
                  </Badge>
                </TableCell>
                <TableCell>{retirada.pessoa}</TableCell>
                <TableCell>{formatDateWithoutAdjustment(retirada.data)}</TableCell>
                {onDelete && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                      onClick={(event) => {
                        event.currentTarget.blur()
                        openDeleteDialog(retirada)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {paginatedRetiradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={onDelete ? 5 : 4} className="text-center py-8 text-slate-500">
                  Nenhuma retirada encontrada com "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
        {filteredRetiradas.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRetiradas.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {deleteItem && (
        <AlertDialog open={!!deleteItem} onOpenChange={(open) => { if (!open) closeDeleteDialog() }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar Retirada</AlertDialogTitle>
              <AlertDialogDescription>
                Escolha quanto da retirada deseja cancelar para o item {deleteItem.item_nome}.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Quantidade registrada: <span className="font-semibold text-slate-900">{deleteItem.quantidade}</span>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="cancelar-tudo"
                  checked={cancelarTudo}
                  onCheckedChange={(checked) => setCancelarTudo(checked === true)}
                />
                <Label htmlFor="cancelar-tudo" className="text-sm">Cancelar tudo (apagar registro completo)</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade-cancelar">Quantidade para cancelar</Label>
                <Input
                  id="quantidade-cancelar"
                  type="number"
                  min="1"
                  step="1"
                  disabled={cancelarTudo}
                  value={quantidadeCancelar}
                  onChange={(e) => setQuantidadeCancelar(e.target.value)}
                  placeholder="0"
                />
              </div>

              {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
            </div>

            <AlertDialogFooter>
              <Button variant="outline" onClick={closeDeleteDialog} disabled={isDeleting}>
                Fechar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? "Cancelando..." : "Confirmar cancelamento"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
