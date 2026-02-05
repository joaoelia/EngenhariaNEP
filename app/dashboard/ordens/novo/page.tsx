import { OrdemForm } from "@/components/ordem-form"

export default function NovaOrdemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Ordem</h1>
        <p className="text-muted-foreground">Crie uma nova ordem de fabricação, produção ou projeto</p>
      </div>
      <OrdemForm />
    </div>
  )
}
