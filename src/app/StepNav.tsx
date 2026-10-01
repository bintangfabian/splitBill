import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { STEPS } from '../domain/steps'
import { spring } from '../ui/motion'

export function StepNav({ step, onSelect }: { step: number; onSelect: (step: number) => void }) {
  return (
    <nav className="mt-2 flex gap-1 rounded-card bg-surface p-1">
      {STEPS.map((label, i) => (
        <button
          key={label}
          onClick={() => onSelect(i)}
          aria-current={i === step ? 'step' : undefined}
          className="relative h-10 flex-1 rounded-control text-[13px] font-semibold"
        >
          {i === step && <motion.span layoutId="step-pill" className="absolute inset-0 rounded-control bg-ink" transition={spring.snappy} />}
          <span
            className={`relative inline-flex items-center justify-center gap-1 transition-colors ${i === step ? 'text-bg' : i < step ? 'text-ink' : 'text-muted'}`}
          >
            {i < step && <Check size={13} strokeWidth={2.75} aria-hidden />}
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
