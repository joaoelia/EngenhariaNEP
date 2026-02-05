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

interface MateriaPrima {
  id: string
  codigo: string
  descricao: string
  tipo_material: string
  quantidade_estoque: number
  unidade_medida: string
  fornecedor: string
}

interface MateriaPrimaTableProps {
  materiaPrima: MateriaPrima[]
}

export function MateriaPrimaTable({ materiaPrima }: MateriaPrimaTableProps) {
  const [viewItem, setViewItem] = useState<MateriaPrima | null>(null)
  const [editItem, setEditItem] = useState<MateriaPrima | null>(null)
  const [deleteItem, setDeleteItem] = useState<MateriaPrima | null>(null)

  const handleSaveEdit = async (data: Record<string, any>) => {
    console.log("Salvando:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleDelete = async () => {
    console.log("Excluindo:", deleteItem?.id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
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

  return (
    <div className="rounded-md border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="font-semibold">Descrição</TableHead>
            <TableHead className="font-semibold">Tipo de Material</TableHead>
            <TableHead className="font-semibold">Estoque</TableHead>
            <TableHead className="font-semibold">Fornecedor</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materiaPrima.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50">
              <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.tipo_material}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {item.quantidade_estoque} {item.unidade_medida}
                </Badge>
              </TableCell>
              <TableCell>{item.fornecedor}</TableCell>
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
          title="Detalhes da Matéria-Prima"
          data={viewItem}
          fields={[
            { key: "codigo", label: "Código" },
            { key: "descricao", label: "Descrição" },
            { key: "tipo_material", label: "Tipo de Material" },
            {
              key: "quantidade_estoque",
              label: "Estoque",
              render: (value) => `${value} ${viewItem.unidade_medida}`,
            },
            { key: "fornecedor", label: "Fornecedor" },
          ]}
        />
      )}

      {/* Edit Dialog */}
      {editItem && (
        <EditDialog
          open={!!editItem}
          onOpenChange={() => setEditItem(null)}
          title="Editar Matéria-Prima"
          data={editItem}
          fields={[
            { key: "codigo", label: "Código", required: true, disabled: true },
            { key: "descricao", label: "Descrição", required: true },
            { key: "tipo_material", label: "Tipo de Material", required: true },
            { key: "quantidade_estoque", label: "Quantidade", type: "number", required: true },
            { key: "unidade_medida", label: "Unidade", required: true },
            { key: "fornecedor", label: "Fornecedor", required: true },
          ]}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <DeleteDialog
          open={!!deleteItem}
          onOpenChange={() => setDeleteItem(null)}
          title="Excluir Matéria-Prima"
          description="Tem certeza que deseja excluir esta matéria-prima?"
          itemName={deleteItem.descricao}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
