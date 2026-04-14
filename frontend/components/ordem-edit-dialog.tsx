"use client"

import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type OrdemData = Record<string, any>

interface OrdemEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: OrdemData
  onSave: () => void
}

// ── Fabricação ──────────────────────────────────────────────────────────────

const defaultFabric = {
  projeto: "", partNumber: "", numeroSerie: "", nomePeca: "", requerente: "",
  fornecedor: "", material: "", formaMateriaPrima: "", numeroLote: "",
  processoFabricacao: "", dataInicio: "", dataEntrega: "", desenho3D: "",
  desenho2D: "", aprovadorNome: "", aprovadorData: "",
}

function FabricacaoForm({ form, onChange }: { form: typeof defaultFabric; onChange: (k: string, v: string) => void }) {
  const field = (key: string, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <Input
        type={type}
        value={(form as any)[key] ?? ""}
        onChange={(e) => onChange(key, e.target.value)}
        placeholder={placeholder}
        className="h-8 text-sm"
      />
    </div>
  )

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1">1. Identificação Geral</p>
      <div className="grid grid-cols-2 gap-3">
        {field("projeto", "Projeto", "text", "Nome do projeto")}
        {field("partNumber", "Part Number", "text", "PN-XXXX")}
        {field("numeroSerie", "N° de Série", "text", "SN-XXXX")}
        {field("nomePeca", "Nome da Peça")}
        {field("requerente", "Requerente")}
        {field("fornecedor", "Fornecedor")}
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">2. Dados Técnicos</p>
      <div className="grid grid-cols-2 gap-3">
        {field("material", "Material", "text", "Ex: Alumínio 7075-T6")}
        {field("formaMateriaPrima", "Forma da Matéria Prima", "text", "Ex: Chapa, Barra")}
        {field("numeroLote", "N° do Lote")}
        {field("processoFabricacao", "Processo de Fabricação", "text", "Ex: Usinagem CNC")}
        {field("dataInicio", "Data de Início", "date")}
        {field("dataEntrega", "Data de Entrega", "date")}
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">3. Documentos</p>
      <div className="grid grid-cols-2 gap-3">
        {field("desenho3D", "Desenho 3D (Código)")}
        {field("desenho2D", "Desenho 2D (Código)")}
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">4. Aprovação</p>
      <div className="grid grid-cols-2 gap-3">
        {field("aprovadorNome", "Aprovador")}
        {field("aprovadorData", "Data Aprovação", "date")}
      </div>
    </div>
  )
}

// ── Produção ─────────────────────────────────────────────────────────────────

const defaultProducao = {
  projeto: "", partNumber: "", nomeConjunto: "", relatorioInspecaoMontagem: "",
  modeloAeronave: "", matriculaAeronave: "", clienteProprietario: "",
  executante: "", responsavelEmissao: "",
  componentes: [{ item: 1, partNumber: "", numeroSerie: "", nomePeca: "", numeroOF: "" }],
  qualidade: [{ item: 1, partNumber: "", numeroSerie: "", relatorioInspecao: "", aprovado: "", responsavel: "" }],
  aprovadorProjeto: "", dataProjeto: "", aprovadorProducao: "", dataProducao: "",
  aprovadorQualidade: "", dataQualidade: "",
}

