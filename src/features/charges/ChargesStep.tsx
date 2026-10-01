import { motion } from 'motion/react'
import type { Dispatch } from 'react'
import type { Bill, Charges } from '../../domain/bill'
import type { BillResult } from '../../domain/calculate'
import type { Action } from '../../state/billReducer'
import { AnimatedRupiah, MoneyInput, PercentInput, SectionTitle, Segmented, Toggle } from '../../ui'
import { duration, press } from '../../ui/motion'

/** Satu baris persen: label, pilihan cepat, dan isian angka di kanan. */
function PercentRow({
  label,
  name,
  value,
  presets,
  onChange,
}: {
  label: string
  /** nama singkat untuk screen reader, mis. "Pajak" untuk label "Pajak (PB1)" */
  name: string
  value: number
  presets: number[]
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        <div className="mt-2 flex gap-1.5">
          {presets.map((v) => (
            <motion.button
              key={v}
              whileTap={press}
              transition={{ duration: duration.fast }}
              onClick={() => onChange(v)}
              aria-label={`${name} ${v}%`}
              aria-pressed={value === v}
              className={`h-10 min-w-12 rounded-full px-3 text-[13px] font-semibold tabular-nums transition-colors ${value === v ? 'bg-ink text-bg' : 'bg-surface-2 text-ink'}`}
            >
              {v}%
            </motion.button>
          ))}
        </div>
      </div>
      <PercentInput label={`${name} (%)`} value={value} onChange={onChange} />
    </div>
  )
}

export function ChargesStep({ bill, result, dispatch }: { bill: Bill; result: BillResult; dispatch: Dispatch<Action> }) {
  const c = bill.charges
  const patch = (p: Partial<Charges>) => dispatch({ type: 'charges', patch: p })

  const rows = [
    { label: 'Subtotal', value: result.subtotal, show: true },
    { label: 'Diskon', value: -result.discount, show: result.discount > 0 },
    { label: `Service ${c.servicePct}%`, value: result.service, show: c.servicePct > 0 },
    { label: `Pajak ${c.taxPct}%`, value: result.tax, show: c.taxPct > 0 },
    { label: 'Biaya lain', value: result.extra, show: c.extraFee > 0 },
  ]

  return (
    <div>
      <SectionTitle title="Pajak, service, dan diskon">Samakan dengan angka di struk.</SectionTitle>

      <div className="divide-y divide-line rounded-card bg-surface">
        <PercentRow label="Service" name="Service" value={c.servicePct} presets={[0, 5, 10]} onChange={(servicePct) => patch({ servicePct })} />
        <PercentRow label="Pajak (PB1)" name="Pajak" value={c.taxPct} presets={[0, 10, 11]} onChange={(taxPct) => patch({ taxPct })} />
        <div className="px-4 py-2">
          <Toggle
            checked={c.taxAfterService}
            onChange={(taxAfterService) => patch({ taxAfterService })}
            label={
              <>
                <span className="font-semibold">Pajak dihitung setelah service</span>
                <span className="block text-[13px] text-muted">Umumnya begini di restoran Indonesia</span>
              </>
            }
          />
        </div>
      </div>

      <div className="mt-3 divide-y divide-line rounded-card bg-surface">
        <div className="space-y-2.5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">Diskon / promo</p>
            <div className="w-28">
              <Segmented
                id="disc"
                value={c.discountType}
                onChange={(discountType) => patch({ discountType, discount: 0 })}
                options={[
                  { value: 'amount', label: 'Rp' },
                  { value: 'pct', label: '%' },
                ]}
              />
            </div>
          </div>
          {c.discountType === 'amount' ? (
            <MoneyInput label="Diskon (Rp)" value={c.discount} onChange={(discount) => patch({ discount })} />
          ) : (
            <PercentInput label="Diskon (%)" value={c.discount} onChange={(discount) => patch({ discount })} />
          )}
          <p className="text-[13px] text-muted">Dipotong dari subtotal sebelum service & pajak, dibagi sesuai porsi pesanan.</p>
        </div>
        <div className="space-y-2.5 p-4">
          <p className="font-semibold">Ongkir / biaya lain</p>
          <MoneyInput label="Ongkir atau biaya lain" value={c.extraFee} onChange={(extraFee) => patch({ extraFee })} />
          <p className="text-[13px] text-muted">Dibagi rata ke semua orang.</p>
        </div>
      </div>

      {/* Ringkasan seperti bagian bawah struk. */}
      <div className="receipt-edge mt-3 rounded-t-card bg-surface px-4 pt-3 pb-4">
        {rows
          .filter((r) => r.show)
          .map((r) => (
            <div key={r.label} className="flex justify-between py-1 text-[15px]">
              <span className="text-muted">{r.label}</span>
              <AnimatedRupiah value={r.value} />
            </div>
          ))}
        <div className="rule-dashed my-2" />
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <AnimatedRupiah value={result.total} className="text-xl font-bold" />
        </div>
      </div>
    </div>
  )
}
