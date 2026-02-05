import { PecaForm } from "@/components/peca-form"

export default function NovaPecaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Peça Fabricada</h1>
        <p className="text-muted-foreground">Registre uma nova peça fabricada</p>
      </div>
      <PecaForm />
    </div>
  )
}
