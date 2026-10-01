import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { spring } from './motion'

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 w-full items-center justify-between gap-4 text-left"
    >
      <span className="text-[15px]">{label}</span>
      <span className={`flex h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${checked ? 'justify-end bg-ink' : 'justify-start bg-line'}`}>
        <motion.span layout transition={spring.snappy} className="size-5 rounded-full bg-surface shadow-[0_1px_2px_rgba(0,0,0,.25)]" />
      </span>
    </button>
  )
}
