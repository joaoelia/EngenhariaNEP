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

interface Ordem {
  id: string
  numero_ordem: string
  tipo_ordem: string
  projeto: string
  partNumber: string
  status: string
  data_criacao: string
}

interface OrdensTableProps {
  ordens: Ordem[]
}

export function OrdensTable({ ordens }: OrdensTableProps) {
  const [viewItem, setViewItem] = useState<Ordem | null>(null)
  const [editItem, setEditItem] = useState<Ordem | null>(null)
  const [deleteItem, setDeleteItem] = useState<Ordem | null>(null)

  const handleSaveEdit = async (data: Record<string, any>) => {
    console.log("Salvando:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleDelete = async () => {
    console.log("Excluindo:", deleteItem?.id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
      case "fabricação":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "produção":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "projeto":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className="rounded-md border border-slate-200">
      <Table>
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
          {ordens.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50">
              <TableCell className="font-mono text-sm font-semibold">{item.numero_ordem}</TableCell>
              <TableCell>
                <Badge className={getTipoColor(item.tipo_ordem)}>{item.tipo_ordem}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate font-medium">{item.projeto}</TableCell>
              <TableCell className="font-mono text-sm">{item.partNumber}</TableCell>
              <TableCell>{new Date(item.data_criacao).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
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
          title="Detalhes da Ordem"
          data={viewItem}
          fields={[
            { key: "numero_ordem", label: "Número" },
            {
              key: "tipo_ordem",
              label: "Tipo",
              render: (value) => <Badge>{value}</Badge>,
            },
            { key: "projeto", label: "Projeto" },
            { key: "partNumber", label: "Part Number" },
            { key: "data_criacao", label: "Data de Criação", type: "date" },
            {
              key: "status",
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
          title="Editar Ordem"
          data={editItem}
          fields={[
            { key: "numero_ordem", label: "Número", required: true, disabled: true },
            {
              key: "tipo_ordem",
              label: "Tipo",
              type: "select",
              required: true,
              options: [
                { value: "Fabricação", label: "Fabricação" },
                { value: "Produção", label: "Produção" },
                { value: "Projeto", label: "Projeto" },
              ],
            },
            { key: "projeto", label: "Projeto", required: true },
            { key: "partNumber", label: "Part Number", required: true },
            { key: "data_criacao", label: "Data de Criação", type: "date", required: true },
            {
              key: "status",
              label: "Status",
              type: "select",
              required: true,
              options: [
                { value: "Aberta", label: "Aberta" },
                { value: "Em Andamento", label: "Em Andamento" },
                { value: "Pausada", label: "Pausada" },
                { value: "Concluída", label: "Concluída" },
                { value: "Cancelada", label: "Cancelada" },
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
          title="Excluir Ordem"
          description="Tem certeza que deseja excluir esta ordem?"
          itemName={`${deleteItem.numero_ordem} - ${deleteItem.projeto}`}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
