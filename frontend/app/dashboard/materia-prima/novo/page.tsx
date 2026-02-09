import { MateriaPrimaForm } from "@/components/materia-prima-form"

export default function NovaMateriaPrimaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Matéria-Prima</h1>
        <p className="text-muted-foreground">Adicione uma nova matéria-prima ao estoque</p>
      </div>
      <MateriaPrimaForm />
    </div>
  )
}
