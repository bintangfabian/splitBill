import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { spring } from './motion'

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
    <div className="flex rounded-control bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className="relative h-10 flex-1 rounded-[9px] px-3 text-sm font-semibold"
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${id}`}
              className="absolute inset-0 rounded-[9px] bg-surface shadow-[0_1px_2px_rgba(0,0,0,.12)]"
              transition={spring.snappy}
            />
          )}
          <span className={`relative ${value === o.value ? 'text-ink' : 'text-muted'}`}>{o.label}</span>
        </button>
      ))}
    </div>
  )
}
