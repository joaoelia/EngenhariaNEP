"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Pencil, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { ViewDialog } from "@/components/view-dialog"
import { EditDialog } from "@/components/edit-dialog"
import { DeleteDialog } from "@/components/delete-dialog"

interface Consumivel {
  id: string
  nome: string
  part_number: string
  quantidade: number
  fornecedor: string
  local_estoque: string
}

interface ConsumiveisTableProps {
  consumiveis: Consumivel[]
}

export function ConsumiveisTable({ consumiveis }: ConsumiveisTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewItem, setViewItem] = useState<Consumivel | null>(null)
  const [editItem, setEditItem] = useState<Consumivel | null>(null)
  const [deleteItem, setDeleteItem] = useState<Consumivel | null>(null)

  const handleSaveEdit = async (data: Record<string, any>) => {
    // Aqui você faria a chamada à API para salvar
    console.log("Salvando:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleDelete = async () => {
    // Aqui você faria a chamada à API para excluir
    console.log("Excluindo:", deleteItem?.id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Pesquisar consumíveis (nome, part number, fornecedor, local)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Part Number</TableHead>
              <TableHead className="font-semibold">Quantidade</TableHead>
              <TableHead className="font-semibold">Fornecedor</TableHead>
              <TableHead className="font-semibold">Local no Estoque</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsumiveis.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="font-mono text-sm">{item.part_number}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.quantidade}</Badge>
                </TableCell>
                <TableCell>{item.fornecedor}</TableCell>
                <TableCell>{item.local_estoque}</TableCell>
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
                      onClick={() => setDeleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredConsumiveis.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Nenhum consumível encontrado com "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
            { key: "fornecedor", label: "Fornecedor", required: true },
            { key: "local_estoque", label: "Local no Estoque", required: true },
          ]}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <DeleteDialog
          open={!!deleteItem}
          onOpenChange={() => setDeleteItem(null)}
          title="Excluir Consumível"
          description="Tem certeza que deseja excluir este consumível?"
          itemName={deleteItem.nome}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
