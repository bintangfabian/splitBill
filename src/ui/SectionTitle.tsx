import type { ReactNode } from 'react'

/** Judul langkah. Tanpa label kecil di atasnya; navigasi langkah sudah menunjukkan posisi. */
export function SectionTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-[26px] leading-tight font-bold tracking-[-0.02em]">{title}</h2>
      {children && <p className="mt-1.5 text-[15px] leading-snug text-muted">{children}</p>}
    </div>
  )
}
