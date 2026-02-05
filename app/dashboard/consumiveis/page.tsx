import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Package, ArrowDownToLine } from "lucide-react"
import { ConsumiveisTable } from "@/components/consumiveis-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

export default async function ConsumiveisPage() {
  const consumiveis = [
    {
      id: "1",
      nome: "Parafuso Allen M6x20",
      part_number: "PN-001",
      quantidade: 500,
      fornecedor: "Fornecedor ABC",
      local_estoque: "Estoque A - Prateleira 3",
    },
    {
      id: "2",
      nome: "Graxa Industrial",
      part_number: "PN-002",
      quantidade: 25,
      fornecedor: "Distribuidora Técnica",
      local_estoque: "Estoque B - Armário 1",
    },
    {
      id: "3",
      nome: "Rebite 4.8x12mm",
      part_number: "PN-003",
      quantidade: 1200,
      fornecedor: "Metalúrgica XYZ",
      local_estoque: "Estoque A - Prateleira 5",
    },
  ]

  const retiradas = [
    {
      id: "1",
      item_nome: "Parafuso Allen M6x20",
      quantidade: 50,
      pessoa: "João Silva",
      data: "2024-03-15",
    },
    {
      id: "2",
      item_nome: "Graxa Industrial",
      quantidade: 5,
      pessoa: "Maria Santos",
      data: "2024-03-14",
    },
    {
      id: "3",
      item_nome: "Rebite 4.8x12mm",
      quantidade: 100,
      pessoa: "Pedro Costa",
      data: "2024-03-13",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            Consumíveis
          </h1>
          <p className="text-slate-600 mt-1">Gerenciamento de consumíveis e materiais</p>
        </div>
        <div className="flex gap-3">
          <RetiradaDialog consumiveis={consumiveis}>
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Retirada
            </Button>
          </RetiradaDialog>
          <Link href="/dashboard/consumiveis/novo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Consumível
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Consumíveis</CardTitle>
          <CardDescription>
            {consumiveis.length} {consumiveis.length === 1 ? "consumível cadastrado" : "consumíveis cadastrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsumiveisTable consumiveis={consumiveis} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Retiradas</CardTitle>
          <CardDescription>
            {retiradas.length} {retiradas.length === 1 ? "retirada registrada" : "retiradas registradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RetiradasTable retiradas={retiradas} />
        </CardContent>
      </Card>
    </div>
  )
}
