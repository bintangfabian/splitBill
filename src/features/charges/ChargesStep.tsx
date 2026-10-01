import { motion } from 'motion/react'
import type { Dispatch, ReactNode } from 'react'
import type { Bill } from '../../domain/bill'
import type { BillResult } from '../../domain/calculate'
import type { Action } from '../../state/billReducer'
import { AnimatedRupiah, MoneyInput, PercentInput, SectionTitle, Segmented, Toggle } from '../../ui'

function Presets({ values, current, onPick }: { values: number[]; current: number; onPick: (v: number) => void }) {
  return (
    <div className="mt-2.5 grid grid-cols-3 gap-1">
      {values.map((v) => (
        <motion.button
          key={v}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPick(v)}
          className={`rounded-full py-1 text-xs font-bold transition-colors ${current === v ? 'bg-ink text-bg' : 'bg-surface-2 text-muted'}`}
        >
          {v}%
        </motion.button>
      ))}
    </div>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[1.6rem] bg-surface p-5 ${className}`}>{children}</div>
}

export function ChargesStep({ bill, result, dispatch }: { bill: Bill; result: BillResult; dispatch: Dispatch<Action> }) {
  const c = bill.charges
  const patch = (p: Partial<typeof c>) => dispatch({ type: 'charges', patch: p })

  const rows = [
    { label: 'Subtotal', value: result.subtotal, show: true },
    { label: 'Diskon', value: -result.discount, show: result.discount > 0 },
    { label: `Service ${c.servicePct}%`, value: result.service, show: c.servicePct > 0 },
    { label: `Pajak ${c.taxPct}%`, value: result.tax, show: c.taxPct > 0 },
    { label: 'Biaya lain', value: result.extra, show: c.extraFee > 0 },
  ]

  return (
    <div>
      <SectionTitle eyebrow="Langkah 3" title={<>Pajak & <span className="font-serif font-normal italic">service</span></>}>
        Samain sama yang tertulis di struk ya.
      </SectionTitle>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="mb-2 text-sm font-semibold">Service</p>
          <PercentInput value={c.servicePct} onChange={(servicePct) => patch({ servicePct })} />
          <Presets values={[0, 5, 10]} current={c.servicePct} onPick={(servicePct) => patch({ servicePct })} />
        </Card>
        <Card>
          <p className="mb-2 text-sm font-semibold">Pajak (PB1)</p>
          <PercentInput value={c.taxPct} onChange={(taxPct) => patch({ taxPct })} />
          <Presets values={[0, 10, 11]} current={c.taxPct} onPick={(taxPct) => patch({ taxPct })} />
        </Card>

        <Card className="col-span-2">
          <Toggle
            checked={c.taxAfterService}
            onChange={(taxAfterService) => patch({ taxAfterService })}
            label={
              <>
                <b className="font-semibold">Pajak dihitung setelah service</b>
                <span className="block text-xs text-muted">Umumnya begini di restoran Indonesia</span>
              </>
            }
          />
        </Card>

        <Card className="col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Diskon / promo</p>
            <div className="w-32">
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
            <MoneyInput value={c.discount} onChange={(discount) => patch({ discount })} />
          ) : (
            <PercentInput value={c.discount} onChange={(discount) => patch({ discount })} />
          )}
          <p className="mt-2 text-xs text-muted">Dipotong dari subtotal sebelum service & pajak, dibagi sesuai porsi pesanan.</p>
        </Card>

        <Card className="col-span-2">
          <p className="mb-2 text-sm font-semibold">Ongkir / biaya lain</p>
          <MoneyInput value={c.extraFee} onChange={(extraFee) => patch({ extraFee })} />
          <p className="mt-2 text-xs text-muted">Dibagi rata ke semua orang.</p>
        </Card>
      </div>

      <motion.div layout className="mt-4 overflow-hidden rounded-[1.6rem] bg-hero p-5 text-[#F6F5F1]">
        {rows
          .filter((r) => r.show)
          .map((r) => (
            <motion.div layout key={r.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between py-1 text-sm opacity-80">
              <span>{r.label}</span>
              <AnimatedRupiah value={r.value} />
            </motion.div>
          ))}
        <motion.div layout className="mt-3 flex items-end justify-between border-t border-dashed border-white/20 pt-3">
          <span className="text-sm font-semibold">Total</span>
          <AnimatedRupiah value={result.total} className="text-2xl font-extrabold text-lime" />
        </motion.div>
      </motion.div>
    </div>
  )
}
