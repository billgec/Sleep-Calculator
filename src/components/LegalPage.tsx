import type { ReactNode } from 'react'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <main className="legal">
      <a className="back-link" href="#/">
        ← Back to the calculator
      </a>
      <h1>{title}</h1>
      {children}
    </main>
  )
}
