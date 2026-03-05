"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, ClipboardList } from "lucide-react"
import { OrdensTable } from "@/components/ordens-table"

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

export default function OrdensPage() {
  const router = useRouter()
  const [ordens, setOrdens] = useState<Ordem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrdens()
  }, [])

  const fetchOrdens = async () => {
    try {
      const token = localStorage.getItem("jwt_token")
      const response = await fetch("http://localhost:8080/api/ordens", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (response.ok) {
        const data = await response.json()
        setOrdens(data)
      }
    } catch (error) {
      // Error handling silently
    } finally {
      setLoading(false)
    }
  }

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
            {loading ? "Carregando..." : `${ordens.length} ${ordens.length === 1 ? "ordem cadastrada" : "ordens cadastradas"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdensTable ordens={ordens} onUpdate={fetchOrdens} />
        </CardContent>
      </Card>
    </div>
  )
}
