import { motion, type HTMLMotionProps } from 'motion/react'
import { duration, press } from './motion'

type ButtonProps = HTMLMotionProps<'button'> & { variant?: 'primary' | 'soft' | 'ghost' }

const variants = {
  primary: 'bg-ink text-bg',
  soft: 'bg-surface-2 text-ink',
  ghost: 'bg-transparent text-ink',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={press}
      transition={{ duration: duration.fast }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 font-semibold disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
