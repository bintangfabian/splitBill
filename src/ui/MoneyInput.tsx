import { parseNumber, thousands } from '../lib/format'

export function MoneyInput({
  value,
  onChange,
  label,
  placeholder = '0',
  prefix = 'Rp',
  suffix,
  className = '',
}: {
  value: number
  onChange: (n: number) => void
  /** Nama input untuk screen reader. */
  label: string
  placeholder?: string
  prefix?: string
  suffix?: string
  className?: string
}) {
  return (
    <label
      className={`flex h-12 items-center gap-2 rounded-control bg-surface-2 px-4 ring-ink transition-shadow focus-within:ring-2 ${className}`}
    >
      {prefix && <span className="text-[15px] font-semibold text-muted">{prefix}</span>}
      <input
        inputMode="numeric"
        aria-label={label}
        value={thousands(value)}
        placeholder={placeholder}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        className="w-full min-w-0 bg-transparent text-[17px] font-semibold tabular-nums outline-none placeholder:text-muted"
      />
      {suffix && <span className="text-sm font-semibold text-muted">{suffix}</span>}
    </label>
  )
}
