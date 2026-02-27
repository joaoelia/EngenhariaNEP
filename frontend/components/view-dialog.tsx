"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface ViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: Record<string, any>
  fields: Array<{
    key: string
    label: string
    type?: "text" | "badge" | "date" | "number" | "files"
    render?: (value: any) => React.ReactNode
  }>
}

export function ViewDialog({ open, onOpenChange, title, data, fields }: ViewDialogProps) {
  const stripQuotes = (value: string) => value.replace(/^"+|"+$/g, "")

  const normalizeFiles = (value: any): string[] => {
    if (!value) return []

    if (Array.isArray(value)) {
      return value
        .map((item) => String(item).trim())
        .filter(Boolean)
        .map(stripQuotes)
    }

    if (typeof value === "string") {
      const trimmed = value.trim()
      if (!trimmed) return []

      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) {
            return parsed
              .map((item) => String(item).trim())
              .filter(Boolean)
              .map(stripQuotes)
          }
        } catch {
          // Fall back to treating it as a single filename.
        }
      }

      return [stripQuotes(trimmed)]
    }

    return []
  }

  const formatValue = (value: any, type?: string, render?: (value: any) => React.ReactNode) => {
    if (render) return render(value)
    
    if (value === null || value === undefined) return "-"
    
    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString("pt-BR")
      case "number":
        return typeof value === "number" ? value.toLocaleString("pt-BR") : value
      case "badge":
        return <Badge variant="secondary">{value}</Badge>
      case "files":
        const files = normalizeFiles(value)
        if (files.length === 0) return "-"

        return (
          <div className="flex flex-col gap-2">
            {files.map((file, index) => (
              <a
                key={`${file}-${index}`}
                href={`http://localhost:8080/api/files/download/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                {files.length > 1 ? `Baixar arquivo ${index + 1}` : "Baixar arquivo"}
              </a>
            ))}
          </div>
        )
      default:
        return value.toString()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Visualização detalhada do registro</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-3 gap-4 items-start">
              <div className="font-semibold text-sm text-slate-600">{field.label}:</div>
              <div className="col-span-2 text-sm text-slate-900">
                {formatValue(data[field.key], field.type, field.render)}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
