import { initials } from '../lib/format'

export function Avatar({ name, color, size = 40, selected }: { name: string; color: string; size?: number; selected?: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-grid shrink-0 place-items-center rounded-full font-bold text-charcoal transition-shadow"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.36,
        boxShadow: selected ? `0 0 0 3px var(--bg), 0 0 0 5px var(--ink)` : undefined,
      }}
    >
      {/* Di ukuran kecil dua huruf terlalu sesak, jadi cukup huruf pertama. */}
      {initials(name, size < 32 ? 1 : 2) || '?'}
    </span>
  )
}
