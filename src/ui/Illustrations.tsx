import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'

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

/** Ekspresi wajah struk; dipilih dari kondisi tagihan oleh fitur yang memakainya. */
export type FaceMood = 'happy' | 'excited' | 'worried'

const stroke = { stroke: 'var(--ink)', strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' }

const faces: Record<FaceMood, ReactNode> = {
  happy: (
    <>
      <circle cx="48" cy="29" r="3.2" fill="var(--ink)" />
      <circle cx="66" cy="29" r="3.2" fill="var(--ink)" />
      <path d="M51 37q6 5 12 0" {...stroke} />
    </>
  ),
  // Mata tertutup senang seperti teman mint di ilustrasi langkah Teman, plus pipi merona.
  excited: (
    <>
      <path d="M44.5 30q3.5-4.5 7 0M62.5 30q3.5-4.5 7 0" {...stroke} />
      <path d="M51 35h12a6 6 0 0 1-12 0z" fill="var(--ink)" />
      <circle cx="42.5" cy="37" r="3" fill="#FF7A59" opacity=".35" />
      <circle cx="71.5" cy="37" r="3" fill="#FF7A59" opacity=".35" />
    </>
  ),
  worried: (
    <>
      <path d="M43.5 23l6-2.2M70.5 23l-6-2.2" {...stroke} strokeWidth={2.6} />
      <circle cx="48" cy="29.5" r="2.8" fill="var(--ink)" />
      <circle cx="66" cy="29.5" r="2.8" fill="var(--ink)" />
      <path d="M50 39q2.33-2.6 4.67 0t4.67 0t4.67 0" {...stroke} strokeWidth={2.6} />
    </>
  ),
}

/** Badan struk berwajah; wajahnya berganti dengan animasi kecil saat ekspresinya berubah. */
function ReceiptBuddy({ mood }: { mood: FaceMood }) {
  return (
    <>
      <path
        d="M39 10h36a6 6 0 0 1 6 6v54l-8-5-8 5-8-5-8 5-8-5-8 5V16a6 6 0 0 1 6-6z"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.g
          key={mood}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {faces[mood]}
        </motion.g>
      </AnimatePresence>
      <rect x="40" y="47" width="22" height="4" rx="2" fill="var(--line)" />
      <rect x="66" y="47" width="8" height="4" rx="2" fill="#7C5CFF" />
      <rect x="40" y="55" width="34" height="4" rx="2" fill="#D4F35B" />
    </>
  )
}

/** Struk kecil berwajah dengan lencana % — header langkah Pajak. */
export function TaxIllustration({ mood = 'happy', className = '' }: { mood?: FaceMood; className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden>
      <ellipse cx="57" cy="84" rx="26" ry="3.5" fill="var(--surface-2)" />
      <motion.g {...float(0, 3)}>
        <ReceiptBuddy mood={mood} />
      </motion.g>
      <motion.g
        animate={{ y: [0, -4, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <circle cx="91" cy="21" r="14" fill="#B8E0D2" stroke="var(--ink)" strokeWidth="3" />
        {/* Tanda % digambar sebagai garis supaya tetap tajam dan gelap di mode gelap. */}
        <g stroke="#141414" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <circle cx="86.5" cy="16.5" r="2.4" />
          <circle cx="95.5" cy="25.5" r="2.4" />
          <path d="M95.5 14.5l-9 13" />
        </g>
      </motion.g>
      <motion.path
        d="M17 13l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z"
        fill="#D4F35B"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      {/* Bintang tambahan muncul saat struknya girang karena ada diskon. */}
      <AnimatePresence>
        {mood === 'excited' && (
          <motion.path
            d="M105 34l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"
            fill="#D4F35B"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 14 }}
          />
        )}
      </AnimatePresence>
      <circle cx="104" cy="60" r="3.5" fill="#FF7A59" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="19" cy="58" r="3.5" fill="#FFD97D" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  )
}

/** Struk cemas berkeringat — penanda ada yang belum beres di daftar pesanan. */
export function WorriedReceiptIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="28 5 70 70" className={className} aria-hidden>
      <motion.g
        animate={{ rotate: [0, -3, 3, -2, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
      >
        <ReceiptBuddy mood="worried" />
      </motion.g>
      <motion.path
        d="M89 13c2.6 3.6 4 5.8 4 7.6a4 4 0 0 1-8 0c0-1.8 1.4-4 4-7.6z"
        fill="#B8E0D2"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
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
