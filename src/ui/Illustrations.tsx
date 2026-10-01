/**
 * Ilustrasi garis tunggal (2 px, ujung membulat) dengan gaya yang sama dengan ikon Lucide.
 * Warnanya mengikuti `currentColor` dan sengaja diam. Lihat DESIGN.md.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Logo: struk yang terbelah dua. Garis di dalamnya memakai warna latar supaya tampak terpotong. */
export function SplitMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M8 10a2 2 0 0 1 2-2h12v32l-3.5-2.5L15 40l-3.5-2.5L8 40z" fill="currentColor" />
      <path d="M26 12h12a2 2 0 0 1 2 2v30l-3.5-2.5L33 44l-3.5-2.5L26 44z" fill="currentColor" />
      <path d="M11.5 15h7M11.5 20.5h4.5M29.5 19h7M29.5 24.5h4.5" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** Kosong di langkah Teman: dua orang mengapit satu struk. */
export function PeopleIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 96" className={className} aria-hidden>
      <g {...stroke}>
        <path d="M64 16h32v58l-5.3-4-5.4 4-5.3-4-5.3 4-5.4-4-5.3 4z" />
        <path d="M71 29h18M71 39h18M71 49h11" />
        <circle cx="32" cy="42" r="9" />
        <path d="M16 74a16 16 0 0 1 32 0" />
        <circle cx="128" cy="42" r="9" />
        <path d="M112 74a16 16 0 0 1 32 0" />
        <path d="M52 52h4M104 52h4" strokeDasharray="0.01 5" />
      </g>
    </svg>
  )
}

/** Kosong di langkah Pesanan: struk dengan baris menu, harga, dan total. */
export function ReceiptIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 96" className={className} aria-hidden>
      <g {...stroke}>
        <path d="M48 8h64v78l-5.3-4-5.4 4-5.3-4-5.3 4-5.4-4-5.3 4-5.3-4-5.4 4-5.3-4-5.3 4-5.4-4L48 86z" />
        <path d="M57 22h26M95 22h8M57 32h20M95 32h8M57 42h23M95 42h8" />
        <path d="M57 54h46" strokeDasharray="3 4" />
        <path d="M57 66h16M89 66h14" strokeWidth="3" />
      </g>
    </svg>
  )
}
