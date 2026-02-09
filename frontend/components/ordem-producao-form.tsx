"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import jsPDF from "jspdf"

interface ComponenteItem {
  item: number
  partNumber: string
  numeroSerie: string
  nomePeca: string
  numeroOF: string
}

interface QualidadeItem {
  item: number
  partNumber: string
  numeroSerie: string
  relatorioInspecao: string
  aprovado: string
  responsavel: string
}

interface OrdemProducaoData {
  projeto: string
  partNumber: string
  nomeConjunto: string
  relatorioInspecaoMontagem: string
  modeloAeronave: string
  matriculaAeronave: string
  clienteProprietario: string
  executante: string
  responsavelEmissao: string
  componentes: ComponenteItem[]
  qualidade: QualidadeItem[]
  aprovadorProjeto: string
  dataProjeto: string
  aprovadorProducao: string
  dataProducao: string
  aprovadorQualidade: string
  dataQualidade: string
}

export function OrdemProducaoForm() {
  const [formData, setFormData] = useState<OrdemProducaoData>({
    projeto: "",
    partNumber: "",
    nomeConjunto: "",
    relatorioInspecaoMontagem: "",
    modeloAeronave: "",
    matriculaAeronave: "",
    clienteProprietario: "",
    executante: "",
    responsavelEmissao: "",
    componentes: [{ item: 1, partNumber: "", numeroSerie: "", nomePeca: "", numeroOF: "" }],
    qualidade: [{ item: 1, partNumber: "", numeroSerie: "", relatorioInspecao: "", aprovado: "", responsavel: "" }],
    aprovadorProjeto: "",
    dataProjeto: "",
    aprovadorProducao: "",
    dataProducao: "",
    aprovadorQualidade: "",
    dataQualidade: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const addComponente = () => {
    setFormData({
      ...formData,
      componentes: [
        ...formData.componentes,
        { item: formData.componentes.length + 1, partNumber: "", numeroSerie: "", nomePeca: "", numeroOF: "" },
      ],
    })
  }

  const removeComponente = (index: number) => {
    const newComponentes = formData.componentes.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      componentes: newComponentes.map((comp, i) => ({ ...comp, item: i + 1 })),
    })
  }

  const updateComponente = (index: number, field: string, value: string) => {
    const newComponentes = [...formData.componentes]
    newComponentes[index] = { ...newComponentes[index], [field]: value }
    setFormData({ ...formData, componentes: newComponentes })
  }

  const addQualidade = () => {
    setFormData({
      ...formData,
      qualidade: [
        ...formData.qualidade,
        {
          item: formData.qualidade.length + 1,
          partNumber: "",
          numeroSerie: "",
          relatorioInspecao: "",
          aprovado: "",
          responsavel: "",
        },
      ],
    })
  }

  const removeQualidade = (index: number) => {
    const newQualidade = formData.qualidade.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      qualidade: newQualidade.map((qual, i) => ({ ...qual, item: i + 1 })),
    })
  }

  const updateQualidade = (index: number, field: string, value: string) => {
    const newQualidade = [...formData.qualidade]
    newQualidade[index] = { ...newQualidade[index], [field]: value }
    setFormData({ ...formData, qualidade: newQualidade })
  }

  const gerarPDF = () => {
    const doc = new jsPDF()
    const hoje = new Date().toLocaleDateString("pt-BR")

    // Cabeçalho
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("ORDEM DE PRODUÇÃO", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`OP-XXX-YY ${hoje}`, 105, 28, { align: "center" })
    doc.text("COP XXXX/XX", 105, 34, { align: "center" })

    doc.line(10, 40, 200, 40)

    // Seção 1: IDENTIFICAÇÃO GERAL
    let yPos = 50
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
    doc.text(`Nome do Conjunto: ${formData.nomeConjunto}`, 10, yPos)

    yPos += 5
    doc.text(`Relatório de Inspeção de Montagem: ${formData.relatorioInspecaoMontagem}`, 10, yPos)

    yPos += 5
    doc.text(`Modelo da Aeronave: ${formData.modeloAeronave}`, 10, yPos)

    yPos += 5
    doc.text(`Matrícula da Aeronave: ${formData.matriculaAeronave}`, 10, yPos)

    yPos += 5
    doc.text(`Cliente/Proprietário: ${formData.clienteProprietario}`, 10, yPos)

    yPos += 5
    doc.text(`Executante: ${formData.executante}`, 10, yPos)

    yPos += 5
    doc.text(`Responsável pela Emissão: ${formData.responsavelEmissao}`, 10, yPos)

    // Seção 2: LISTA DE COMPONENTES
    yPos += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("2. LISTA DE COMPONENTES DO CONJUNTO", 10, yPos)

    yPos += 8
    doc.setFontSize(8)
    doc.text("ITEM", 10, yPos)
    doc.text("PART NUMBER", 30, yPos)
    doc.text("N° SÉRIE", 70, yPos)
    doc.text("NOME DA PEÇA", 100, yPos)
    doc.text("N° DA OF", 160, yPos)

    formData.componentes.forEach((comp) => {
      yPos += 5
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.setFont("helvetica", "normal")
      doc.text(comp.item.toString(), 10, yPos)
      doc.text(comp.partNumber || "-", 30, yPos)
      doc.text(comp.numeroSerie || "-", 70, yPos)
      doc.text(comp.nomePeca || "-", 100, yPos)
      doc.text(comp.numeroOF || "-", 160, yPos)
    })

    // Seção 3: CONTROLE DE QUALIDADE
    yPos += 10
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("3. CONTROLE DE QUALIDADE", 10, yPos)

    yPos += 8
    doc.setFontSize(8)
    doc.text("ITEM", 10, yPos)
    doc.text("PN", 25, yPos)
    doc.text("N° SÉRIE", 50, yPos)
    doc.text("RELATÓRIO", 75, yPos)
    doc.text("APROVADO", 120, yPos)
    doc.text("RESPONSÁVEL", 150, yPos)

    formData.qualidade.forEach((qual) => {
      yPos += 5
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.setFont("helvetica", "normal")
      doc.text(qual.item.toString(), 10, yPos)
      doc.text(qual.partNumber || "-", 25, yPos)
      doc.text(qual.numeroSerie || "-", 50, yPos)
      doc.text(qual.relatorioInspecao || "-", 75, yPos)
      doc.text(qual.aprovado || "-", 120, yPos)
      doc.text(qual.responsavel || "-", 150, yPos)
    })

    // Seção 4: APROVAÇÕES
    yPos += 12
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("4. APROVAÇÕES", 10, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("SETOR", 10, yPos)
    doc.text("NOME", 50, yPos)
    doc.text("DATA", 110, yPos)
    doc.text("ASSINATURA", 150, yPos)

    yPos += 6
    doc.text("Projeto", 10, yPos)
    doc.text(formData.aprovadorProjeto || "_____________", 50, yPos)
    doc.text(formData.dataProjeto || "__/__/____", 110, yPos)
    doc.text("_____________", 150, yPos)

    yPos += 6
    doc.text("Produção", 10, yPos)
    doc.text(formData.aprovadorProducao || "_____________", 50, yPos)
    doc.text(formData.dataProducao || "__/__/____", 110, yPos)
    doc.text("_____________", 150, yPos)

    yPos += 6
    doc.text("Qualidade", 10, yPos)
    doc.text(formData.aprovadorQualidade || "_____________", 50, yPos)
    doc.text(formData.dataQualidade || "__/__/____", 110, yPos)
    doc.text("_____________", 150, yPos)

    doc.setFontSize(8)
    doc.text("Nep Aviation Com. Imp. Exp. Ltda – Documento interno de controle de produção", 10, 285)

    doc.save(`Ordem-Producao-${formData.partNumber || "documento"}.pdf`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Ordem de Produção (OP)
        </CardTitle>
        <CardDescription>Preencha os dados para gerar a ordem de produção</CardDescription>
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
                <Label htmlFor="nomeConjunto">Nome do Conjunto *</Label>
                <Input
                  id="nomeConjunto"
                  name="nomeConjunto"
                  value={formData.nomeConjunto}
                  onChange={handleChange}
                  placeholder="Nome completo do conjunto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatorioInspecaoMontagem">Relatório de Inspeção de Montagem</Label>
                <Input
                  id="relatorioInspecaoMontagem"
                  name="relatorioInspecaoMontagem"
                  value={formData.relatorioInspecaoMontagem}
                  onChange={handleChange}
                  placeholder="Código do relatório"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modeloAeronave">Modelo da Aeronave</Label>
                <Input
                  id="modeloAeronave"
                  name="modeloAeronave"
                  value={formData.modeloAeronave}
                  onChange={handleChange}
                  placeholder="Ex: EMB-145"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matriculaAeronave">Matrícula da Aeronave</Label>
                <Input
                  id="matriculaAeronave"
                  name="matriculaAeronave"
                  value={formData.matriculaAeronave}
                  onChange={handleChange}
                  placeholder="Ex: PR-XXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clienteProprietario">Cliente/Proprietário</Label>
                <Input
                  id="clienteProprietario"
                  name="clienteProprietario"
                  value={formData.clienteProprietario}
                  onChange={handleChange}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="executante">Executante *</Label>
                <Input
                  id="executante"
                  name="executante"
                  value={formData.executante}
                  onChange={handleChange}
                  placeholder="Nome do executante"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavelEmissao">Responsável pela Emissão *</Label>
                <Input
                  id="responsavelEmissao"
                  name="responsavelEmissao"
                  value={formData.responsavelEmissao}
                  onChange={handleChange}
                  placeholder="Nome do responsável"
                  required
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Lista de Componentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
                2. Lista de Componentes do Conjunto
              </h3>
              <Button type="button" onClick={addComponente} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {formData.componentes.map((comp, index) => (
              <Card key={index} className="bg-slate-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Item</Label>
                        <Input value={comp.item} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Part Number</Label>
                        <Input
                          value={comp.partNumber}
                          onChange={(e) => updateComponente(index, "partNumber", e.target.value)}
                          placeholder="PN-XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Número de Série</Label>
                        <Input
                          value={comp.numeroSerie}
                          onChange={(e) => updateComponente(index, "numeroSerie", e.target.value)}
                          placeholder="SN-XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nome da Peça</Label>
                        <Input
                          value={comp.nomePeca}
                          onChange={(e) => updateComponente(index, "nomePeca", e.target.value)}
                          placeholder="Nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>N° da OF</Label>
                        <Input
                          value={comp.numeroOF}
                          onChange={(e) => updateComponente(index, "numeroOF", e.target.value)}
                          placeholder="OF-XXX"
                        />
                      </div>
                    </div>
                    {formData.componentes.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeComponente(index)}
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

          {/* Seção 3: Controle de Qualidade */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">3. Controle de Qualidade</h3>
              <Button type="button" onClick={addQualidade} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {formData.qualidade.map((qual, index) => (
              <Card key={index} className="bg-slate-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid gap-4 md:grid-cols-5">
                      <div className="space-y-2">
                        <Label>Item</Label>
                        <Input value={qual.item} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Part Number</Label>
                        <Input
                          value={qual.partNumber}
                          onChange={(e) => updateQualidade(index, "partNumber", e.target.value)}
                          placeholder="PN-XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>N° de Série</Label>
                        <Input
                          value={qual.numeroSerie}
                          onChange={(e) => updateQualidade(index, "numeroSerie", e.target.value)}
                          placeholder="SN-XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relatório de Inspeção</Label>
                        <Input
                          value={qual.relatorioInspecao}
                          onChange={(e) => updateQualidade(index, "relatorioInspecao", e.target.value)}
                          placeholder="REL-XXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Aprovado</Label>
                        <Select
                          value={qual.aprovado}
                          onValueChange={(value) => updateQualidade(index, "aprovado", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SIM">SIM</SelectItem>
                            <SelectItem value="NÃO">NÃO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Responsável</Label>
                        <Input
                          value={qual.responsavel}
                          onChange={(e) => updateQualidade(index, "responsavel", e.target.value)}
                          placeholder="Nome"
                        />
                      </div>
                    </div>
                    {formData.qualidade.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeQualidade(index)}
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

          {/* Seção 4: Aprovações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">4. Aprovações</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Input value="Projeto" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aprovadorProjeto">Nome</Label>
                  <Input
                    id="aprovadorProjeto"
                    name="aprovadorProjeto"
                    value={formData.aprovadorProjeto}
                    onChange={handleChange}
                    placeholder="Nome do aprovador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataProjeto">Data</Label>
                  <Input
                    id="dataProjeto"
                    name="dataProjeto"
                    type="date"
                    value={formData.dataProjeto}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Input value="Produção" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aprovadorProducao">Nome</Label>
                  <Input
                    id="aprovadorProducao"
                    name="aprovadorProducao"
                    value={formData.aprovadorProducao}
                    onChange={handleChange}
                    placeholder="Nome do aprovador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataProducao">Data</Label>
                  <Input
                    id="dataProducao"
                    name="dataProducao"
                    type="date"
                    value={formData.dataProducao}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Input value="Qualidade" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aprovadorQualidade">Nome</Label>
                  <Input
                    id="aprovadorQualidade"
                    name="aprovadorQualidade"
                    value={formData.aprovadorQualidade}
                    onChange={handleChange}
                    placeholder="Nome do aprovador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataQualidade">Data</Label>
                  <Input
                    id="dataQualidade"
                    name="dataQualidade"
                    type="date"
                    value={formData.dataQualidade}
                    onChange={handleChange}
                  />
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
