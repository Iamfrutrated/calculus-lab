import type { ReactNode } from 'react'

export function SimPanel({
  children,
  label = 'Interactive lab',
}: {
  children: ReactNode
  label?: string
}) {
  return (
    <section className="sim-panel">
      <div className="sim-panel-head">{label}</div>
      {children}
    </section>
  )
}
