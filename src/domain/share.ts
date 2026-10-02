import { rupiah } from '../lib/format'
import type { Bill, Charges } from './bill'
import type { BillResult } from './calculate'

/** "a", "a dan b", "a, b, dan c" */
const list = (parts: string[]) => (parts.length < 3 ? parts.join(' dan ') : `${parts.slice(0, -1).join(', ')}, dan ${parts.at(-1)}`)

/** Penjelasan biaya tambahan yang dipakai saja, dalam kalimat biasa. */
function chargesNote(c: Charges, payerName: string | undefined) {
  const added = [
    c.servicePct > 0 && `service ${c.servicePct}%`,
    c.taxPct > 0 && `pajak ${c.taxPct}%`,
    c.extraFee > 0 && `biaya lain ${rupiah(c.extraFee)}`,
  ].filter((s) => s !== false)
  return [
    added.length > 0 && `Sudah termasuk ${list(added)}.`,
    c.discount > 0 && `Sudah dipotong diskon ${c.discountType === 'pct' ? `${c.discount}%` : rupiah(c.discount)}.`,
    c.roundTo > 1 && `Dibulatkan ke ${rupiah(c.roundTo)}${payerName ? `, selisihnya ke ${payerName}` : ''}.`,
  ]
    .filter((s) => s !== false)
    .join(' ')
}

/** Rincian tagihan sebagai pesan grup chat; ikut terkirim bersama gambar struk. */
export function buildShareText(bill: Bill, result: BillResult) {
  const payer = bill.people.find((p) => p.id === bill.payerId)
  const name = (id: string) => bill.people.find((p) => p.id === id)!.name
  const own = result.perPerson.find((r) => r.personId === payer?.id)
  const others = result.perPerson.filter((r) => r !== own)
  const account = payer ? bill.paymentInfo.trim() : ''
  const note = chargesNote(bill.charges, payer?.name)

  return [
    `${bill.title.trim() || 'Patungan'}: total ${rupiah(result.total)}${payer ? `, dibayar dulu sama ${payer.name}` : ''}.`,
    '',
    ...(payer ? [`Transfer ke ${payer.name} ya:`, ...(account ? [account, ''] : [])] : ['Bagian masing-masing:']),
    ...others.map((r) => `- ${name(r.personId)}: ${rupiah(r.total)}`),
    ...(own ? [`(Bagian ${payer!.name} sendiri ${rupiah(own.total)})`] : []),
    '',
    ...(note ? [note] : []),
    'Dihitung pakai SplitBill',
  ].join('\n')
}
