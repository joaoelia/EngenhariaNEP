"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { OrdemFabricacaoForm } from "./ordem-fabricacao-form"
import { OrdemProducaoForm } from "./ordem-producao-form"
import { OrdemProjetoForm } from "./ordem-projeto-form"

export function OrdemForm() {
  const [tipoOrdem, setTipoOrdem] = useState<string>("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Selecione o Tipo de Ordem
          </CardTitle>
          <CardDescription>Escolha o tipo de ordem que deseja criar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Ordem *</Label>
            <Select value={tipoOrdem} onValueChange={setTipoOrdem}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo de ordem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fabricacao">Ordem de Fabricação (OF)</SelectItem>
                <SelectItem value="producao">Ordem de Produção (OP)</SelectItem>
                <SelectItem value="projeto">Ordem de Projeto (OPJ)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {tipoOrdem === "fabricacao" && <OrdemFabricacaoForm />}
      {tipoOrdem === "producao" && <OrdemProducaoForm />}
      {tipoOrdem === "projeto" && <OrdemProjetoForm />}
    </div>
  )
}
