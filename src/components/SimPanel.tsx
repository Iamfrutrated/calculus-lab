import type { ReactNode } from 'react'

export function SimPanel({ children }: { children: ReactNode }) {
  return (
    <section className="sim-panel">
      <div className="sim-panel-head">Interactive lab</div>
      {children}
    </section>
  )
}
