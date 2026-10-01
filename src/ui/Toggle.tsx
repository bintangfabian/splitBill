import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 py-1 text-left"
    >
      <span className="text-sm">{label}</span>
      <span className={`flex h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${checked ? 'justify-end bg-ink' : 'justify-start bg-line'}`}>
        <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 30 }} className={`size-5 rounded-full ${checked ? 'bg-lime' : 'bg-surface'}`} />
      </span>
    </button>
  )
}
