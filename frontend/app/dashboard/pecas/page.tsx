"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Wrench, ArrowDownToLine, Loader } from "lucide-react"
import { PecasTable } from "@/components/pecas-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

export default function PecasPage() {
  const [pecas, setPecas] = useState<any[]>([])
  const [retiradas, setRetiradas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPecas = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        setError("Sessão expirada. Faça login novamente.")
        window.location.href = "/login"
        return
      }

      const response = await fetch("http://localhost:8080/api/pecas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("jwt_token")
        window.location.href = "/login"
        return
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar peças")
      }

      const data = await response.json()
      setPecas(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const fetchRetiradas = async () => {
    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const response = await fetch("http://localhost:8080/api/retiradas/tipo/peca", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("jwt_token")
        window.location.href = "/login"
        return
      }

      if (!response.ok) throw new Error("Erro ao carregar retiradas")
      const data = await response.json()
      setRetiradas(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Erro ao buscar retiradas:", err)
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

      await fetchPecas()
      await fetchRetiradas()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      setError(message)
    }
  }

  useEffect(() => {
    fetchPecas()
    fetchRetiradas()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader className="h-8 w-8 animate-spin text-orange-600" />
            <p className="text-slate-600">Carregando peças...</p>
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
            <Wrench className="h-8 w-8 text-orange-600" />
            Peças Fabricadas
          </h1>
          <p className="text-slate-600 mt-1">Registro de peças produzidas e controle de qualidade</p>
        </div>
        <div className="flex gap-3">
          {pecas.length > 0 && (
            <RetiradaDialog
              consumiveis={pecas.map((p) => ({
                id: p.id,
                nome: p.descricao,
                part_number: p.codigo_peca,
                quantidade: p.quantidade_produzida,
              }))}
              tipo="peca"
              onRetiradaAdded={() => {
                fetchPecas()
                fetchRetiradas()
              }}
            >
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Retirada
              </Button>
            </RetiradaDialog>
          )}
          <Link href="/dashboard/pecas/novo">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Peça
            </Button>
          </Link>
        </div>
      </div>

      {error && !loading && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {error}
          <button onClick={fetchPecas} className="ml-4 underline font-semibold hover:no-underline">
            Tentar Novamente
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Peças Fabricadas</CardTitle>
          <CardDescription>
            {pecas.length} {pecas.length === 1 ? "peça cadastrada" : "peças cadastradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PecasTable
            pecas={pecas}
            onChanged={async () => {
              await fetchPecas()
              await fetchRetiradas()
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Retiradas</CardTitle>
          <CardDescription>Últimas retiradas de peças do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <RetiradasTable retiradas={retiradas} onDelete={handleDeleteRetirada} />
        </CardContent>
      </Card>
    </div>
  )
}
