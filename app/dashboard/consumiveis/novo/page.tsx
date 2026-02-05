import { ConsumivelForm } from "@/components/consumivel-form"

export default function NovoConsumivelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Consumível</h1>
        <p className="text-muted-foreground">Adicione um novo consumível ao estoque</p>
      </div>
      <ConsumivelForm />
    </div>
  )
}
