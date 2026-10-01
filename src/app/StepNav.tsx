import { motion } from 'motion/react'
import { STEPS } from '../domain/steps'

export function StepNav({ step, onSelect }: { step: number; onSelect: (step: number) => void }) {
  return (
    <nav className="mt-4 flex gap-1.5 rounded-full bg-surface p-1">
      {STEPS.map((label, i) => (
        <button
          key={label}
          onClick={() => onSelect(i)}
          aria-current={i === step ? 'step' : undefined}
          className="relative h-10 flex-1 rounded-full text-xs font-bold"
        >
          {i === step && (
            <motion.span
              layoutId="step-pill"
              className="absolute inset-0 rounded-full bg-ink"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span className={`relative transition-colors ${i === step ? 'text-bg' : i < step ? 'text-ink' : 'text-muted'}`}>
            {i < step ? '✓ ' : ''}
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
