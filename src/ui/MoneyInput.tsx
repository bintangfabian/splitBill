import { parseNumber, thousands } from '../lib/format'

export function MoneyInput({
  value,
  onChange,
  label,
  showLabel = false,
  className = '',
}: {
  value: number
  onChange: (n: number) => void
  /** Nama input untuk screen reader. */
  label: string
  /** Tampilkan `label` sebagai keterangan kecil di dalam kotak, untuk isian tanpa judul di luar. */
  showLabel?: boolean
  className?: string
}) {
  const field = (
    <>
      <span className="text-sm font-semibold text-muted">Rp</span>
      <input
        inputMode="numeric"
        aria-label={label}
        value={thousands(value)}
        placeholder="0"
        onChange={(e) => onChange(parseNumber(e.target.value))}
        className="w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums outline-none placeholder:text-muted"
      />
    </>
  )
  const box = `rounded-2xl bg-surface-2 px-4 ring-ink/80 transition focus-within:ring-2 ${className}`

  if (!showLabel) return <label className={`flex items-center gap-2 py-3.5 ${box}`}>{field}</label>

  return (
    <label className={`flex flex-col pt-2.5 pb-3 ${box}`}>
      {/* Nama untuk screen reader sudah dari aria-label, jadi keterangannya disembunyikan dari pembaca layar. */}
      <span className="text-[11px] font-semibold text-muted" aria-hidden>
        {label}
      </span>
      <span className="flex flex-1 items-center gap-2">{field}</span>
    </label>
  )
}
