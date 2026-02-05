import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  )
}
