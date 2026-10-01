import { motion } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { SplitMark } from '../ui'

export function AppHeader({
  title,
  onTitleChange,
  onReset,
  children,
}: {
  title: string
  onTitleChange: (title: string) => void
  onReset: () => void
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
          className="min-w-0 flex-1 bg-transparent text-lg font-bold tracking-tight outline-none placeholder:text-muted/70"
          aria-label="Nama tagihan"
        />
        <motion.button
          whileTap={{ rotate: -180, scale: 0.9 }}
          onClick={onReset}
          className="grid size-10 place-items-center rounded-full bg-surface text-muted"
          aria-label="Tagihan baru"
        >
          <RotateCcw size={17} />
        </motion.button>
      </div>
      {children}
    </header>
  )
}
