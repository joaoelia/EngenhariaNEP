import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, ClipboardList } from "lucide-react"
import { OrdensTable } from "@/components/ordens-table"

export default function OrdensPage() {
  const ordens = [
    {
      id: "1",
      numero_ordem: "OP-2025-001",
      tipo_ordem: "Produção",
      projeto: "Suportes Asa Direita",
      partNumber: "PN-5438-02",
      status: "Em Andamento",
      data_criacao: "2025-01-05",
    },
    {
      id: "2",
      numero_ordem: "OF-2025-002",
      tipo_ordem: "Fabricação",
      projeto: "Bracket Protótipo",
      partNumber: "PN-2891-01",
      status: "Concluída",
      data_criacao: "2025-01-10",
    },
    {
      id: "3",
      numero_ordem: "OPJ-2025-003",
      tipo_ordem: "Projeto",
      projeto: "Sistema de Controle",
      partNumber: "PN-7712-05",
      status: "Em Andamento",
      data_criacao: "2025-01-15",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-purple-600" />
            Ordens
          </h1>
          <p className="text-slate-600 mt-1">Gerenciamento de ordens de produção, fabricação e projetos</p>
        </div>
        <Link href="/dashboard/ordens/novo">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Ordem
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens</CardTitle>
          <CardDescription>
            {ordens.length} {ordens.length === 1 ? "ordem cadastrada" : "ordens cadastradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdensTable ordens={ordens} />
        </CardContent>
      </Card>
    </div>
  )
}
