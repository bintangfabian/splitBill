import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Wallet } from 'lucide-react'
import { useEffect, useState, type Dispatch } from 'react'
import type { Bill } from '../../domain/bill'
import type { BillResult } from '../../domain/calculate'
import { rupiah } from '../../lib/format'
import type { Action } from '../../state/billReducer'
import { AnimatedRupiah, Avatar, SectionTitle } from '../../ui'
import { duration, ease, press } from '../../ui/motion'

// Struk "tercetak" sekali per isi tagihan; bolak-balik ke Hasil tidak mengulang animasinya.
let printedKey = ''

export function ResultStep({ bill, result, dispatch }: { bill: Bill; result: BillResult; dispatch: Dispatch<Action> }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const payer = bill.people.find((p) => p.id === bill.payerId)
  const owed = result.perPerson.filter((r) => r.personId !== bill.payerId).reduce((s, r) => s + r.total, 0)

  const reduceMotion = useReducedMotion()
  const key = JSON.stringify([bill.people, bill.items, bill.charges])
  const [print] = useState(() => !reduceMotion && key !== printedKey)
  useEffect(() => {
    printedKey = key
  }, [key])

  return (
    <div>
      <SectionTitle title="Rincian patungan">
        {payer ? `Semua transfer ke ${payer.name}. Ketuk nama untuk melihat rinciannya.` : 'Pilih siapa yang bayar duluan di bawah.'}
      </SectionTitle>

      <motion.div
        data-print={print ? 'on' : 'off'}
        initial={print ? { clipPath: 'inset(0 0 100% 0)', y: -6 } : false}
        animate={{ clipPath: 'inset(0 0 -12px 0)', y: 0 }}
        transition={{ duration: duration.print, ease: ease.out }}
      >
        <div className="receipt-edge rounded-t-card bg-surface px-4 pt-4 pb-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate font-semibold">{bill.title || 'Patungan'}</p>
            <p className="shrink-0 text-[13px] text-muted">
              {bill.people.length} orang · {bill.items.length} menu
            </p>
          </div>
          <div className="rule-dashed mt-3" />

          <ul>
            {result.perPerson.map((r) => {
              const p = bill.people.find((x) => x.id === r.personId)!
              const isPayer = r.personId === bill.payerId
              const open = expanded === r.personId
              return (
                <li key={r.personId}>
                  <button
                    onClick={() => setExpanded(open ? null : r.personId)}
                    aria-expanded={open}
                    className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-control px-2 py-2.5 text-left transition-colors active:bg-surface-2"
                  >
                    <Avatar name={p.name} color={p.color} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="truncate text-[13px] text-muted">
                        {isPayer ? `Bayar duluan · ${r.lines.length} menu` : `${r.lines.length} menu`}
                      </p>
                    </div>
                    <AnimatedRupiah value={r.total} className="font-bold" />
                    <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: duration.base, ease: ease.out }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-3 pl-11 text-sm">
                          {r.lines.length === 0 && <p className="text-muted">Tidak memesan apa pun</p>}
                          {r.lines.map((l) => (
                            <Row key={l.itemId} label={l.split > 1 ? `${l.name} (÷${l.split})` : l.name} value={l.amount} />
                          ))}
                          {r.discount > 0 && <Row label="Diskon" value={-r.discount} />}
                          {r.service > 0 && <Row label="Service" value={r.service} muted />}
                          {r.tax > 0 && <Row label="Pajak" value={r.tax} muted />}
                          {r.extra > 0 && <Row label="Biaya lain" value={r.extra} muted />}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>

          <div className="rule-dashed my-2" />
          {payer && result.perPerson.length > 1 && (
            <div className="flex justify-between py-1 text-[15px]">
              <span className="text-muted">Ditagih ke teman</span>
              <AnimatedRupiah value={owed} />
            </div>
          )}
          <div className="flex items-baseline justify-between py-1">
            <span className="font-semibold">Total</span>
            <AnimatedRupiah value={result.total} className="text-xl font-bold" />
          </div>
        </div>
      </motion.div>

      <div className="mt-6 rounded-card bg-surface p-4">
        <p className="font-semibold">Siapa yang bayar duluan?</p>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          {bill.people.map((p) => (
            <motion.button
              key={p.id}
              whileTap={press}
              transition={{ duration: duration.fast }}
              onClick={() => dispatch({ type: 'payer', id: p.id })}
              aria-pressed={p.id === bill.payerId}
              className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 pt-1"
            >
              <Avatar name={p.name} color={p.color} size={44} selected={p.id === bill.payerId} />
              <span
                className={`line-clamp-2 w-full text-center text-xs leading-tight font-semibold wrap-break-word ${p.id === bill.payerId ? 'text-ink' : 'text-muted'}`}
              >
                {p.name}
              </span>
            </motion.button>
          ))}
        </div>
        {payer && (
          <>
            <label className="mt-3 flex h-12 items-center gap-2.5 rounded-control bg-surface-2 px-4 ring-ink transition-shadow focus-within:ring-2">
              <Wallet size={17} className="shrink-0 text-muted" aria-hidden />
              <input
                value={bill.paymentInfo}
                onChange={(e) => dispatch({ type: 'paymentInfo', paymentInfo: e.target.value })}
                placeholder={`Rekening / e-wallet ${payer.name}`}
                aria-label="Rekening atau e-wallet pembayar"
                maxLength={80}
                autoComplete="off"
                className="w-full min-w-0 bg-transparent text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-muted"
              />
            </label>
            <p className="mt-1.5 text-[13px] text-muted">Ikut di teks yang dibagikan, mis. BCA 1234567890 a.n. {payer.name}.</p>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${muted ? 'text-muted' : ''}`}>
      <span className="truncate">{label}</span>
      <span className="shrink-0 tabular-nums">{rupiah(value)}</span>
    </div>
  )
}
