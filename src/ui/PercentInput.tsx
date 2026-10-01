import { useEffect, useState } from 'react'

export function PercentInput({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const [text, setText] = useState(String(value))
  useEffect(() => {
    if (Number(text.replace(',', '.')) !== value) setText(String(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <label className="flex h-11 w-24 items-center gap-1 rounded-control bg-surface-2 px-3 ring-ink transition-shadow focus-within:ring-2">
      <input
        inputMode="decimal"
        aria-label={label}
        value={text}
        onChange={(e) => {
          const t = e.target.value.replace(/[^\d.,]/g, '')
          setText(t)
          onChange(Math.min(100, Number(t.replace(',', '.')) || 0))
        }}
        className="w-full min-w-0 bg-transparent text-right text-[17px] font-semibold tabular-nums outline-none"
      />
      <span className="font-semibold text-muted">%</span>
    </label>
  )
}
