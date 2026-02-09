import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Package, Box, Wrench, ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-slate-900 text-balance">
            Sistema de Gerenciamento Industrial
          </h1>
          <p className="text-xl text-slate-600 text-pretty max-w-2xl mx-auto">
            Controle completo de consumíveis, matéria-prima, peças fabricadas e
            ordens de produção
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Acessar Sistema
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mt-16">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <Package className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Consumíveis</h3>
            <p className="text-sm text-slate-600">
              Controle de estoque de materiais consumíveis
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <Box className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Matéria-Prima</h3>
            <p className="text-sm text-slate-600">
              Gestão de materiais e insumos de produção
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <Wrench className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">
              Peças Fabricadas
            </h3>
            <p className="text-sm text-slate-600">
              Registro de peças produzidas e controle de qualidade
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <ClipboardList className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Ordens</h3>
            <p className="text-sm text-slate-600">
              Gerenciamento de ordens de produção e projetos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
