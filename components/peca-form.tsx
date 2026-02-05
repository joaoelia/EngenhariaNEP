"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

export function PecaForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [relatorioInspecao, setRelatorioInspecao] = useState<File | null>(null)
  const [fotos, setFotos] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    router.push("/dashboard/pecas")
  }

  const handleRelatorioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRelatorioInspecao(e.target.files[0])
    }
  }

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos([...fotos, ...Array.from(e.target.files)])
    }
  }

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Peça Fabricada</CardTitle>
        <CardDescription>Campos marcados com * são obrigatórios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partnumber">Part Number *</Label>
              <Input id="partnumber" name="partnumber" required placeholder="Ex: PN-12345" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_serie">Número de Série *</Label>
              <Input id="numero_serie" name="numero_serie" required placeholder="Ex: SN-001" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                name="descricao"
                required
                placeholder="Descrição detalhada da peça fabricada"
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="aeronave_instalada">Aeronave Instalada (Opcional)</Label>
              <Input id="aeronave_instalada" name="aeronave_instalada" placeholder="Ex: Boeing 737-800" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Relatório de Inspeção *</h3>
            <div className="space-y-2">
              <Label htmlFor="relatorio_inspecao" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Clique para selecionar o relatório de inspeção</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX</p>
                  </div>
                </div>
              </Label>
              <Input
                id="relatorio_inspecao"
                name="relatorio_inspecao"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleRelatorioChange}
                className="hidden"
                required
              />
              {relatorioInspecao && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm truncate">{relatorioInspecao.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRelatorioInspecao(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fotos da Peça</h3>
            <div className="space-y-2">
              <Label htmlFor="fotos" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Clique para adicionar fotos</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, JPEG - Múltiplas fotos permitidas</p>
                  </div>
                </div>
              </Label>
              <Input
                id="fotos"
                name="fotos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFotosChange}
                className="hidden"
              />
              {fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {fotos.map((foto, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg border-2 border-muted overflow-hidden">
                        <img
                          src={URL.createObjectURL(foto) || "/placeholder.svg"}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFoto(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{foto.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Peça"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
