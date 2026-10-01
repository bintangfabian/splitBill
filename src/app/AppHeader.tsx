import { RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { SplitMark } from '../ui'

export function AppHeader({
  title,
  onTitleChange,
  onReset,
  canReset,
  children,
}: {
  title: string
  onTitleChange: (title: string) => void
  onReset: () => void
  /** Tombol reset nonaktif kalau tagihan masih kosong. */
  canReset: boolean
  children: ReactNode
}) {
  return (
    <header className="sticky top-0 z-20 bg-bg px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <div className="flex items-center gap-3">
        <SplitMark className="size-8 shrink-0 text-ink" />
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Nama tagihan"
          className="h-11 min-w-0 flex-1 bg-transparent text-[17px] font-bold outline-none placeholder:font-semibold placeholder:text-muted"
          aria-label="Nama tagihan"
        />
        <button
          onClick={onReset}
          disabled={!canReset}
          className="grid size-11 place-items-center rounded-full text-muted transition-colors active:bg-surface-2 disabled:opacity-40"
          aria-label="Kosongkan tagihan"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      {children}
    </header>
  )
}
