import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  id: string
}) {
  return (
    <div className="flex rounded-2xl bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className="relative flex-1 rounded-xl px-3 py-2 text-sm font-semibold"
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${id}`}
              className="absolute inset-0 rounded-xl bg-surface shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className={`relative ${value === o.value ? 'text-ink' : 'text-muted'}`}>{o.label}</span>
        </button>
      ))}
    </div>
  )
}
