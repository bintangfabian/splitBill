import { initials } from '../lib/format'

export function Avatar({ name, color, size = 40, selected }: { name: string; color: string; size?: number; selected?: boolean }) {
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center rounded-full font-bold text-[#141414] transition-shadow"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.36,
        boxShadow: selected ? `0 0 0 3px var(--bg), 0 0 0 5px var(--ink)` : undefined,
      }}
    >
      {initials(name) || '?'}
    </span>
  )
}
