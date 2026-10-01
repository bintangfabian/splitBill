import { motion, type HTMLMotionProps } from 'motion/react'

type ButtonProps = HTMLMotionProps<'button'> & { variant?: 'primary' | 'lime' | 'ghost' | 'soft' }

const variants = {
  primary: 'bg-ink text-bg',
  lime: 'bg-lime text-[#141414]',
  ghost: 'bg-transparent text-ink',
  soft: 'bg-surface-2 text-ink',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
