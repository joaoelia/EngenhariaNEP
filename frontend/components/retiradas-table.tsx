"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Retirada {
  id: string
  item_nome: string
  quantidade: number
  pessoa: string
  data: string
}

interface RetiradasTableProps {
  retiradas: Retirada[]
}

export function RetiradasTable({ retiradas }: RetiradasTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"todos" | "nome" | "data">("todos")

  const filteredRetiradas = retiradas.filter((retirada) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()

    if (filterType === "nome") {
      return (
        retirada.item_nome.toLowerCase().includes(searchLower) || retirada.pessoa.toLowerCase().includes(searchLower)
      )
    } else if (filterType === "data") {
      const formattedDate = format(new Date(retirada.data), "dd/MM/yyyy", { locale: ptBR })
      return formattedDate.includes(searchTerm)
    } else {
      // todos - search in all fields
      const formattedDate = format(new Date(retirada.data), "dd/MM/yyyy", { locale: ptBR })
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
                <TableCell>{format(new Date(retirada.data), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              </TableRow>
            ))}
            {filteredRetiradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Nenhuma retirada encontrada com "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
