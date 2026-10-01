import { useEffect, useState } from 'react'

export function PercentInput({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const [text, setText] = useState(String(value))
  useEffect(() => {
    if (Number(text.replace(',', '.')) !== value) setText(String(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <label className="flex items-center gap-1 rounded-2xl bg-surface-2 px-4 py-3 ring-ink/80 transition focus-within:ring-2">
      <input
        inputMode="decimal"
        aria-label={label}
        value={text}
        onChange={(e) => {
          const t = e.target.value.replace(/[^\d.,]/g, '')
          setText(t)
          onChange(Math.min(100, Number(t.replace(',', '.')) || 0))
        }}
        className="w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums outline-none"
      />
      <span className="font-semibold text-muted">%</span>
    </label>
  )
}
