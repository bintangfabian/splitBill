import { rupiah } from '../lib/format'
import type { Bill, Charges } from './bill'
import type { BillResult } from './calculate'

/** Biaya tambahan yang dipakai saja, mis. "Service 5% · Pajak 10% · Diskon Rp 10.000". */
function chargesSummary(c: Charges) {
  return [
    c.servicePct > 0 && `Service ${c.servicePct}%`,
    c.taxPct > 0 && `Pajak ${c.taxPct}%`,
    c.discount > 0 && `Diskon ${c.discountType === 'pct' ? `${c.discount}%` : rupiah(c.discount)}`,
    c.extraFee > 0 && `Biaya lain ${rupiah(c.extraFee)}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Rincian tagihan dalam bentuk teks untuk dibagikan ke grup chat. */
export function buildShareText(bill: Bill, result: BillResult) {
  const payer = bill.people.find((p) => p.id === bill.payerId)
  const charges = chargesSummary(bill.charges)
  const lines = [
    `🧾 ${bill.title || 'Split Bill'}`,
    `Total: ${rupiah(result.total)}${payer ? ` — dibayar ${payer.name}` : ''}`,
    ...(payer && bill.paymentInfo.trim() ? [`Transfer ke: ${bill.paymentInfo.trim()}`] : []),
    '',
    ...result.perPerson.map((r) => {
      const p = bill.people.find((x) => x.id === r.personId)!
      const tag = r.personId === bill.payerId ? ' (yang bayar)' : ''
      return `• ${p.name}${tag}: ${rupiah(r.total)}`
    }),
    '',
    ...(charges ? [charges] : []),
    'Dihitung pakai SplitBill ✨',
  ]
  return lines.join('\n')
}
