import { motion } from 'motion/react'

/**
 * Bentuk logo Tookthel di kotak 512 × 512, sama dengan `public/logo.svg` (sumber favicon dan ikon PWA).
 * Dipakai komponen `Logo` dan kepala struk yang digambar di kanvas, jadi bentuknya cukup diubah di sini.
 */
export const LOGO = {
  tile: 'M120 0h272a120 120 0 0 1 120 120v272a120 120 0 0 1-120 120H120A120 120 0 0 1 0 392V120A120 120 0 0 1 120 0z',
  receipt: 'M156 128h200a20 20 0 0 1 20 20v236l-30-20-30 20-30-20-30 20-30-20-30 20-30-20-30 20V148a20 20 0 0 1 20-20z',
  eyes: [
    [214, 222],
    [298, 222],
  ],
  smile: 'M212 270q44 36 88 0',
  cut: 'M256 140v214',
} as const

/** Logo Tookthel: struk lime tersenyum di kotak gelap, sesekali berkedip. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      {/* Di mode gelap kotaknya ikut warna kartu total supaya tidak tenggelam di latar. */}
      <path d={LOGO.tile} fill="var(--hero)" />
      <path d={LOGO.receipt} fill="#D4F35B" />
      <motion.g
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ duration: 0.24, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 4 }}
      >
        {LOGO.eyes.map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="14" fill="#141414" />
        ))}
      </motion.g>
      <path d={LOGO.smile} stroke="#141414" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d={LOGO.cut} stroke="#141414" strokeWidth="10" strokeDasharray="14 14" opacity=".35" />
    </svg>
  )
}
