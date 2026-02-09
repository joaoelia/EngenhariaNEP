"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: Record<string, any>
  fields: Array<{
    key: string
    label: string
    type?: "text" | "badge" | "date" | "number"
    render?: (value: any) => React.ReactNode
  }>
}

export function ViewDialog({ open, onOpenChange, title, data, fields }: ViewDialogProps) {
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
