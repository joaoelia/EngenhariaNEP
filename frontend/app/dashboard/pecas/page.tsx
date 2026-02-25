import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Wrench, ArrowDownToLine } from "lucide-react"
import { PecasTable } from "@/components/pecas-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

export default function PecasPage() {
  const pecas: any[] = []

  const retiradas: any[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Wrench className="h-8 w-8 text-orange-600" />
            Peças Fabricadas
          </h1>
          <p className="text-slate-600 mt-1">Registro de peças produzidas e controle de qualidade</p>
        </div>
        <div className="flex gap-3">
          <RetiradaDialog consumiveis={pecas.map(p => ({ 
            id: p.id, 
            nome: p.descricao, 
            part_number: p.codigo_peca, 
            quantidade: p.quantidade_produzida 
          }))} tipo="peca">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Retirada
            </Button>
          </RetiradaDialog>
          <Link href="/dashboard/pecas/novo">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Peça
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Peças Fabricadas</CardTitle>
          <CardDescription>
            {pecas.length} {pecas.length === 1 ? "peça cadastrada" : "peças cadastradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PecasTable pecas={pecas} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Retiradas</CardTitle>
          <CardDescription>Últimas retiradas de peças do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <RetiradasTable retiradas={retiradas} />
        </CardContent>
      </Card>
    </div>
  )
}
