'use client'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  // Override console.error immediately
  if (typeof window !== 'undefined') {
    const originalError = window.console.error
    window.console.error = function(...args: unknown[]) {
      const message = String(args[0] || '')
      if (message.includes('Blocked aria-hidden on an element')) {
        return
      }
      originalError.apply(console, args as any)
    }
  }

  return <>{children}</>
}
