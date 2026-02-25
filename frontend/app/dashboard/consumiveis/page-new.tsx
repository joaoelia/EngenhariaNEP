"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Package, ArrowDownToLine, Loader } from "lucide-react"
import { ConsumiveisTable } from "@/components/consumiveis-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

interface Consumivel {
  id: string
  nome: string
  part_number: string
  quantidade: number
  fornecedor: string
  local_estoque: string
}

export default function ConsumiveisPage() {
  const [consumiveis, setConsumiveis] = useState<Consumivel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetching dados
  const fetchConsumiveis = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        setError("Token não encontrado. Por favor, faça login.")
        return
      }

      const response = await fetch("http://localhost:8080/api/consumiveis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao carregar consumíveis")
      }

      const data = await response.json()
      setConsumiveis(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  // Deletar consumível
  const handleDelete = async (id: string | number) => {
    try {
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const response = await fetch(`http://localhost:8080/api/consumiveis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar consumível")
      }

      setConsumiveis(consumiveis.filter((c) => c.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      setError(message)
      throw err
    }
  }

  // Editar consumível
  const handleEdit = async (id: string | number, data: Record<string, any>) => {
    try {
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const response = await fetch(`http://localhost:8080/api/consumiveis/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: data.nome,
          partNumber: data.part_number,
          quantidade: parseInt(data.quantidade),
          fornecedor: data.fornecedor,
          localEstoque: data.local_estoque,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar consumível")
      }

      const updated = await response.json()
      setConsumiveis(consumiveis.map((c) => (c.id === id ? updated : c)))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      setError(message)
      throw err
    }
  }

  // Dados mockados de retiradas (pode ser implementado depois)
  const retiradas: any[] = []

  useEffect(() => {
    fetchConsumiveis()
  }, [])

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
          {consumiveis.length > 0 && (
            <RetiradaDialog consumiveis={consumiveis}>
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Retirada
              </Button>
            </RetiradaDialog>
          )}
          <Link href="/dashboard/consumiveis/novo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Consumível
            </Button>
          </Link>
        </div>
      </div>

      {error && !loading && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={fetchConsumiveis}
            className="ml-4 underline font-semibold hover:no-underline"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-slate-600">Carregando consumíveis...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Lista de Consumíveis</CardTitle>
              <CardDescription>
                {consumiveis.length} {consumiveis.length === 1 ? "consumível cadastrado" : "consumíveis cadastrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumiveisTable 
                consumiveis={consumiveis}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </CardContent>
          </Card>

          {retiradas.length > 0 && (
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
          )}
        </>
      )}
    </div>
  )
}
