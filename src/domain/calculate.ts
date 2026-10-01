import type { Bill, Item } from './bill'

/** Jumlah harga semua menu sebelum pajak, termasuk yang belum ada pemesannya. */
export const itemsSubtotal = (items: Item[]) => items.reduce((s, i) => s + i.price * i.qty, 0)

export type PersonLine = { itemId: string; name: string; amount: number; split: number }

export type PersonResult = {
  personId: string
  lines: PersonLine[]
  subtotal: number
  discount: number
  service: number
  tax: number
  extra: number
  total: number // dibulatkan ke rupiah
}

export type BillResult = {
  subtotal: number
  discount: number
  service: number
  tax: number
  extra: number
  total: number
  perPerson: PersonResult[]
  unassigned: number // jumlah item yang belum ada pemiliknya
}

/**
 * Urutan hitung (umum di struk restoran Indonesia):
 *   subtotal − diskon → + service → + pajak (opsional dari subtotal + service) → + biaya lain.
 * Diskon, service & pajak dibagi proporsional sesuai pesanan; biaya lain dibagi rata.
 */
export function calculate(bill: Bill): BillResult {
  const { people, items, charges, payerId } = bill
  const ids = new Set(people.map((p) => p.id))

  const perPerson: PersonResult[] = people.map((p) => ({
    personId: p.id,
    lines: [],
    subtotal: 0,
    discount: 0,
    service: 0,
    tax: 0,
    extra: 0,
    total: 0,
  }))
  const byId = new Map(perPerson.map((r) => [r.personId, r]))

  let unassigned = 0
  for (const item of items) {
    const owners = item.sharedBy.filter((id) => ids.has(id))
    if (owners.length === 0) {
      unassigned++
      continue
    }
    const amount = (item.price * item.qty) / owners.length
    for (const id of owners) {
      const r = byId.get(id)!
      r.subtotal += amount
      r.lines.push({ itemId: item.id, name: item.name, amount, split: owners.length })
    }
  }

  const subtotal = perPerson.reduce((s, r) => s + r.subtotal, 0)
  const discountTotal = Math.min(
    subtotal,
    charges.discountType === 'pct' ? (subtotal * charges.discount) / 100 : charges.discount,
  )
  const extraPer = people.length ? charges.extraFee / people.length : 0

  let exact = 0
  for (const r of perPerson) {
    const share = subtotal ? r.subtotal / subtotal : 0
    r.discount = discountTotal * share
    const base = r.subtotal - r.discount
    r.service = (base * charges.servicePct) / 100
    r.tax = ((charges.taxAfterService ? base + r.service : base) * charges.taxPct) / 100
    r.extra = extraPer
    const t = base + r.service + r.tax + r.extra
    exact += t
    r.total = Math.round(t)
  }

  // Selisih pembulatan ditanggung si pembayar (atau orang pertama) supaya total pas.
  const total = Math.round(exact)
  const diff = total - perPerson.reduce((s, r) => s + r.total, 0)
  if (diff && perPerson.length) (byId.get(payerId ?? '') ?? perPerson[0]).total += diff

  const sum = (k: keyof Pick<PersonResult, 'discount' | 'service' | 'tax' | 'extra'>) =>
    perPerson.reduce((s, r) => s + r[k], 0)

  return {
    subtotal,
    discount: sum('discount'),
    service: sum('service'),
    tax: sum('tax'),
    extra: sum('extra'),
    total,
    perPerson,
    unassigned,
  }
}
