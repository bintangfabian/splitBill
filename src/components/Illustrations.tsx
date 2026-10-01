import { motion } from 'motion/react'

const float = (delay = 0, y = 6) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const, delay },
})

/** Tiga teman bulat dengan piring di tengah — dipakai di empty state langkah Teman. */
export function FriendsIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden>
      <ellipse cx="120" cy="152" rx="92" ry="10" fill="var(--surface-2)" />
      <motion.g {...float(0)}>
        <circle cx="62" cy="92" r="34" fill="#FFB4A2" />
        <circle cx="52" cy="86" r="4" fill="#141414" />
        <circle cx="72" cy="86" r="4" fill="#141414" />
        <path d="M52 101q10 8 20 0" stroke="#141414" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="44" cy="97" r="5" fill="#FF7A59" opacity=".35" />
      </motion.g>
      <motion.g {...float(0.4, 8)}>
        <circle cx="120" cy="70" r="40" fill="#C3B1E1" />
        <circle cx="108" cy="64" r="4.5" fill="#141414" />
        <circle cx="132" cy="64" r="4.5" fill="#141414" />
        <ellipse cx="120" cy="82" rx="7" ry="8" fill="#141414" />
        <path d="M96 38q24-22 48 0" stroke="#141414" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </motion.g>
      <motion.g {...float(0.8)}>
        <circle cx="178" cy="94" r="32" fill="#B8E0D2" />
        <path d="M164 88q5-5 10 0M182 88q5-5 10 0" stroke="#141414" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M168 102q10 9 20 0" stroke="#141414" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </motion.g>
      <motion.g
        animate={{ rotate: [0, 8, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '120px', originY: '138px' }}
      >
        <ellipse cx="120" cy="138" rx="34" ry="9" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />
        <ellipse cx="120" cy="135" rx="16" ry="5" fill="#D4F35B" />
      </motion.g>
      <motion.path
        d="M30 30l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"
        fill="#D4F35B"
        stroke="var(--ink)"
        strokeWidth="2"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        style={{ originX: '34px', originY: '43px' }}
      />
    </svg>
  )
}

/** Struk tersenyum — empty state langkah Pesanan. */
export function ReceiptIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden>
      <ellipse cx="120" cy="156" rx="70" ry="8" fill="var(--surface-2)" />
      <motion.g {...float(0, 7)}>
        <path
          d="M78 18h84a8 8 0 0 1 8 8v116l-12-8-12 8-12-8-12 8-12-8-12 8-12-8-12 8-12-8V26a8 8 0 0 1 8-8z"
          fill="var(--surface)"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="104" cy="54" r="4.5" fill="var(--ink)" />
        <circle cx="136" cy="54" r="4.5" fill="var(--ink)" />
        <path d="M108 68q12 10 24 0" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <rect x="88" y="90" width="40" height="6" rx="3" fill="var(--line)" />
        <rect x="140" y="90" width="16" height="6" rx="3" fill="#7C5CFF" />
        <rect x="88" y="104" width="30" height="6" rx="3" fill="var(--line)" />
        <rect x="140" y="104" width="16" height="6" rx="3" fill="#FF7A59" />
        <rect x="88" y="118" width="68" height="6" rx="3" fill="#D4F35B" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -14, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <circle cx="196" cy="54" r="16" fill="#FFD97D" stroke="var(--ink)" strokeWidth="3" />
        <path d="M196 46v16M191 50h8a3 3 0 0 1 0 6h-6" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="44" cy="80" r="12" fill="#B8E0D2" stroke="var(--ink)" strokeWidth="3" />
        <text x="44" y="85" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--ink)">%</text>
      </motion.g>
    </svg>
  )
}

/** Dompet yang “membelah” — hero kecil di header. */
export function SplitMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [-0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M6 10h16v30l-4-3-4 3-4-3-4 3z" fill="#D4F35B" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      </motion.g>
      <motion.g animate={{ x: [0, 3, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M26 10h16v30l-4-3-4 3-4-3-4 3z" fill="#C3B1E1" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      </motion.g>
    </svg>
  )
}

/** Piala/konfeti — header langkah Hasil. */
export function DoneIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden>
      <motion.g initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} style={{ originX: '60px', originY: '50px' }}>
        <circle cx="60" cy="48" r="30" fill="#D4F35B" stroke="var(--ink)" strokeWidth="3" />
        <motion.path
          d="M46 48l10 10 18-20"
          stroke="var(--ink)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        />
      </motion.g>
      {[
        { x: 18, y: 22, c: '#FF7A59', d: 0.2 },
        { x: 100, y: 18, c: '#7C5CFF', d: 0.3 },
        { x: 104, y: 70, c: '#FFD97D', d: 0.4 },
        { x: 14, y: 70, c: '#B8E0D2', d: 0.5 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="5"
          fill={s.c}
          stroke="var(--ink)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1], y: [0, -4, 0] }}
          transition={{ delay: s.d, duration: 0.6 }}
        />
      ))}
    </svg>
  )
}
