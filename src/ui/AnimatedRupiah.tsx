import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { rupiah } from '../lib/format'
import { duration, ease } from './motion'

/** Angka rupiah yang “berlari” ke nilai barunya. */
export function AnimatedRupiah({ value, className = '' }: { value: number; className?: string }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => rupiah(v))
  useEffect(() => {
    const c = animate(mv, value, { duration: duration.number, ease: ease.out })
    return c.stop
  }, [mv, value])
  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>
}
