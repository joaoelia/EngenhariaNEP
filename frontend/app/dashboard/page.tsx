"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Box, Wrench, ClipboardList, Loader } from "lucide-react"
import Link from "next/link"

interface Stat {
  title: string
  count: number | null
  icon: any
  href: string
  color: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Consumíveis",
      count: null,
      icon: Package,
      href: "/dashboard/consumiveis",
      color: "bg-blue-500",
    },
    {
      title: "Matéria-Prima",
      count: null,
      icon: Box,
      href: "/dashboard/materia-prima",
      color: "bg-green-500",
    },
    {
      title: "Peças Fabricadas",
      count: null,
      icon: Wrench,
      href: "/dashboard/pecas",
      color: "bg-orange-500",
    },
    {
      title: "Ordens",
      count: null,
      icon: ClipboardList,
      href: "/dashboard/ordens",
      color: "bg-purple-500",
    },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt_token")
        if (!token) return

        const endpoints = [
          { name: 0, url: "http://localhost:8080/api/consumiveis" },
          { name: 1, url: "http://localhost:8080/api/materia-prima" },
          { name: 2, url: "http://localhost:8080/api/pecas" },
          { name: 3, url: "http://localhost:8080/api/ordens" },
        ]

        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            try {
              const response = await fetch(endpoint.url, {
                headers: { Authorization: `Bearer ${token}` },
              })
              if (!response.ok) throw new Error("Failed to fetch")
              const data = await response.json()
              return { index: endpoint.name, count: Array.isArray(data) ? data.length : 0 }
            } catch {
              return { index: endpoint.name, count: 0 }
            }
          })
        )

        setStats((prev) =>
          prev.map((stat, idx) => {
            const result = results.find((r) => r.index === idx)
            return { ...stat, count: result?.count ?? 0 }
          })
        )
      } catch (error) {
        // Error handling silently
      }
    }

    // Fetch immediate
    fetchStats()

    // Refresh a cada 10 segundos
    const interval = setInterval(fetchStats, 10000)

    // Refresh quando a página voltar ao foco
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

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
                  <div className="text-3xl font-bold text-slate-900">
                    {stat.count === null ? <Loader className="h-8 w-8 animate-spin" /> : stat.count}
                  </div>
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
