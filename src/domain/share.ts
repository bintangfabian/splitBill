import { rupiah } from '../lib/format'
import type { Bill } from './bill'
import type { BillResult } from './calculate'

/** Rincian tagihan dalam bentuk teks untuk dibagikan ke grup chat. */
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
