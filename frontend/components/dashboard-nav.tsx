"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Box, Wrench, ClipboardList, Home } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/consumiveis", icon: Package, label: "Consumíveis" },
    { href: "/dashboard/materia-prima", icon: Box, label: "Matéria-Prima" },
    { href: "/dashboard/pecas", icon: Wrench, label: "Peças Fabricadas" },
    { href: "/dashboard/ordens", icon: ClipboardList, label: "Ordens" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-balance">Aviation Parts</h1>
        <p className="text-xs text-slate-400 mt-1">Gerenciamento de Produção</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
