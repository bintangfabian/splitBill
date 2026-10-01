import { motion } from 'motion/react'
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
    <header className="sticky top-0 z-20 bg-bg/80 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <SplitMark className="size-10 shrink-0" />
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Makan di mana nih?"
          className="min-w-0 flex-1 bg-transparent text-lg font-bold tracking-tight outline-none placeholder:text-muted"
          aria-label="Nama tagihan"
        />
        <motion.button
          whileTap={{ rotate: -180, scale: 0.9 }}
          onClick={onReset}
          disabled={!canReset}
          className="grid size-10 place-items-center rounded-full bg-surface text-muted transition-opacity disabled:opacity-40"
          aria-label="Kosongkan tagihan"
        >
          <RotateCcw size={17} />
        </motion.button>
      </div>
      {children}
    </header>
  )
}
