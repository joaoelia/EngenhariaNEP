"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Box, ArrowDownToLine, Loader } from "lucide-react"
import { MateriaPrimaTable } from "@/components/materia-prima-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

interface MateriaPrima {
  id: number
  descricao: string
  codigo: string
  quantidade_estoque: number
  unidade_medida: string
  fornecedor: string
  lote?: string
  data_entrada?: string
  especificacao?: string
  tipo_material?: string
}

export default function MateriaPrimaPage() {
  const [materiaPrima, setMateriaPrima] = useState<MateriaPrima[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retiradas, setRetiradas] = useState<any[]>([])

  const fetchMateriaPrima = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        setError("Token não encontrado. Por favor, faça login.")
        return
      }

      const response = await fetch("http://localhost:8080/api/materia-prima", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao carregar matéria-prima")
      }

      const data = await response.json()
      setMateriaPrima(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const fetchRetiradas = async () => {
    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) return

      const response = await fetch("http://localhost:8080/api/retiradas/tipo/materia-prima", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Erro ao carregar retiradas")
      const data = await response.json()
      setRetiradas(Array.isArray(data) ? data : [])
    } catch (err) {
      // Error handling silently
    }
  }

  const handleDeleteRetirada = async (id: string) => {
    try {
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const response = await fetch(`http://localhost:8080/api/retiradas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar retirada")
      }

      await fetchMateriaPrima()
      await fetchRetiradas()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      setError(message)
    }
  }

  useEffect(() => {
    fetchMateriaPrima()
    fetchRetiradas()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-slate-600">Carregando matéria-prima...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          {materiaPrima.length > 0 && (
            <RetiradaDialog 
              consumiveis={materiaPrima.map((mp: any) => ({ 
                id: mp.id, 
                nome: mp.descricao, 
                part_number: mp.codigo, 
                quantidade: mp.quantidade_estoque || 0
              }))} 
              tipo="materia-prima"
              onRetiradaAdded={() => {
                fetchMateriaPrima()
                fetchRetiradas()
              }}
            >
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Retirada
              </Button>
            </RetiradaDialog>
          )}
          <Link href="/dashboard/materia-prima/novo">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Matéria-Prima
            </Button>
          </Link>
        </div>
      </div>

      {error && !loading && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={fetchMateriaPrima}
            className="ml-4 underline font-semibold hover:no-underline"
          >
            Tentar Novamente
          </button>
        </div>
      )}

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
          <RetiradasTable retiradas={retiradas} onDelete={handleDeleteRetirada} />
        </CardContent>
      </Card>
    </div>
  )
}
