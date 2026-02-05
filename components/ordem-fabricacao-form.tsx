"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import jsPDF from "jspdf"

interface OrdemFabricacaoData {
  projeto: string
  partNumber: string
  numeroSerie: string
  nomePeca: string
  requerente: string
  fornecedor: string
  material: string
  formaMateriaPrima: string
  numeroLote: string
  processoFabricacao: string
  dataInicio: string
  dataEntrega: string
  desenho3D: string
  desenho2D: string
  aprovadorNome: string
  aprovadorData: string
}

export function OrdemFabricacaoForm() {
  const [formData, setFormData] = useState<OrdemFabricacaoData>({
    projeto: "",
    partNumber: "",
    numeroSerie: "",
    nomePeca: "",
    requerente: "",
    fornecedor: "",
    material: "",
    formaMateriaPrima: "",
    numeroLote: "",
    processoFabricacao: "",
    dataInicio: "",
    dataEntrega: "",
    desenho3D: "",
    desenho2D: "",
    aprovadorNome: "",
    aprovadorData: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const gerarPDF = () => {
    const doc = new jsPDF()
    const hoje = new Date().toLocaleDateString("pt-BR")

    // Cabeçalho
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("ORDEM DE FABRICAÇÃO", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`OF-XXX-YY ${hoje}`, 105, 28, { align: "center" })
    doc.text("COP XXXX/XX", 105, 34, { align: "center" })

    // Linha divisória
    doc.line(10, 40, 200, 40)

    // Seção 1: IDENTIFICAÇÃO GERAL
    let yPos = 50
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("1. IDENTIFICAÇÃO GERAL", 10, yPos)

    yPos += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Projeto: ${formData.projeto}`, 10, yPos)

    yPos += 6
    doc.text(`Part Number: ${formData.partNumber}`, 10, yPos)
    doc.text(`N° de Série: ${formData.numeroSerie}`, 120, yPos)

    yPos += 6
    doc.text(`Nome da Peça: ${formData.nomePeca}`, 10, yPos)

    yPos += 6
    doc.text(`Requerente: ${formData.requerente}`, 10, yPos)

    yPos += 6
    doc.text(`Fornecedor: ${formData.fornecedor}`, 10, yPos)

    // Seção 2: DADOS TÉCNICOS DA PEÇA
    yPos += 12
    doc.setFont("helvetica", "bold")
    doc.text("2. DADOS TÉCNICOS DA PEÇA", 10, yPos)

    yPos += 8
    doc.setFont("helvetica", "normal")
    doc.text(`Material: ${formData.material}`, 10, yPos)

    yPos += 6
    doc.text(`Forma da Matéria Prima: ${formData.formaMateriaPrima}`, 10, yPos)

    yPos += 6
    doc.text(`N° do Lote da Matéria Prima: ${formData.numeroLote}`, 10, yPos)

    yPos += 6
    doc.text(`Processo de Fabricação: ${formData.processoFabricacao}`, 10, yPos)

    yPos += 6
    doc.text(`Data de Início: ${formData.dataInicio}`, 10, yPos)

    yPos += 6
    doc.text(`Data de Entrega: ${formData.dataEntrega}`, 10, yPos)

    // Seção 3: DOCUMENTOS ANEXOS
    yPos += 12
    doc.setFont("helvetica", "bold")
    doc.text("3. DOCUMENTOS ANEXOS", 10, yPos)

    yPos += 8
    doc.setFont("helvetica", "normal")
    doc.text("Descrição", 10, yPos)
    doc.text("Código / Nome do Arquivo", 100, yPos)

    yPos += 6
    doc.text("Desenho 3D", 10, yPos)
    doc.text(formData.desenho3D || "-", 100, yPos)

    yPos += 6
    doc.text("Desenho 2D", 10, yPos)
    doc.text(formData.desenho2D || "-", 100, yPos)

    // Seção 4: APROVAÇÕES
    yPos += 12
    doc.setFont("helvetica", "bold")
    doc.text("4. APROVAÇÕES", 10, yPos)

    yPos += 8
    doc.setFont("helvetica", "normal")
    doc.text("NOME", 10, yPos)
    doc.text("DATA", 100, yPos)
    doc.text("ASSINATURA", 150, yPos)

    yPos += 6
    doc.text(formData.aprovadorNome || "_________________", 10, yPos)
    doc.text(formData.aprovadorData || "__/__/____", 100, yPos)
    doc.text("_________________", 150, yPos)

    // Rodapé
    doc.setFontSize(8)
    doc.text("Nep Aviation Com. Imp. Exp. Ltda – Documento externo de controle de produção", 10, 285)

    // Salvar PDF
    doc.save(`Ordem-Fabricacao-${formData.partNumber || "documento"}.pdf`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Ordem de Fabricação (OF)
        </CardTitle>
        <CardDescription>Preencha os dados para gerar a ordem de fabricação</CardDescription>
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
                <Label htmlFor="numeroSerie">N° de Série *</Label>
                <Input
                  id="numeroSerie"
                  name="numeroSerie"
                  value={formData.numeroSerie}
                  onChange={handleChange}
                  placeholder="SN-XXXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomePeca">Nome da Peça *</Label>
                <Input
                  id="nomePeca"
                  name="nomePeca"
                  value={formData.nomePeca}
                  onChange={handleChange}
                  placeholder="Nome completo da peça"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requerente">Requerente *</Label>
                <Input
                  id="requerente"
                  name="requerente"
                  value={formData.requerente}
                  onChange={handleChange}
                  placeholder="Nome do requerente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor *</Label>
                <Input
                  id="fornecedor"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleChange}
                  placeholder="Nome do fornecedor"
                  required
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Dados Técnicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">2. Dados Técnicos da Peça</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="material">Material *</Label>
                <Input
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Ex: Alumínio 7075-T6"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formaMateriaPrima">Forma da Matéria Prima *</Label>
                <Input
                  id="formaMateriaPrima"
                  name="formaMateriaPrima"
                  value={formData.formaMateriaPrima}
                  onChange={handleChange}
                  placeholder="Ex: Chapa, Barra, Tubo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroLote">N° do Lote da Matéria Prima *</Label>
                <Input
                  id="numeroLote"
                  name="numeroLote"
                  value={formData.numeroLote}
                  onChange={handleChange}
                  placeholder="Número do lote"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processoFabricacao">Processo de Fabricação *</Label>
                <Input
                  id="processoFabricacao"
                  name="processoFabricacao"
                  value={formData.processoFabricacao}
                  onChange={handleChange}
                  placeholder="Ex: Usinagem CNC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <Input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataEntrega">Data de Entrega *</Label>
                <Input
                  id="dataEntrega"
                  name="dataEntrega"
                  type="date"
                  value={formData.dataEntrega}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Documentos Anexos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">3. Documentos Anexos</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="desenho3D">Desenho 3D (Nome/Código)</Label>
                <Input
                  id="desenho3D"
                  name="desenho3D"
                  value={formData.desenho3D}
                  onChange={handleChange}
                  placeholder="Ex: DES-3D-001.stp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desenho2D">Desenho 2D (Nome/Código)</Label>
                <Input
                  id="desenho2D"
                  name="desenho2D"
                  value={formData.desenho2D}
                  onChange={handleChange}
                  placeholder="Ex: DES-2D-001.pdf"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Aprovações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">4. Aprovações</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aprovadorNome">Nome do Aprovador</Label>
                <Input
                  id="aprovadorNome"
                  name="aprovadorNome"
                  value={formData.aprovadorNome}
                  onChange={handleChange}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aprovadorData">Data da Aprovação</Label>
                <Input
                  id="aprovadorData"
                  name="aprovadorData"
                  type="date"
                  value={formData.aprovadorData}
                  onChange={handleChange}
                />
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
