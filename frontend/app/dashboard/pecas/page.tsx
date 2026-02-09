import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Wrench, ArrowDownToLine } from "lucide-react"
import { PecasTable } from "@/components/pecas-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

export default function PecasPage() {
  const pecas = [
    {
      id: "1",
      codigo_peca: "PCA-001",
      descricao: "Suporte de Fixação Asa",
      numero_desenho: "DWG-12345",
      revisao: "B",
      quantidade_produzida: 10,
      unidade_medida: "UN",
      data_fabricacao: "2024-03-10",
      lote_producao: "LOT-PROD-001",
      operador_responsavel: "João Silva",
      maquina_utilizada: "CNC-01",
      tempo_fabricacao_horas: 24.5,
      status_qualidade: "Aprovada",
      observacoes: "Peça conforme especificação",
      created_at: "2024-03-10",
    },
    {
      id: "2",
      codigo_peca: "PCA-002",
      descricao: "Bracket de Sustentação",
      numero_desenho: "DWG-67890",
      revisao: "A",
      quantidade_produzida: 5,
      unidade_medida: "UN",
      data_fabricacao: "2024-03-15",
      lote_producao: "LOT-PROD-002",
      operador_responsavel: "Maria Santos",
      maquina_utilizada: "CNC-02",
      tempo_fabricacao_horas: 18.0,
      status_qualidade: "Em_Inspecao",
      observacoes: "Aguardando inspeção final",
      created_at: "2024-03-15",
    },
  ]

  const retiradas = [
    {
      id: "1",
      item_nome: "Suporte de Fixação Asa",
      quantidade: 2,
      pessoa: "Roberto Lima",
      data: "2024-03-16",
    },
    {
      id: "2",
      item_nome: "Bracket de Sustentação",
      quantidade: 1,
      pessoa: "Fernanda Costa",
      data: "2024-03-15",
    },
  ]

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
