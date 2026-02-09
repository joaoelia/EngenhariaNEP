import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Box, Wrench, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // const supabase = await createClient()

  // Buscar estatísticas
  // const [consumiveis, materiaPrima, pecas, ordens] = await Promise.all([
  //   supabase.from("consumiveis").select("id", { count: "exact" }),
  //   supabase.from("materia_prima").select("id", { count: "exact" }),
  //   supabase.from("pecas_fabricadas").select("id", { count: "exact" }),
  //   supabase.from("ordens").select("id", { count: "exact" }),
  // ])

  const stats = [
    {
      title: "Consumíveis",
      count: 12,
      icon: Package,
      href: "/dashboard/consumiveis",
      color: "bg-blue-500",
    },
    {
      title: "Matéria-Prima",
      count: 8,
      icon: Box,
      href: "/dashboard/materia-prima",
      color: "bg-green-500",
    },
    {
      title: "Peças Fabricadas",
      count: 24,
      icon: Wrench,
      href: "/dashboard/pecas",
      color: "bg-orange-500",
    },
    {
      title: "Ordens",
      count: 15,
      icon: ClipboardList,
      href: "/dashboard/ordens",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance">Dashboard de Gerenciamento</h1>
        <p className="text-slate-600 mt-2">Visão geral do sistema de controle industrial</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stat.count}</div>
                  <CardDescription className="text-xs mt-1">Total de registros</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Bem-vindo ao Sistema</CardTitle>
            <CardDescription>Sistema de Gerenciamento Industrial</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gerencie consumíveis, matéria-prima, peças fabricadas e ordens de produção de forma integrada e eficiente.
              Navegue pelos menus ao lado para acessar cada módulo.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Ações Rápidas</CardTitle>
            <CardDescription>Acesse os principais módulos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/dashboard/consumiveis/novo"
              className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Adicionar Consumível
            </Link>
            <Link
              href="/dashboard/materia-prima/novo"
              className="block text-sm text-green-600 hover:text-green-700 font-medium"
            >
              + Adicionar Matéria-Prima
            </Link>
            <Link
              href="/dashboard/pecas/novo"
              className="block text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              + Adicionar Peça Fabricada
            </Link>
            <Link
              href="/dashboard/ordens/novo"
              className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              + Criar Nova Ordem
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
