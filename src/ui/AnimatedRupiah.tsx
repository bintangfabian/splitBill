import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { rupiah } from '../lib/format'

/** Angka rupiah yang “berlari” ke nilai barunya. */
export function AnimatedRupiah({ value, className = '' }: { value: number; className?: string }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => rupiah(v))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return c.stop
  }, [mv, value])
  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>
}
