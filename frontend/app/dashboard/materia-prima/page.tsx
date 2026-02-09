import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Box, ArrowDownToLine } from "lucide-react"
import { MateriaPrimaTable } from "@/components/materia-prima-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

export default function MateriaPrimaPage() {
  const materiaPrima = [
    {
      id: "1",
      codigo: "MP-001",
      descricao: "Chapa de Alumínio 6061-T6",
      tipo_material: "Alumínio",
      densidade: 2.7,
      especificacao: "AMS 4911",
      quantidade_estoque: 150.5,
      unidade_medida: "KG",
      lote: "LOT-2024-001",
      data_entrada: "2024-01-10",
      fornecedor: "Alumínio Brasil LTDA",
      certificado_qualidade: "CERT-2024-001",
      observacoes: "Material certificado para uso aeronáutico",
      created_at: "2024-01-10",
    },
    {
      id: "2",
      codigo: "MP-002",
      descricao: "Aço Inoxidável 304",
      tipo_material: "Aço",
      densidade: 7.9,
      especificacao: "ASTM A240",
      quantidade_estoque: 200.0,
      unidade_medida: "KG",
      lote: "LOT-2024-002",
      data_entrada: "2024-02-15",
      fornecedor: "Aços Especiais SA",
      certificado_qualidade: "CERT-2024-002",
      observacoes: "Resistente à corrosão",
      created_at: "2024-02-15",
    },
  ]

  const retiradas = [
    {
      id: "1",
      item_nome: "Chapa de Alumínio 6061-T6",
      quantidade: 10.5,
      pessoa: "Carlos Oliveira",
      data: "2024-03-15",
    },
    {
      id: "2",
      item_nome: "Aço Inoxidável 304",
      quantidade: 5.0,
      pessoa: "Ana Paula",
      data: "2024-03-14",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Box className="h-8 w-8 text-green-600" />
            Matéria-Prima
          </h1>
          <p className="text-slate-600 mt-1">Gerenciamento de materiais e insumos</p>
        </div>
        <div className="flex gap-3">
          <RetiradaDialog consumiveis={materiaPrima.map(mp => ({ 
            id: mp.id, 
            nome: mp.descricao, 
            part_number: mp.codigo, 
            quantidade: mp.quantidade_estoque 
          }))} tipo="materia-prima">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Retirada
            </Button>
          </RetiradaDialog>
          <Link href="/dashboard/materia-prima/novo">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Matéria-Prima
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Matéria-Prima</CardTitle>
          <CardDescription>
            {materiaPrima.length} {materiaPrima.length === 1 ? "material cadastrado" : "materiais cadastrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MateriaPrimaTable materiaPrima={materiaPrima} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Retiradas</CardTitle>
          <CardDescription>Últimas retiradas de matéria-prima do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <RetiradasTable retiradas={retiradas} />
        </CardContent>
      </Card>
    </div>
  )
}
