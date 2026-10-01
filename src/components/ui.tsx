import { animate, motion, useMotionValue, useTransform, type HTMLMotionProps } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Drawer } from 'vaul'
import { initials, parseNumber, rupiah, thousands } from '../lib/format'

type ButtonProps = HTMLMotionProps<'button'> & { variant?: 'primary' | 'lime' | 'ghost' | 'soft' }

const variants = {
  primary: 'bg-ink text-bg',
  lime: 'bg-lime text-[#141414]',
  ghost: 'bg-transparent text-ink',
  soft: 'bg-surface-2 text-ink',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

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

/** Angka rupiah yang “berlari” ke nilai barunya. */
export function AnimatedRupiah({ value, className = '' }: { value: number; className?: string }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => rupiah(v))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return c.stop
  }, [mv, value])
  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>
}

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

export function PercentInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [text, setText] = useState(String(value))
  useEffect(() => {
    if (Number(text.replace(',', '.')) !== value) setText(String(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <label className="flex items-center gap-1 rounded-2xl bg-surface-2 px-4 py-3 ring-ink/80 transition focus-within:ring-2">
      <input
        inputMode="decimal"
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

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  id: string
}) {
  return (
    <div className="flex rounded-2xl bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className="relative flex-1 rounded-xl px-3 py-2 text-sm font-semibold"
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${id}`}
              className="absolute inset-0 rounded-xl bg-surface shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className={`relative ${value === o.value ? 'text-ink' : 'text-muted'}`}>{o.label}</span>
        </button>
      ))}
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 py-1 text-left">
      <span className="text-sm">{label}</span>
      <span className={`flex h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${checked ? 'justify-end bg-ink' : 'justify-start bg-line'}`}>
        <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 30 }} className={`size-5 rounded-full ${checked ? 'bg-lime' : 'bg-surface'}`} />
      </span>
    </button>
  )
}

/** Bottom sheet ala iOS (Vaul): bisa di-drag turun untuk menutup. */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-lg flex-col rounded-t-[2rem] bg-surface outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line" />
          <div className="px-6 pt-4">
            <Drawer.Title className="text-xl font-bold tracking-tight">{title}</Drawer.Title>
            <Drawer.Description className={description ? 'mt-1 text-sm text-muted' : 'sr-only'}>
              {description ?? title}
            </Drawer.Description>
          </div>
          <div className="no-scrollbar overflow-y-auto px-6 pt-5 pb-safe">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">{eyebrow}</p>
      <h2 className="mt-1 text-[2rem] leading-[1.05] font-extrabold tracking-tight">{title}</h2>
      {children && <p className="mt-2 text-sm text-muted">{children}</p>}
    </div>
  )
}
