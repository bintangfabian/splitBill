import type { ReactNode } from 'react'

export function SectionTitle({ eyebrow, title, art, children }: { eyebrow: string; title: ReactNode; art?: ReactNode; children?: ReactNode }) {
  const heading = (
    <>
      <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">{eyebrow}</p>
      <h2 className="mt-1 text-[2rem] leading-[1.05] font-extrabold tracking-tight">{title}</h2>
    </>
  )
  return (
    <div className="mb-5">
      {/* Ilustrasi opsional di kiri judul, sama seperti header langkah Hasil. */}
      {art ? (
        <div className="flex items-center gap-3">
          {art}
          <div>{heading}</div>
        </div>
      ) : (
        heading
      )}
      {children && <p className="mt-2 text-sm text-muted">{children}</p>}
    </div>
  )
}
