"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Box, ArrowDownToLine, Loader, Filter } from "lucide-react"
import { MateriaPrimaTable } from "@/components/materia-prima-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

type DateFilter = "mes-atual" | "30-dias" | "15-dias" | "7-dias" | "todos"

interface MateriaPrima {
  id: number
  descricao: string
  codigo: string
  quantidade_estoque: number
  estoque_minimo?: number
  estoque_maximo?: number
  status_estoque?: "OK" | "ABAIXO_MINIMO" | "ACIMA_MAXIMO"
  unidade_medida: string
  fornecedor: string
  lote?: string
  data_entrada?: string
  especificacao?: string
  tipo_material?: string
}

function parseRetiradaDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split("-")
  if (parts.length !== 3) return null
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const day = parseInt(parts[2])
  return new Date(year, month, day)
}

export default function MateriaPrimaPage() {
  const [materiaPrima, setMateriaPrima] = useState<MateriaPrima[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retiradas, setRetiradas] = useState<any[]>([])
  const [activeTable, setActiveTable] = useState<"materia-prima" | "retiradas">("materia-prima")
  const [retiradaDateFilter, setRetiradaDateFilter] = useState<DateFilter>("todos")
  const [materiaPrimaDateFilter, setMateriaPrimaDateFilter] = useState<DateFilter>("todos")
  const [showOnlyOutOfRange, setShowOnlyOutOfRange] = useState(false)

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

  const filteredRetiradas = retiradas.filter((retirada) => {
    if (retiradaDateFilter === "todos") return true

    const retiradaDate = parseRetiradaDate(retirada.data)
    if (!retiradaDate) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (retiradaDateFilter === "mes-atual") {
      return (
        retiradaDate.getMonth() === today.getMonth() &&
        retiradaDate.getFullYear() === today.getFullYear()
      )
    }

    const daysMap = { "30-dias": 30, "15-dias": 15, "7-dias": 7 }
    const days = daysMap[retiradaDateFilter]
    if (!days) return false

    const cutoffDate = new Date(today)
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return retiradaDate >= cutoffDate
  })

  const filteredMateriaPrimaByDate = materiaPrima.filter((item) => {
    if (materiaPrimaDateFilter === "todos") return true

    const entradaDate = parseRetiradaDate(item.data_entrada)
    if (!entradaDate) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (materiaPrimaDateFilter === "mes-atual") {
      return (
        entradaDate.getMonth() === today.getMonth() &&
        entradaDate.getFullYear() === today.getFullYear()
      )
    }

    const daysMap = { "30-dias": 30, "15-dias": 15, "7-dias": 7 }
    const days = daysMap[materiaPrimaDateFilter]
    if (!days) return false

    const cutoffDate = new Date(today)
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return entradaDate >= cutoffDate
  })

  const filteredMateriaPrima = showOnlyOutOfRange
    ? filteredMateriaPrimaByDate.filter((item) => item.status_estoque === "ABAIXO_MINIMO" || item.status_estoque === "ACIMA_MAXIMO")
    : filteredMateriaPrimaByDate

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
                quantidade: mp.quantidade_estoque || 0,
                fornecedor: mp.fornecedor || "Não informado",
                local_estoque: mp.lote || "Não informado",
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
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div>
                <CardTitle>
                  {activeTable === "materia-prima" ? "Lista de Matéria-Prima" : "Histórico de Retiradas"}
                </CardTitle>
                <CardDescription>
                  {activeTable === "materia-prima"
                    ? `${filteredMateriaPrima.length} ${filteredMateriaPrima.length === 1 ? "material cadastrado" : "materiais cadastrados"}`
                    : "Últimas retiradas de matéria-prima do estoque"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5" />
                  Filtro
                </span>
                <Button
                  variant={(activeTable === "retiradas" ? retiradaDateFilter : materiaPrimaDateFilter) === "mes-atual" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => {
                    if (activeTable === "retiradas") setRetiradaDateFilter("mes-atual")
                    else setMateriaPrimaDateFilter("mes-atual")
                  }}
                >
                  Mês atual
                </Button>
                <Button
                  variant={(activeTable === "retiradas" ? retiradaDateFilter : materiaPrimaDateFilter) === "30-dias" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => {
                    if (activeTable === "retiradas") setRetiradaDateFilter("30-dias")
                    else setMateriaPrimaDateFilter("30-dias")
                  }}
                >
                  30 dias
                </Button>
                <Button
                  variant={(activeTable === "retiradas" ? retiradaDateFilter : materiaPrimaDateFilter) === "15-dias" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => {
                    if (activeTable === "retiradas") setRetiradaDateFilter("15-dias")
                    else setMateriaPrimaDateFilter("15-dias")
                  }}
                >
                  15 dias
                </Button>
                <Button
                  variant={(activeTable === "retiradas" ? retiradaDateFilter : materiaPrimaDateFilter) === "7-dias" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => {
                    if (activeTable === "retiradas") setRetiradaDateFilter("7-dias")
                    else setMateriaPrimaDateFilter("7-dias")
                  }}
                >
                  7 dias
                </Button>
                <Button
                  variant={(activeTable === "retiradas" ? retiradaDateFilter : materiaPrimaDateFilter) === "todos" ? "default" : "outline"}
                  className="h-8 px-2.5 text-xs"
                  onClick={() => {
                    if (activeTable === "retiradas") setRetiradaDateFilter("todos")
                    else setMateriaPrimaDateFilter("todos")
                  }}
                >
                  Todos
                </Button>
                {activeTable === "materia-prima" && (
                  <Button
                    variant={showOnlyOutOfRange ? "default" : "outline"}
                    className="h-8 px-2.5 text-xs"
                    onClick={() => setShowOnlyOutOfRange((prev) => !prev)}
                  >
                    {showOnlyOutOfRange ? "Mostrar todos" : "Fora da faixa"}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-8 px-3 text-xs"
                onClick={() => setActiveTable(activeTable === "materia-prima" ? "retiradas" : "materia-prima")}
              >
                {activeTable === "materia-prima" ? "Histórico de Retiradas" : "Voltar para Lista"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTable === "materia-prima" ? (
            <MateriaPrimaTable materiaPrima={filteredMateriaPrima} />
          ) : (
            <RetiradasTable retiradas={filteredRetiradas} onDelete={handleDeleteRetirada} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
