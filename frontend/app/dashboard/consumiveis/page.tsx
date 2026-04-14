"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Package, ArrowDownToLine, Loader, Filter } from "lucide-react"
import { ConsumiveisTable } from "@/components/consumiveis-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

interface Consumivel {
  id: number
  nome: string
  part_number: string
  quantidade: number
  estoque_minimo?: number
  estoque_maximo?: number
  status_estoque?: "OK" | "ABAIXO_MINIMO" | "ACIMA_MAXIMO"
  fornecedor: string
  local_estoque: string
}

type RetiradaDateFilter = "mes-atual" | "30" | "15" | "7" | "todos"

export default function ConsumiveisPage() {
  const [consumiveis, setConsumiveis] = useState<Consumivel[]>([])
  const [retiradas, setRetiradas] = useState<any[]>([])
  const [activeTable, setActiveTable] = useState<"consumiveis" | "retiradas">("consumiveis")
  const [retiradaDateFilter, setRetiradaDateFilter] = useState<RetiradaDateFilter>("mes-atual")
  const [showOnlyOutOfRange, setShowOnlyOutOfRange] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const parseRetiradaDate = (dateString?: string) => {
    if (!dateString) return null
    const [year, month, day] = dateString.split("-").map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day)
  }

  const filteredRetiradas = retiradas.filter((retirada) => {
    if (retiradaDateFilter === "todos") return true

    const retiradaDate = parseRetiradaDate(retirada?.data)
    if (!retiradaDate) return true

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (retiradaDateFilter === "mes-atual") {
      return retiradaDate.getMonth() === today.getMonth() && retiradaDate.getFullYear() === today.getFullYear()
    }

    const days = Number(retiradaDateFilter)
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - days + 1)
    return retiradaDate >= startDate && retiradaDate <= today
  })

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
      
      // Buscar retiradas
      fetchRetiradas()
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

      const response = await fetch("http://localhost:8080/api/retiradas/tipo/consumivel", {
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

  const handleDeleteRetirada = async (id: string, options: { quantidade: number; cancelarTudo: boolean }) => {
    try {
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const query = new URLSearchParams({
        cancelar_tudo: options.cancelarTudo ? "true" : "false",
      })

      if (!options.cancelarTudo) {
        query.append("quantidade", String(options.quantidade))
      }

      const response = await fetch(`http://localhost:8080/api/retiradas/${id}?${query.toString()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        let apiMessage = "Erro ao cancelar retirada"
        try {
          const errorData = await response.json()
          apiMessage = errorData?.message || errorData?.error || apiMessage
        } catch {
          // ignore parse error and keep default message
        }
        throw new Error(apiMessage)
      }

      await fetchConsumiveis()
      await fetchRetiradas()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      setError(message)
    }
  }

  // Deletar consumível
  const handleDelete = async (id: string | number, options: { quantidade: number; cancelarTudo: boolean }) => {
    try {
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const query = new URLSearchParams({
        cancelar_tudo: options.cancelarTudo ? "true" : "false",
      })

      if (!options.cancelarTudo) {
        query.append("quantidade", String(options.quantidade))
      }

      const response = await fetch(`http://localhost:8080/api/consumiveis/${id}?${query.toString()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        let apiMessage = "Erro ao deletar consumível"
        try {
          const errorData = await response.json()
          apiMessage = errorData?.message || errorData?.error || apiMessage
        } catch {
          // ignore parse error and keep default message
        }
        throw new Error(apiMessage)
      }

      await fetchConsumiveis()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"

      if (message.toLowerCase().includes("não encontrado") || message.toLowerCase().includes("not found")) {
        await fetchConsumiveis()
        return
      }

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
          part_number: data.part_number,
          quantidade: Number(data.quantidade),
          estoque_minimo: data.estoque_minimo !== "" && data.estoque_minimo !== undefined ? Number(data.estoque_minimo) : null,
          estoque_maximo: data.estoque_maximo !== "" && data.estoque_maximo !== undefined ? Number(data.estoque_maximo) : null,
          fornecedor: data.fornecedor,
          local_estoque: data.local_estoque,
        }),
      })

      if (!response.ok) {
        let apiMessage = "Erro ao atualizar consumível"
        try {
          const errorData = await response.json()
          apiMessage = errorData?.message || errorData?.error || apiMessage
        } catch {
          // ignore parse error and keep default message
        }
        throw new Error(apiMessage)
      }

      const updated = await response.json()
      setConsumiveis(consumiveis.map((c) => (c.id === id ? updated : c)))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      setError(message)
      throw err
    }
  }

  // Dados mockados de retiradas
  useEffect(() => {
    fetchConsumiveis()
  }, [])

  const displayedConsumiveis = showOnlyOutOfRange
    ? consumiveis.filter((item) => item.status_estoque === "ABAIXO_MINIMO" || item.status_estoque === "ACIMA_MAXIMO")
    : consumiveis

  return (
    <div className="h-[calc(100vh-4rem)] min-h-0 overflow-hidden flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Consumíveis
          </h1>
          <p className="text-slate-600 mt-0.5 text-sm">Gerenciamento de consumíveis e materiais</p>
        </div>
        <div className="flex gap-2">
          {consumiveis.length > 0 && (
            <RetiradaDialog consumiveis={consumiveis} onRetiradaAdded={fetchConsumiveis}>
              <Button className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700">
                <ArrowDownToLine className="h-3.5 w-3.5 mr-1.5" />
                Retirada
              </Button>
            </RetiradaDialog>
          )}
          <Link href="/dashboard/consumiveis/novo">
            <Button className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
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
        <Card className="min-h-0">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-slate-600">Carregando consumíveis...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="min-h-0 flex-1 flex flex-col">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-lg leading-none">
              {activeTable === "consumiveis" ? "Lista de Consumíveis" : "Histórico de Retiradas"}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {activeTable === "consumiveis"
                ? `${consumiveis.length} ${consumiveis.length === 1 ? "consumível cadastrado" : "consumíveis cadastrados"}`
                : `${filteredRetiradas.length} ${filteredRetiradas.length === 1 ? "retirada registrada" : "retiradas registradas"}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 px-4 pb-3 pt-0 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5" />
                  Filtro
                </span>
                <Button
                  type="button"
                  variant={retiradaDateFilter === "mes-atual" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setRetiradaDateFilter("mes-atual")}
                >
                  Mês atual
                </Button>
                <Button
                  type="button"
                  variant={retiradaDateFilter === "30" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setRetiradaDateFilter("30")}
                >
                  30 dias
                </Button>
                <Button
                  type="button"
                  variant={retiradaDateFilter === "15" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setRetiradaDateFilter("15")}
                >
                  15 dias
                </Button>
                <Button
                  type="button"
                  variant={retiradaDateFilter === "7" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setRetiradaDateFilter("7")}
                >
                  7 dias
                </Button>
                <Button
                  type="button"
                  variant={retiradaDateFilter === "todos" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setRetiradaDateFilter("todos")}
                >
                  Todos
                </Button>
                {activeTable === "consumiveis" && (
                  <Button
                    type="button"
                    variant={showOnlyOutOfRange ? "default" : "outline"}
                    className="h-8 px-2.5 text-xs"
                    onClick={() => setShowOnlyOutOfRange((prev) => !prev)}
                  >
                    {showOnlyOutOfRange ? "Mostrar todos" : "Fora da faixa"}
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                className="h-8 px-3 text-xs"
                onClick={() => setActiveTable(activeTable === "consumiveis" ? "retiradas" : "consumiveis")}
              >
                {activeTable === "consumiveis" ? "Histórico de Retiradas" : "Voltar para Lista"}
              </Button>
            </div>

            <div className="min-h-0 flex-1">
              {activeTable === "consumiveis" ? (
                <ConsumiveisTable consumiveis={displayedConsumiveis} onDelete={handleDelete} onEdit={handleEdit} />
              ) : (
                <RetiradasTable retiradas={filteredRetiradas} onDelete={handleDeleteRetirada} />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
