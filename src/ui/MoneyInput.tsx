import { parseNumber, thousands } from '../lib/format'

export function MoneyInput({
  value,
  onChange,
  placeholder = '0',
  prefix = 'Rp',
  suffix,
  className = '',
  autoFocus,
}: {
  value: number
  onChange: (n: number) => void
  placeholder?: string
  prefix?: string
  suffix?: string
  className?: string
  autoFocus?: boolean
}) {
  return (
    <label
      className={`flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-3.5 ring-ink/80 transition focus-within:ring-2 ${className}`}
    >
      {prefix && <span className="text-sm font-semibold text-muted">{prefix}</span>}
      <input
        inputMode="numeric"
        autoFocus={autoFocus}
        value={thousands(value)}
        placeholder={placeholder}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        className="w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums outline-none placeholder:text-muted/60"
      />
      {suffix && <span className="text-sm font-semibold text-muted">{suffix}</span>}
    </label>
  )
}
