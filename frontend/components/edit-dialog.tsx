"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Função para ajustar data de timezone ao carregar
const adjustDateForDisplay = (dateString?: string) => {
  if (!dateString) return ""
  const dateParts = dateString.split("-")
  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
  // Subtrair 1 dia para mostrar a data original (compensando o +1 do submit)
  dateObj.setDate(dateObj.getDate() - 1)
  return dateObj.toISOString().split("T")[0]
}

// Função para ajustar data de timezone ao salvar
const adjustDateForSubmit = (dateString?: string) => {
  if (!dateString) return ""
  const dateParts = dateString.split("-")
  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
  dateObj.setDate(dateObj.getDate() + 1)
  return dateObj.toISOString().split("T")[0]
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: Record<string, any>
  fields: Array<{
    key: string
    label: string
    type?: "text" | "number" | "date" | "select" | "textarea"
    required?: boolean
    options?: Array<{ value: string; label: string }>
    disabled?: boolean
  }>
  onSave: (data: Record<string, any>) => Promise<void>
}

export function EditDialog({ open, onOpenChange, title, data, fields, onSave }: EditDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(data)

  useEffect(() => {
    // Processar datas ao abrir o diálogo
    const processedData = { ...data }
    fields.forEach((field) => {
      if (field.type === "date" && data[field.key]) {
        processedData[field.key] = adjustDateForDisplay(data[field.key])
      }
    })
    setFormData(processedData)
  }, [data, open, fields])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Ajustar datas antes de enviar
      const submitData = { ...formData }
      fields.forEach((field) => {
        if (field.type === "date" && formData[field.key]) {
          submitData[field.key] = adjustDateForSubmit(formData[field.key])
        }
      })
      await onSave(submitData)
      onOpenChange(false)
    } catch (error) {
      // Error handling silently
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Edite os dados do registro</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === "select" && field.options ? (
                <Select
                  value={formData[field.key]?.toString()}
                  onValueChange={(value) => handleChange(field.key, value)}
                  disabled={field.disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  disabled={field.disabled}
                  rows={3}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type || "text"}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  disabled={field.disabled}
                  step={field.type === "number" ? "0.01" : undefined}
                />
              )}
            </div>
          ))}
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1" disabled={isLoading}>
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
