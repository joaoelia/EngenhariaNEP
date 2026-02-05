"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { ViewDialog } from "@/components/view-dialog"
import { EditDialog } from "@/components/edit-dialog"
import { DeleteDialog } from "@/components/delete-dialog"

interface Peca {
  id: string
  codigo_peca: string
  descricao: string
  numero_desenho: string
  quantidade_produzida: number
  data_fabricacao: string
  operador_responsavel: string
  status_qualidade: string
}

interface PecasTableProps {
  pecas: Peca[]
}

export function PecasTable({ pecas }: PecasTableProps) {
  const [viewItem, setViewItem] = useState<Peca | null>(null)
  const [editItem, setEditItem] = useState<Peca | null>(null)
  const [deleteItem, setDeleteItem] = useState<Peca | null>(null)

  const handleSaveEdit = async (data: Record<string, any>) => {
    console.log("Salvando:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleDelete = async () => {
    console.log("Excluindo:", deleteItem?.id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="font-semibold">Descrição</TableHead>
            <TableHead className="font-semibold">Desenho</TableHead>
            <TableHead className="font-semibold">Quantidade</TableHead>
            <TableHead className="font-semibold">Data Fabricação</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pecas.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50">
              <TableCell className="font-mono text-sm">{item.codigo_peca}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="font-mono text-xs">{item.numero_desenho}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.quantidade_produzida}</Badge>
              </TableCell>
              <TableCell>{new Date(item.data_fabricacao).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status_qualidade)}>{item.status_qualidade}</Badge>
              </TableCell>
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
        </TableBody>
      </Table>

      {/* View Dialog */}
      {viewItem && (
        <ViewDialog
          open={!!viewItem}
          onOpenChange={() => setViewItem(null)}
          title="Detalhes da Peça"
          data={viewItem}
          fields={[
            { key: "codigo_peca", label: "Código" },
            { key: "descricao", label: "Descrição" },
            { key: "numero_desenho", label: "Número do Desenho" },
            { key: "quantidade_produzida", label: "Quantidade", type: "number" },
            { key: "data_fabricacao", label: "Data de Fabricação", type: "date" },
            { key: "operador_responsavel", label: "Operador" },
            {
              key: "status_qualidade",
              label: "Status",
              render: (value) => <Badge>{value}</Badge>,
            },
          ]}
        />
      )}

      {/* Edit Dialog */}
      {editItem && (
        <EditDialog
          open={!!editItem}
          onOpenChange={() => setEditItem(null)}
          title="Editar Peça"
          data={editItem}
          fields={[
            { key: "codigo_peca", label: "Código", required: true, disabled: true },
            { key: "descricao", label: "Descrição", required: true },
            { key: "numero_desenho", label: "Número do Desenho", required: true },
            { key: "quantidade_produzida", label: "Quantidade", type: "number", required: true },
            { key: "data_fabricacao", label: "Data de Fabricação", type: "date", required: true },
            { key: "operador_responsavel", label: "Operador", required: true },
            {
              key: "status_qualidade",
              label: "Status",
              type: "select",
              required: true,
              options: [
                { value: "Aprovada", label: "Aprovada" },
                { value: "Reprovada", label: "Reprovada" },
                { value: "Em_Inspecao", label: "Em Inspeção" },
              ],
            },
          ]}
          onSave={handleSaveEdit}
        />
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
