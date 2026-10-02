import { receiptDate, rupiah } from '../lib/format'
import type { Bill } from './bill'
import type { BillResult } from './calculate'

export type ReceiptLine = { label: string; amount: number }

/** Isi struk patungan; digambar ke kanvas lalu dibagikan sebagai gambar. */
export type Receipt = {
  title: string
  printedAt: string
  items: { name: string; qty: number; price: number; amount: number }[]
  subtotal: number
  /** Diskon (negatif), service, pajak, dan biaya lain yang dipakai saja. */
  charges: ReceiptLine[]
  total: number
  people: { name: string; amount: number; isPayer: boolean }[]
  payerName: string | null
  paymentInfo: string
  /** Keterangan pembulatan per orang, atau null kalau tidak dibulatkan. */
  roundingNote: string | null
}

export function buildReceipt(bill: Bill, result: BillResult, printedAt: Date): Receipt {
  const { charges: c } = bill
  const payer = bill.people.find((p) => p.id === bill.payerId) ?? null
  const charges: (ReceiptLine | false)[] = [
    result.discount > 0 && { label: c.discountType === 'pct' ? `Diskon ${c.discount}%` : 'Diskon', amount: -result.discount },
    result.service > 0 && { label: `Service ${c.servicePct}%`, amount: result.service },
    result.tax > 0 && { label: `Pajak ${c.taxPct}%`, amount: result.tax },
    result.extra > 0 && { label: 'Biaya lain', amount: result.extra },
  ]

  return {
    title: bill.title.trim() || 'Patungan',
    printedAt: receiptDate(printedAt),
    items: bill.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, amount: i.price * i.qty })),
    subtotal: result.subtotal,
    charges: charges.filter((l) => l !== false),
    total: result.total,
    people: result.perPerson.map((r) => ({
      name: bill.people.find((p) => p.id === r.personId)!.name,
      amount: r.total,
      isPayer: r.personId === payer?.id,
    })),
    payerName: payer?.name ?? null,
    paymentInfo: payer ? bill.paymentInfo.trim() : '',
    roundingNote:
      c.roundTo > 1 ? `Dibulatkan ke ${rupiah(c.roundTo)}${payer ? `, selisihnya ke ${payer.name}` : ''}.` : null,
  }
}
