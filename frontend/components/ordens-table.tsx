"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, Download } from "lucide-react"
import Link from "next/link"
import { ViewDialog } from "@/components/view-dialog"
import { DeleteDialog } from "@/components/delete-dialog"

interface Ordem {
  id: number
  numero_ordem: string
  tipo_ordem: string
  projeto: string
  part_number: string
  status: string
  data_criacao: string
  arquivo_pdf?: string
  dados_formulario?: string
}

interface OrdensTableProps {
  ordens: Ordem[]
  onUpdate: () => void
}

export function OrdensTable({ ordens, onUpdate }: OrdensTableProps) {
  const router = useRouter()
  const [viewItem, setViewItem] = useState<Ordem | null>(null)
  const [deleteItem, setDeleteItem] = useState<Ordem | null>(null)

  const handleDownloadPDF = async (ordem: Ordem) => {
    if (!ordem.arquivo_pdf) {
      alert("PDF não disponível")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/uploads/${ordem.arquivo_pdf}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao baixar PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${ordem.numero_ordem}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Erro ao baixar PDF:", error)
      alert("Erro ao baixar PDF")
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/ordens/${deleteItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error("Erro ao excluir ordem")
      }

      setDeleteItem(null)
      onUpdate()
    } catch (error) {
      console.error("Erro ao excluir ordem:", error)
      alert("Erro ao excluir ordem")
    }
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
      case "fabricacao":
      case "fabricação":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "producao":
      case "produção":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "projeto":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const formatTipoDisplay = (tipo: string) => {
    if (tipo === "fabricacao") return "Fabricação"
    if (tipo === "producao") return "Produção"
    if (tipo === "projeto") return "Projeto"
    return tipo
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
                <Badge className={getTipoColor(item.tipo_ordem)}>{formatTipoDisplay(item.tipo_ordem)}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate font-medium">{item.projeto}</TableCell>
              <TableCell className="font-mono text-sm">{item.part_number}</TableCell>
              <TableCell>{new Date(item.data_criacao).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setViewItem(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {item.arquivo_pdf && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-blue-600 hover:text-blue-700"
                      onClick={() => handleDownloadPDF(item)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
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
          data={{
            ...viewItem,
            tipo_ordem_display: formatTipoDisplay(viewItem.tipo_ordem),
          }}
          fields={[
            { key: "numero_ordem", label: "Número" },
            {
              key: "tipo_ordem_display",
              label: "Tipo",
              render: (value) => <Badge>{value}</Badge>,
            },
            { key: "projeto", label: "Projeto" },
            { key: "part_number", label: "Part Number" },
            { key: "data_criacao", label: "Data de Criação", type: "date" },
            {
              key: "status",
              label: "Status",
              render: (value) => <Badge>{value}</Badge>,
            },
            {
              key: "arquivo_pdf",
              label: "PDF",
              render: (value) =>
                value ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleDownloadPDF(viewItem)}
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Baixar PDF
                  </Button>
                ) : (
                  <span className="text-slate-500">Não disponível</span>
                ),
            },
          ]}
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
