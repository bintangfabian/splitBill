import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronDown, Share2 } from 'lucide-react'
import { useState, type Dispatch } from 'react'
import { toast } from 'sonner'
import type { BillResult } from '../lib/calc'
import { rupiah } from '../lib/format'
import type { Action } from '../lib/store'
import type { Bill } from '../lib/types'
import { DoneIllustration } from './Illustrations'
import { AnimatedRupiah, Avatar, Button } from './ui'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const rise = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 26 } },
}

export function buildShareText(bill: Bill, result: BillResult) {
  const payer = bill.people.find((p) => p.id === bill.payerId)
  const lines = [
    `🧾 ${bill.title || 'Split Bill'}`,
    `Total: ${rupiah(result.total)}${payer ? ` — dibayar ${payer.name}` : ''}`,
    '',
    ...result.perPerson.map((r) => {
      const p = bill.people.find((x) => x.id === r.personId)!
      const tag = r.personId === bill.payerId ? ' (yang bayar)' : ''
      return `• ${p.name}${tag}: ${rupiah(r.total)}`
    }),
    '',
    `Service ${bill.charges.servicePct}% · Pajak ${bill.charges.taxPct}%`,
    'Dihitung pakai SplitBill ✨',
  ]
  return lines.join('\n')
}

export function ResultStep({ bill, result, dispatch }: { bill: Bill; result: BillResult; dispatch: Dispatch<Action> }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const payer = bill.people.find((p) => p.id === bill.payerId)
  const owed = result.perPerson.filter((r) => r.personId !== bill.payerId).reduce((s, r) => s + r.total, 0)

  const share = async () => {
    const text = buildShareText(bill, result)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Split Bill', text })
        return
      }
      await navigator.clipboard.writeText(text)
      toast.success('Rincian disalin', { description: 'Tinggal paste ke grup chat 🙌' })
    } catch (e) {
      if ((e as Error).name !== 'AbortError') toast.error('Gagal membagikan rincian')
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={rise} className="mb-4 flex items-center gap-3">
        <DoneIllustration className="w-20 shrink-0" />
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">Langkah 4</p>
          <h2 className="text-[2rem] leading-[1.05] font-extrabold tracking-tight">
            Beres, <span className="font-serif font-normal italic">tinggal transfer!</span>
          </h2>
        </div>
      </motion.div>

      {/* Bento ringkasan */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div variants={rise} className="relative col-span-2 overflow-hidden rounded-[1.8rem] bg-hero p-6 text-[#F6F5F1]">
          <motion.div
            aria-hidden
            className="absolute -top-16 -right-10 size-48 rounded-full bg-lime/25 blur-2xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <p className="relative text-sm opacity-70">Total tagihan</p>
          <AnimatedRupiah value={result.total} className="relative mt-1 block text-4xl font-extrabold tracking-tight text-lime" />
          <p className="relative mt-3 text-sm opacity-70">
            {bill.people.length} orang · {bill.items.length} menu
          </p>
        </motion.div>

        <motion.div variants={rise} className="rounded-[1.6rem] bg-[#C3B1E1] p-5 text-[#141414]">
          <p className="text-xs font-semibold opacity-70">Pajak + service</p>
          <AnimatedRupiah value={result.tax + result.service} className="mt-1 block text-lg font-extrabold" />
        </motion.div>
        <motion.div variants={rise} className="rounded-[1.6rem] bg-[#B8E0D2] p-5 text-[#141414]">
          <p className="text-xs font-semibold opacity-70">Ditagih ke teman</p>
          <AnimatedRupiah value={owed} className="mt-1 block text-lg font-extrabold" />
        </motion.div>

        <motion.div variants={rise} className="col-span-2 rounded-[1.6rem] bg-surface p-5">
          <p className="text-sm font-semibold">Siapa yang bayar duluan?</p>
          <div className="no-scrollbar -mx-5 mt-2 flex gap-3 overflow-x-auto px-5 pt-1.5 pb-1">
            {bill.people.map((p) => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch({ type: 'payer', id: p.id })}
                className="flex w-16 shrink-0 flex-col items-center gap-1.5"
              >
                <Avatar name={p.name} color={p.color} size={48} selected={p.id === bill.payerId} />
                <span className={`w-full truncate text-xs font-semibold ${p.id === bill.payerId ? 'text-ink' : 'text-muted'}`}>
                  {p.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Per orang */}
      <motion.p variants={rise} className="mt-7 mb-3 text-xs font-bold tracking-[0.18em] text-muted uppercase">
        Rincian per orang
      </motion.p>
      <div className="space-y-2.5">
        {result.perPerson.map((r) => {
          const p = bill.people.find((x) => x.id === r.personId)!
          const isPayer = r.personId === bill.payerId
          const open = expanded === r.personId
          return (
            <motion.div key={r.personId} variants={rise} layout className="overflow-hidden rounded-[1.4rem] bg-surface">
              <button onClick={() => setExpanded(open ? null : r.personId)} className="flex w-full items-center gap-3 p-4 text-left">
                <Avatar name={p.name} color={p.color} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    {isPayer ? (
                      <span className="font-semibold text-violet">Yang bayar duluan</span>
                    ) : payer ? (
                      <>
                        Transfer ke <ArrowRight size={11} /> <b className="text-ink">{payer.name}</b>
                      </>
                    ) : (
                      `${r.lines.length} menu`
                    )}
                  </p>
                </div>
                <AnimatedRupiah value={r.total} className="font-extrabold" />
                <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-muted">
                  <ChevronDown size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                  >
                    <div className="mx-4 mb-4 space-y-1.5 border-t border-dashed border-line pt-3 text-sm">
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
            </motion.div>
          )
        })}
      </div>

      <motion.div variants={rise} className="mt-6">
        <Button variant="lime" className="w-full" onClick={share}>
          <Share2 size={18} /> Bagikan ke grup
        </Button>
      </motion.div>
    </motion.div>
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