function ProducaoForm({ form, setForm }: {
  form: typeof defaultProducao
  setForm: (v: typeof defaultProducao) => void
}) {
  const onFlat = (k: string, v: string) => setForm({ ...form, [k]: v })

  const field = (key: string, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <Input type={type} value={(form as any)[key] ?? ""} onChange={(e) => onFlat(key, e.target.value)} className="h-8 text-sm" />
    </div>
  )

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1">1. Identificação Geral</p>
      <div className="grid grid-cols-2 gap-3">
        {field("projeto", "Projeto")}
        {field("partNumber", "Part Number")}
        {field("nomeConjunto", "Nome do Conjunto")}
        {field("relatorioInspecaoMontagem", "Relatório Inspeção Montagem")}
        {field("modeloAeronave", "Modelo da Aeronave")}
        {field("matriculaAeronave", "Matrícula da Aeronave")}
        {field("clienteProprietario", "Cliente / Proprietário")}
        {field("executante", "Executante")}
        {field("responsavelEmissao", "Responsável pela Emissão")}
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">2. Lista de Componentes</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Item", "Part Number", "N° Série", "Nome da Peça", "N° OF", ""].map((h) => (
                <th key={h} className="border px-2 py-1 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.componentes.map((c, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 text-center">{c.item}</td>
                {(["partNumber", "numeroSerie", "nomePeca", "numeroOF"] as const).map((k) => (
                  <td key={k} className="border p-0.5">
                    <Input value={c[k]} onChange={(e) => {
                      const upd = [...form.componentes]
                      upd[i] = { ...upd[i], [k]: e.target.value }
                      setForm({ ...form, componentes: upd })
                    }} className="h-7 text-xs border-0 focus-visible:ring-0" />
                  </td>
                ))}
                <td className="border px-1">
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600"
                    onClick={() => setForm({ ...form, componentes: form.componentes.filter((_, j) => j !== i).map((x, j) => ({ ...x, item: j + 1 })) })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" variant="outline" size="sm" className="mt-1 h-7 text-xs" onClick={() =>
          setForm({ ...form, componentes: [...form.componentes, { item: form.componentes.length + 1, partNumber: "", numeroSerie: "", nomePeca: "", numeroOF: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">3. Controle de Qualidade</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Item", "Part Number", "N° Série", "Rel. Inspeção", "Aprovado", "Responsável", ""].map((h) => (
                <th key={h} className="border px-2 py-1 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.qualidade.map((q, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 text-center">{q.item}</td>
                {(["partNumber", "numeroSerie", "relatorioInspecao", "aprovado", "responsavel"] as const).map((k) => (
                  <td key={k} className="border p-0.5">
                    <Input value={q[k]} onChange={(e) => {
                      const upd = [...form.qualidade]
                      upd[i] = { ...upd[i], [k]: e.target.value }
                      setForm({ ...form, qualidade: upd })
                    }} className="h-7 text-xs border-0 focus-visible:ring-0" />
                  </td>
                ))}
                <td className="border px-1">
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600"
                    onClick={() => setForm({ ...form, qualidade: form.qualidade.filter((_, j) => j !== i).map((x, j) => ({ ...x, item: j + 1 })) })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" variant="outline" size="sm" className="mt-1 h-7 text-xs" onClick={() =>
          setForm({ ...form, qualidade: [...form.qualidade, { item: form.qualidade.length + 1, partNumber: "", numeroSerie: "", relatorioInspecao: "", aprovado: "", responsavel: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">4. Aprovações</p>
      <div className="grid grid-cols-2 gap-3">
        {field("aprovadorProjeto", "Aprovador (Projeto)")}
        {field("dataProjeto", "Data (Projeto)", "date")}
        {field("aprovadorProducao", "Aprovador (Produção)")}
        {field("dataProducao", "Data (Produção)", "date")}
        {field("aprovadorQualidade", "Aprovador (Qualidade)")}
        {field("dataQualidade", "Data (Qualidade)", "date")}
      </div>
    </div>
  )
}

// ── Projeto ───────────────────────────────────────────────────────────────────

const defaultProjeto = {
  projeto: "", partNumber: "", modelosAplicaveis: "", fornecedor: "",
  cargaHoraria: "", previsaoEntrega: "", observacoes: "",
  requisitosGerais: [{ codigo: "RG-001", definicao: "", criticidade: "", status: "" }],
  documentacao: [
    { descricao: "Desenho 3D da peça", nomeArquivo: "", status: "", dataAtualizacao: "" },
    { descricao: "Desenho 2D da peça", nomeArquivo: "", status: "", dataAtualizacao: "" },
  ],
  cronograma: [{ fase: "", descricao: "", dataPrevista: "" }],
  modificacoes: [] as { descricao: string; documentosAfetados: string; acaoRealizada: string; status: string; dataStatus: string }[],
  aprovadorInicio: "", dataInicio: "", aprovadorEncerramento: "", dataEncerramento: "",
}

function ProjetoForm({ form, setForm }: {
  form: typeof defaultProjeto
  setForm: (v: typeof defaultProjeto) => void
}) {
  const onFlat = (k: string, v: string) => setForm({ ...form, [k]: v })

  const field = (key: string, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <Input type={type} value={(form as any)[key] ?? ""} onChange={(e) => onFlat(key, e.target.value)} className="h-8 text-sm" />
    </div>
  )

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1">1. Identificação</p>
      <div className="grid grid-cols-2 gap-3">
        {field("projeto", "Projeto")}
        {field("partNumber", "Part Number")}
        {field("modelosAplicaveis", "Modelos Aplicáveis")}
        {field("fornecedor", "Fornecedor")}
        {field("cargaHoraria", "Carga Horária")}
        {field("previsaoEntrega", "Previsão de Entrega", "date")}
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">2. Requisitos Gerais</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Código", "Definição", "Criticidade", "Status", ""].map((h) => (
                <th key={h} className="border px-2 py-1 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.requisitosGerais.map((r, i) => (
              <tr key={i}>
                {(["codigo", "definicao", "criticidade", "status"] as const).map((k) => (
                  <td key={k} className="border p-0.5">
                    <Input value={r[k]} onChange={(e) => {
                      const upd = [...form.requisitosGerais]
                      upd[i] = { ...upd[i], [k]: e.target.value }
                      setForm({ ...form, requisitosGerais: upd })
                    }} className="h-7 text-xs border-0 focus-visible:ring-0" />
                  </td>
                ))}
                <td className="border px-1">
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600"
                    onClick={() => setForm({ ...form, requisitosGerais: form.requisitosGerais.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" variant="outline" size="sm" className="mt-1 h-7 text-xs" onClick={() =>
          setForm({ ...form, requisitosGerais: [...form.requisitosGerais, { codigo: `RG-${String(form.requisitosGerais.length + 1).padStart(3, "0")}`, definicao: "", criticidade: "", status: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">3. Documentação</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Descrição", "Arquivo", "Status", "Data Atualização", ""].map((h) => (
                <th key={h} className="border px-2 py-1 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.documentacao.map((d, i) => (
              <tr key={i}>
                {(["descricao", "nomeArquivo", "status", "dataAtualizacao"] as const).map((k) => (
                  <td key={k} className="border p-0.5">
                    <Input value={d[k]} onChange={(e) => {
                      const upd = [...form.documentacao]
                      upd[i] = { ...upd[i], [k]: e.target.value }
                      setForm({ ...form, documentacao: upd })
                    }} className="h-7 text-xs border-0 focus-visible:ring-0" />
                  </td>
                ))}
                <td className="border px-1">
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600"
                    onClick={() => setForm({ ...form, documentacao: form.documentacao.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" variant="outline" size="sm" className="mt-1 h-7 text-xs" onClick={() =>
          setForm({ ...form, documentacao: [...form.documentacao, { descricao: "", nomeArquivo: "", status: "", dataAtualizacao: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">4. Cronograma</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Fase", "Descrição", "Data Prevista", ""].map((h) => (
                <th key={h} className="border px-2 py-1 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.cronograma.map((c, i) => (
              <tr key={i}>
                {(["fase", "descricao", "dataPrevista"] as const).map((k) => (
                  <td key={k} className="border p-0.5">
                    <Input value={c[k]} onChange={(e) => {
                      const upd = [...form.cronograma]
                      upd[i] = { ...upd[i], [k]: e.target.value }
                      setForm({ ...form, cronograma: upd })
                    }} className="h-7 text-xs border-0 focus-visible:ring-0" />
                  </td>
                ))}
                <td className="border px-1">
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600"
                    onClick={() => setForm({ ...form, cronograma: form.cronograma.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" variant="outline" size="sm" className="mt-1 h-7 text-xs" onClick={() =>
          setForm({ ...form, cronograma: [...form.cronograma, { fase: "", descricao: "", dataPrevista: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">5. Modificações</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Descrição", "Docs Afetados", "Ação", "Status", "Data", ""].map((h) => (
                <th key={h} className="border px-2 py-1 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.modificacoes.map((m, i) => (
              <tr key={i}>
                {(["descricao", "documentosAfetados", "acaoRealizada", "status", "dataStatus"] as const).map((k) => (
                  <td key={k} className="border p-0.5">
                    <Input value={m[k]} onChange={(e) => {
                      const upd = [...form.modificacoes]
                      upd[i] = { ...upd[i], [k]: e.target.value }
                      setForm({ ...form, modificacoes: upd })
                    }} className="h-7 text-xs border-0 focus-visible:ring-0" />
                  </td>
                ))}
                <td className="border px-1">
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600"
                    onClick={() => setForm({ ...form, modificacoes: form.modificacoes.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" variant="outline" size="sm" className="mt-1 h-7 text-xs" onClick={() =>
          setForm({ ...form, modificacoes: [...form.modificacoes, { descricao: "", documentosAfetados: "", acaoRealizada: "", status: "", dataStatus: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">6. Observações</p>
      <Textarea value={form.observacoes ?? ""} onChange={(e) => onFlat("observacoes", e.target.value)} rows={3} className="text-sm" />

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b pb-1 mt-2">7. Aprovações</p>
      <div className="grid grid-cols-2 gap-3">
        {field("aprovadorInicio", "Aprovador (Início)")}
        {field("dataInicio", "Data (Início)", "date")}
        {field("aprovadorEncerramento", "Aprovador (Encerramento)")}
        {field("dataEncerramento", "Data (Encerramento)", "date")}
      </div>
    </div>
  )
}

// ── Main Dialog ───────────────────────────────────────────────────────────────

export function OrdemEditDialog({ open, onOpenChange, data, onSave }: OrdemEditDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("Em Andamento")
  const [fabricForm, setFabricForm] = useState({ ...defaultFabric })
  const [producaoForm, setProducaoForm] = useState({ ...defaultProducao })
  const [projetoForm, setProjetoForm] = useState({ ...defaultProjeto })

  useEffect(() => {
    if (!open || !data) return
    setStatus(data.status ?? "Em Andamento")

    let parsed: any = {}
    try {
      parsed = data.dados_formulario ? JSON.parse(data.dados_formulario) : {}
    } catch {}

    const tipo = data.tipo_ordem
    if (tipo === "fabricacao") {
      setFabricForm({ ...defaultFabric, ...parsed })
    } else if (tipo === "producao") {
      setProducaoForm({
        ...defaultProducao,
        ...parsed,
        componentes: Array.isArray(parsed.componentes) ? parsed.componentes : defaultProducao.componentes,
        qualidade: Array.isArray(parsed.qualidade) ? parsed.qualidade : defaultProducao.qualidade,
      })
    } else if (tipo === "projeto") {
      setProjetoForm({
        ...defaultProjeto,
        ...parsed,
        requisitosGerais: Array.isArray(parsed.requisitosGerais) ? parsed.requisitosGerais : defaultProjeto.requisitosGerais,
        documentacao: Array.isArray(parsed.documentacao) ? parsed.documentacao : defaultProjeto.documentacao,
        cronograma: Array.isArray(parsed.cronograma) ? parsed.cronograma : defaultProjeto.cronograma,
        modificacoes: Array.isArray(parsed.modificacoes) ? parsed.modificacoes : defaultProjeto.modificacoes,
      })
    }
  }, [open, data])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) throw new Error("Sessão expirada")

      const tipo = data.tipo_ordem
      let formState: any
      let projeto = ""
      let partNumber = ""

      if (tipo === "fabricacao") {
        formState = fabricForm
        projeto = fabricForm.projeto
        partNumber = fabricForm.partNumber
      } else if (tipo === "producao") {
        formState = producaoForm
        projeto = producaoForm.projeto
        partNumber = producaoForm.partNumber
      } else {
        formState = projetoForm
        projeto = projetoForm.projeto
        partNumber = projetoForm.partNumber
      }

      const fd = new FormData()
      fd.append("dados_formulario", JSON.stringify(formState))
      fd.append("projeto", projeto)
      fd.append("part_number", partNumber)
      fd.append("status", status)

      const response = await fetch(`http://localhost:8080/api/ordens/${data.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Erro ao salvar ordem")
      }

      toast({ title: "Ordem atualizada com sucesso" })
      onOpenChange(false)
      onSave()
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tipo = data?.tipo_ordem ?? ""
  const tipoLabel = tipo === "fabricacao" ? "Fabricação" : tipo === "producao" ? "Produção" : "Projeto"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ordem — {data?.numero_ordem}</DialogTitle>
          <DialogDescription>Tipo: {tipoLabel}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Status (always shown) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fazer">Fazer</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type-specific form */}
          {tipo === "fabricacao" && (
            <FabricacaoForm form={fabricForm} onChange={(k, v) => setFabricForm((prev) => ({ ...prev, [k]: v }))} />
          )}
          {tipo === "producao" && (
            <ProducaoForm form={producaoForm} setForm={setProducaoForm} />
          )}
          {tipo === "projeto" && (
            <ProjetoForm form={projetoForm} setForm={setProjetoForm} />
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
