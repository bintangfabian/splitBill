import type { ReactNode } from 'react'

export function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">{eyebrow}</p>
      <h2 className="mt-1 text-[2rem] leading-[1.05] font-extrabold tracking-tight">{title}</h2>
      {children && <p className="mt-2 text-sm text-muted">{children}</p>}
    </div>
  )
}
