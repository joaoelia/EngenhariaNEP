"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import jsPDF from "jspdf"

interface RequisitoGeral {
  codigo: string
  definicao: string
  criticidade: string
  status: string
}

interface Documentacao {
  descricao: string
  nomeArquivo: string
  status: string
  dataAtualizacao: string
}

interface Cronograma {
  fase: string
  descricao: string
  dataPrevista: string
}

interface Modificacao {
  descricao: string
  documentosAfetados: string
  acaoRealizada: string
  status: string
  dataStatus: string
}

interface OrdemProjetoData {
  projeto: string
  partNumber: string
  modelosAplicaveis: string
  fornecedor: string
  cargaHoraria: string
  previsaoEntrega: string
  requisitosGerais: RequisitoGeral[]
  documentacao: Documentacao[]
  cronograma: Cronograma[]
  modificacoes: Modificacao[]
  observacoes: string
  aprovadorInicio: string
  dataInicio: string
  aprovadorEncerramento: string
  dataEncerramento: string
}

export function OrdemProjetoForm() {
  const [formData, setFormData] = useState<OrdemProjetoData>({
    projeto: "",
    partNumber: "",
    modelosAplicaveis: "",
    fornecedor: "",
    cargaHoraria: "",
    previsaoEntrega: "",
    requisitosGerais: [{ codigo: "RG-001", definicao: "", criticidade: "", status: "" }],
    documentacao: [
      { descricao: "Desenho 3D da peça", nomeArquivo: "", status: "", dataAtualizacao: "" },
      { descricao: "Desenho 2D da peça", nomeArquivo: "", status: "", dataAtualizacao: "" },
      { descricao: "Desenho 3D do conjunto", nomeArquivo: "", status: "", dataAtualizacao: "" },
      { descricao: "Desenho 2D do conjunto", nomeArquivo: "", status: "", dataAtualizacao: "" },
      { descricao: "Manual de Montagem do Conjunto", nomeArquivo: "", status: "", dataAtualizacao: "" },
      { descricao: "Relatório de Substanciação", nomeArquivo: "", status: "", dataAtualizacao: "" },
      { descricao: "Datasheet", nomeArquivo: "", status: "", dataAtualizacao: "" },
    ],
    cronograma: [{ fase: "", descricao: "", dataPrevista: "" }],
    modificacoes: [{ descricao: "", documentosAfetados: "", acaoRealizada: "", status: "", dataStatus: "" }],
    observacoes: "",
    aprovadorInicio: "",
    dataInicio: "",
    aprovadorEncerramento: "",
    dataEncerramento: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const addRequisito = () => {
    setFormData({
      ...formData,
      requisitosGerais: [
        ...formData.requisitosGerais,
        {
          codigo: `RG-${String(formData.requisitosGerais.length + 1).padStart(3, "0")}`,
          definicao: "",
          criticidade: "",
          status: "",
        },
      ],
    })
  }

  const removeRequisito = (index: number) => {
    setFormData({
      ...formData,
      requisitosGerais: formData.requisitosGerais.filter((_, i) => i !== index),
    })
  }

  const updateRequisito = (index: number, field: string, value: string) => {
    const newRequisitos = [...formData.requisitosGerais]
    newRequisitos[index] = { ...newRequisitos[index], [field]: value }
    setFormData({ ...formData, requisitosGerais: newRequisitos })
  }

  const updateDocumentacao = (index: number, field: string, value: string) => {
    const newDocumentacao = [...formData.documentacao]
    newDocumentacao[index] = { ...newDocumentacao[index], [field]: value }
    setFormData({ ...formData, documentacao: newDocumentacao })
  }

  const addCronograma = () => {
    setFormData({
      ...formData,
      cronograma: [...formData.cronograma, { fase: "", descricao: "", dataPrevista: "" }],
    })
  }

  const removeCronograma = (index: number) => {
    setFormData({
      ...formData,
      cronograma: formData.cronograma.filter((_, i) => i !== index),
    })
  }

  const updateCronograma = (index: number, field: string, value: string) => {
    const newCronograma = [...formData.cronograma]
    newCronograma[index] = { ...newCronograma[index], [field]: value }
    setFormData({ ...formData, cronograma: newCronograma })
  }

  const addModificacao = () => {
    setFormData({
      ...formData,
      modificacoes: [
        ...formData.modificacoes,
        { descricao: "", documentosAfetados: "", acaoRealizada: "", status: "", dataStatus: "" },
      ],
    })
  }

  const removeModificacao = (index: number) => {
    setFormData({
      ...formData,
      modificacoes: formData.modificacoes.filter((_, i) => i !== index),
    })
  }

  const updateModificacao = (index: number, field: string, value: string) => {
    const newModificacoes = [...formData.modificacoes]
    newModificacoes[index] = { ...newModificacoes[index], [field]: value }
    setFormData({ ...formData, modificacoes: newModificacoes })
  }

  const gerarPDF = () => {
    const doc = new jsPDF()
    const hoje = new Date().toLocaleDateString("pt-BR")

    // Cabeçalho
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("ORDEM DE PROJETO", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`OPJ-XXX-YY ${hoje}`, 105, 28, { align: "center" })
    doc.text("COP XXXX/XX", 105, 34, { align: "center" })

    doc.line(10, 40, 200, 40)

    let yPos = 50

    // Seção 1: IDENTIFICAÇÃO GERAL
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("1. IDENTIFICAÇÃO GERAL", 10, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`Projeto: ${formData.projeto}`, 10, yPos)
    yPos += 5
    doc.text(`Part Number: ${formData.partNumber}`, 10, yPos)
    yPos += 5
    doc.text(`Modelos aplicáveis: ${formData.modelosAplicaveis}`, 10, yPos)
    yPos += 5
    doc.text(`Fornecedor: ${formData.fornecedor}`, 10, yPos)
    yPos += 5
    doc.text(`Carga horária: ${formData.cargaHoraria}`, 10, yPos)
    yPos += 5
    doc.text(`Previsão de entrega: ${formData.previsaoEntrega}`, 10, yPos)

    // Seção 2: REQUISITOS TÉCNICOS
    yPos += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("2. REQUISITOS TÉCNICOS", 10, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text("2.1. Requisitos Gerais", 10, yPos)

    yPos += 6
    doc.setFontSize(8)
    doc.text("Código", 10, yPos)
    doc.text("Definição", 35, yPos)
    doc.text("Criticidade", 120, yPos)
    doc.text("Status", 160, yPos)

    formData.requisitosGerais.forEach((req) => {
      yPos += 5
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.setFont("helvetica", "normal")
      doc.text(req.codigo, 10, yPos)
      doc.text(req.definicao.substring(0, 50) || "-", 35, yPos)
      doc.text(req.criticidade || "-", 120, yPos)
      doc.text(req.status || "-", 160, yPos)
    })

    // Seção 3: DOCUMENTAÇÃO DE PROJETO
    yPos += 10
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("3. DOCUMENTAÇÃO DE PROJETO", 10, yPos)

    yPos += 8
    doc.setFontSize(8)
    doc.text("Descrição", 10, yPos)
    doc.text("Nome do arquivo", 80, yPos)
    doc.text("Status", 140, yPos)
    doc.text("Data", 170, yPos)

    formData.documentacao.forEach((doc_item) => {
      yPos += 5
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.setFont("helvetica", "normal")
      doc.text(doc_item.descricao.substring(0, 30), 10, yPos)
      doc.text(doc_item.nomeArquivo || "-", 80, yPos)
      doc.text(doc_item.status || "-", 140, yPos)
      doc.text(doc_item.dataAtualizacao || "-", 170, yPos)
    })

    // Seção 4: CRONOGRAMA
    yPos += 10
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("4. CRONOGRAMA", 10, yPos)

    yPos += 8
    doc.setFontSize(8)
    doc.text("Fase", 10, yPos)
    doc.text("Descrição", 60, yPos)
    doc.text("Data prevista", 150, yPos)

    formData.cronograma.forEach((cron) => {
      yPos += 5
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.setFont("helvetica", "normal")
      doc.text(cron.fase || "-", 10, yPos)
      doc.text(cron.descricao.substring(0, 40) || "-", 60, yPos)
      doc.text(cron.dataPrevista || "-", 150, yPos)
    })

    // Observações
    yPos += 10
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("6. OBSERVAÇÕES", 10, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    const obsLines = doc.splitTextToSize(formData.observacoes || "Nenhuma observação.", 180)
    doc.text(obsLines, 10, yPos)

    // Aprovações
    yPos += obsLines.length * 5 + 10
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("8. APROVAÇÃO PARA INÍCIO DE PROJETO", 10, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("NOME", 10, yPos)
    doc.text("DATA", 80, yPos)
    doc.text("ASSINATURA", 140, yPos)

    yPos += 6
    doc.text(formData.aprovadorInicio || "_________________", 10, yPos)
    doc.text(formData.dataInicio || "__/__/____", 80, yPos)
    doc.text("_________________", 140, yPos)

    yPos += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("9. APROVAÇÃO PARA ENCERRAMENTO DE PROJETO", 10, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("NOME", 10, yPos)
    doc.text("DATA", 80, yPos)
    doc.text("ASSINATURA", 140, yPos)

    yPos += 6
    doc.text(formData.aprovadorEncerramento || "_________________", 10, yPos)
    doc.text(formData.dataEncerramento || "__/__/____", 80, yPos)
    doc.text("_________________", 140, yPos)

    doc.setFontSize(8)
    doc.text("Nep Aviation Com. Imp. Exp. Ltda – Documento externo de controle de produção", 10, 285)

    doc.save(`Ordem-Projeto-${formData.partNumber || "documento"}.pdf`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Ordem de Projeto (OPJ)
        </CardTitle>
        <CardDescription>Preencha os dados para gerar a ordem de projeto</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Seção 1: Identificação Geral */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">1. Identificação Geral</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projeto">Projeto *</Label>
                <Input
                  id="projeto"
                  name="projeto"
                  value={formData.projeto}
                  onChange={handleChange}
                  placeholder="Nome do projeto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partNumber">Part Number *</Label>
                <Input
                  id="partNumber"
                  name="partNumber"
                  value={formData.partNumber}
                  onChange={handleChange}
                  placeholder="PN-XXXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelosAplicaveis">Modelos aplicáveis</Label>
                <Input
                  id="modelosAplicaveis"
                  name="modelosAplicaveis"
                  value={formData.modelosAplicaveis}
                  onChange={handleChange}
                  placeholder="Ex: EMB-145, EMB-175"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleChange}
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargaHoraria">Carga horária</Label>
                <Input
                  id="cargaHoraria"
                  name="cargaHoraria"
                  value={formData.cargaHoraria}
                  onChange={handleChange}
                  placeholder="Ex: 160 horas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previsaoEntrega">Previsão de entrega</Label>
                <Input
                  id="previsaoEntrega"
                  name="previsaoEntrega"
                  type="date"
                  value={formData.previsaoEntrega}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Requisitos Técnicos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">2. Requisitos Técnicos</h3>
              <Button type="button" onClick={addRequisito} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Requisito
              </Button>
            </div>

            {formData.requisitosGerais.map((req, index) => (
              <Card key={index} className="bg-slate-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Código</Label>
                        <Input value={req.codigo} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Definição</Label>
                        <Input
                          value={req.definicao}
                          onChange={(e) => updateRequisito(index, "definicao", e.target.value)}
                          placeholder="Definição do requisito"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Criticidade</Label>
                        <Select
                          value={req.criticidade}
                          onValueChange={(value) => updateRequisito(index, "criticidade", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Obrigatório">Obrigatório</SelectItem>
                            <SelectItem value="Desejável">Desejável</SelectItem>
                            <SelectItem value="Opcional">Opcional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={req.status} onValueChange={(value) => updateRequisito(index, "status", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Proposto">Proposto</SelectItem>
                            <SelectItem value="Implementado">Implementado</SelectItem>
                            <SelectItem value="Verificado">Verificado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formData.requisitosGerais.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeRequisito(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Seção 3: Documentação de Projeto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">3. Documentação de Projeto</h3>

            {formData.documentacao.map((doc_item, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-4 p-3 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input value={doc_item.descricao} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Nome do arquivo</Label>
                  <Input
                    value={doc_item.nomeArquivo}
                    onChange={(e) => updateDocumentacao(index, "nomeArquivo", e.target.value)}
                    placeholder="nome-arquivo.ext"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={doc_item.status} onValueChange={(value) => updateDocumentacao(index, "status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A fazer">A fazer</SelectItem>
                      <SelectItem value="Entregue">Entregue</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Recusado">Recusado</SelectItem>
                      <SelectItem value="Em revisão">Em revisão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de atualização</Label>
                  <Input
                    type="date"
                    value={doc_item.dataAtualizacao}
                    onChange={(e) => updateDocumentacao(index, "dataAtualizacao", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Seção 4: Cronograma */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">4. Cronograma</h3>
              <Button type="button" onClick={addCronograma} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Fase
              </Button>
            </div>

            {formData.cronograma.map((cron, index) => (
              <Card key={index} className="bg-slate-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Fase</Label>
                        <Input
                          value={cron.fase}
                          onChange={(e) => updateCronograma(index, "fase", e.target.value)}
                          placeholder="Nome da fase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Input
                          value={cron.descricao}
                          onChange={(e) => updateCronograma(index, "descricao", e.target.value)}
                          placeholder="Descrição da fase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data prevista</Label>
                        <Input
                          type="date"
                          value={cron.dataPrevista}
                          onChange={(e) => updateCronograma(index, "dataPrevista", e.target.value)}
                        />
                      </div>
                    </div>
                    {formData.cronograma.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeCronograma(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Seção 5: Histórico de Modificações */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">5. Histórico de Modificações</h3>
              <Button type="button" onClick={addModificacao} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Modificação
              </Button>
            </div>

            {formData.modificacoes.map((mod, index) => (
              <Card key={index} className="bg-slate-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid gap-4 md:grid-cols-5">
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Input
                          value={mod.descricao}
                          onChange={(e) => updateModificacao(index, "descricao", e.target.value)}
                          placeholder="Descrição"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Documentos afetados</Label>
                        <Input
                          value={mod.documentosAfetados}
                          onChange={(e) => updateModificacao(index, "documentosAfetados", e.target.value)}
                          placeholder="Documentos"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ação realizada</Label>
                        <Input
                          value={mod.acaoRealizada}
                          onChange={(e) => updateModificacao(index, "acaoRealizada", e.target.value)}
                          placeholder="Ação"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={mod.status} onValueChange={(value) => updateModificacao(index, "status", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Em análise">Em análise</SelectItem>
                            <SelectItem value="Em execução">Em execução</SelectItem>
                            <SelectItem value="Concluído">Concluído</SelectItem>
                            <SelectItem value="Recusado">Recusado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Data de status</Label>
                        <Input
                          type="date"
                          value={mod.dataStatus}
                          onChange={(e) => updateModificacao(index, "dataStatus", e.target.value)}
                        />
                      </div>
                    </div>
                    {formData.modificacoes.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeModificacao(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Seção 6: Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">6. Observações</h3>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações importantes</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Materiais a serem utilizados, processos de fabricação, uso destinado ao projeto, etc."
                rows={4}
              />
            </div>
          </div>

          {/* Aprovações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">8. Aprovações</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3">Aprovação para Início de Projeto</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="aprovadorInicio">Nome</Label>
                    <Input
                      id="aprovadorInicio"
                      name="aprovadorInicio"
                      value={formData.aprovadorInicio}
                      onChange={handleChange}
                      placeholder="Nome do aprovador"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">Data</Label>
                    <Input
                      id="dataInicio"
                      name="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Aprovação para Encerramento de Projeto</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="aprovadorEncerramento">Nome</Label>
                    <Input
                      id="aprovadorEncerramento"
                      name="aprovadorEncerramento"
                      value={formData.aprovadorEncerramento}
                      onChange={handleChange}
                      placeholder="Nome do aprovador"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataEncerramento">Data</Label>
                    <Input
                      id="dataEncerramento"
                      name="dataEncerramento"
                      type="date"
                      value={formData.dataEncerramento}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" onClick={gerarPDF} className="bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
