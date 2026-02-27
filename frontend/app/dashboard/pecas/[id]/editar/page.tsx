"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PecaForm } from "@/components/peca-form"

interface Peca {
  id: string
  codigo_peca: string
  descricao: string
  numero_serie?: string
  numero_desenho: string
  aeronave_instalada?: string
  relatorio_inspecao?: string
  fotos?: string
  quantidade_produzida: number
  data_fabricacao: string
  operador_responsavel: string
  status_qualidade: string
}

export default function EditarPecaPage() {
  const params = useParams()
  const router = useRouter()
  const [peca, setPeca] = useState<Peca | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPeca = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("jwt_token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`http://localhost:8080/api/pecas/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          localStorage.removeItem("jwt_token")
          router.push("/login")
          return
        }

        if (!response.ok) {
          throw new Error("Erro ao carregar peça")
        }

        const data = await response.json()
        setPeca(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar peça")
      } finally {
        setLoading(false)
      }
    }

    fetchPeca()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
        </div>
      </div>
    )
  }

  if (error || !peca) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Erro ao carregar peça</h1>
          <p className="text-muted-foreground">{error || "Peça não encontrada"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Peça Fabricada</h1>
        <p className="text-muted-foreground">Atualize os dados da peça: {peca.codigo_peca}</p>
      </div>
      <PecaForm initialData={peca} />
    </div>
  )
}
