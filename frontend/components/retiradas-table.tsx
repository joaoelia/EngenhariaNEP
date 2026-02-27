"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DeleteDialog } from "@/components/delete-dialog"

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
  onDelete?: (id: string) => Promise<void>
}

export function RetiradasTable({ retiradas, onDelete }: RetiradasTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"todos" | "nome" | "data">("todos")
  const [deleteItem, setDeleteItem] = useState<Retirada | null>(null)

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

  if (retiradas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Nenhuma retirada registrada ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Pesquisar retiradas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(value: "todos" | "nome" | "data") => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os campos</SelectItem>
            <SelectItem value="nome">Nome/Pessoa</SelectItem>
            <SelectItem value="data">Data</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-slate-200">
        <Table>
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
            {filteredRetiradas.map((retirada) => (
              <TableRow key={retirada.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{retirada.item_nome}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteItem(retirada)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filteredRetiradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={onDelete ? 5 : 4} className="text-center py-8 text-slate-500">
                  Nenhuma retirada encontrada com "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {deleteItem && (
        <DeleteDialog
          open={!!deleteItem}
          onOpenChange={() => setDeleteItem(null)}
          title="Excluir Retirada"
          description="Tem certeza que deseja excluir esta retirada?"
          itemName={deleteItem.item_nome}
          onConfirm={async () => {
            if (onDelete) {
              await onDelete(deleteItem.id)
            }
            setDeleteItem(null)
          }}
        />
      )}
    </div>
  )
}
