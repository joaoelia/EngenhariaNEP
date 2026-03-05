"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { ViewDialog } from "@/components/view-dialog"
import { EditDialog } from "@/components/edit-dialog"
import { DeleteDialog } from "@/components/delete-dialog"

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
  tipo_material: string
  quantidade_estoque: number
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

  const handleSaveEdit = async (data: Record<string, any>) => {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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

      const response = await fetch(`http://localhost:8080/api/materia-prima/${deleteItem?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir matéria-prima")
      }

      setDeleteItem(null)
      window.location.reload()
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao deletar. Por favor, tente novamente.",
        variant: "destructive",
      })
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

  return (
    <div className="rounded-md border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Quantidade</TableHead>
            <TableHead className="font-semibold">Lote</TableHead>
            <TableHead className="font-semibold">Fornecedor</TableHead>
            <TableHead className="font-semibold">Data Entrada</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materiaPrima.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50">
              <TableCell>{item.descricao}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {item.quantidade_estoque}
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
            { key: "descricao", label: "Nome" },
            {
              key: "quantidade_estoque",
              label: "Quantidade",
              render: (value) => `${value}`,
            },
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
        <EditDialog
          open={!!editItem}
          onOpenChange={() => setEditItem(null)}
          title="Editar Matéria-Prima"
          data={editItem}
          fields={[
            { key: "descricao", label: "Nome", required: true },
            { key: "quantidade_estoque", label: "Quantidade", type: "number", required: true },
            { key: "lote", label: "Lote" },
            { key: "fornecedor", label: "Fornecedor", required: true },
            { key: "data_entrada", label: "Data de Entrada", type: "date" },
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
