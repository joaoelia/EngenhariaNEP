"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Wrench, ArrowDownToLine, Loader, Filter } from "lucide-react"
import { PecasTable } from "@/components/pecas-table"
import { RetiradaDialog } from "@/components/retirada-dialog"
import { RetiradasTable } from "@/components/retiradas-table"

type DateFilter = "mes-atual" | "30-dias" | "15-dias" | "7-dias" | "todos"

function parseDateStr(dateStr: string | undefined): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split("-")
  if (parts.length !== 3) return null
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const day = parseInt(parts[2])
  return new Date(year, month, day)
}

function applyDateFilter<T>(items: T[], getDate: (item: T) => Date | null, filter: DateFilter): T[] {
  if (filter === "todos") return items
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return items.filter((item) => {
    const d = getDate(item)
    if (!d) return false
    if (filter === "mes-atual") {
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    }
    const daysMap: Record<string, number> = { "30-dias": 30, "15-dias": 15, "7-dias": 7 }
    const days = daysMap[filter]
    if (!days) return false
    const cutoff = new Date(today)
    cutoff.setDate(cutoff.getDate() - days)
    return d >= cutoff
  })
}

export default function PecasPage() {
  const [pecas, setPecas] = useState<any[]>([])
  const [retiradas, setRetiradas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTable, setActiveTable] = useState<"pecas" | "retiradas">("pecas")
  const [retiradaDateFilter, setRetiradaDateFilter] = useState<DateFilter>("todos")
  const [pecasDateFilter, setPecasDateFilter] = useState<DateFilter>("todos")
  const [showOnlyOutOfRange, setShowOnlyOutOfRange] = useState(false)

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

  const filteredRetiradas = applyDateFilter(retiradas, (r) => parseDateStr(r.data), retiradaDateFilter)
  const filteredPecasByDate = applyDateFilter(pecas, (p) => parseDateStr(p.data_fabricacao), pecasDateFilter)
  const filteredPecas = showOnlyOutOfRange
    ? filteredPecasByDate.filter((p) => p.status_estoque === "ABAIXO_MINIMO" || p.status_estoque === "ACIMA_MAXIMO")
    : filteredPecasByDate

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
                fornecedor: p.fornecedor || "Não informado",
                local_estoque: p.aeronave_instalada || "Não informado",
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
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div>
                <CardTitle>
                  {activeTable === "pecas" ? "Lista de Peças Fabricadas" : "Histórico de Retiradas"}
                </CardTitle>
                <CardDescription>
                  {activeTable === "pecas"
                    ? `${filteredPecas.length} ${filteredPecas.length === 1 ? "peça cadastrada" : "peças cadastradas"}`
                    : "Últimas retiradas de peças do estoque"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5" />
                  Filtro
                </span>
                {(["mes-atual", "30-dias", "15-dias", "7-dias", "todos"] as DateFilter[]).map((f) => (
                  <Button
                    key={f}
                    variant={
                      (activeTable === "pecas" ? pecasDateFilter : retiradaDateFilter) === f
                        ? "default"
                        : "outline"
                    }
                    className="h-8 px-2.5 text-xs"
                    onClick={() =>
                      activeTable === "pecas" ? setPecasDateFilter(f) : setRetiradaDateFilter(f)
                    }
                  >
                    {f === "mes-atual" ? "Mês atual" : f === "todos" ? "Todos" : f.replace("-", " ")}
                  </Button>
                ))}
                {activeTable === "pecas" && (
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
                onClick={() => setActiveTable(activeTable === "pecas" ? "retiradas" : "pecas")}
              >
                {activeTable === "pecas" ? "Histórico de Retiradas" : "Voltar para Lista"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTable === "pecas" ? (
            <PecasTable
              pecas={filteredPecas}
              onChanged={async () => {
                await fetchPecas()
                await fetchRetiradas()
              }}
            />
          ) : (
            <RetiradasTable retiradas={filteredRetiradas} onDelete={handleDeleteRetirada} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
