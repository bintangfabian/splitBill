import { useEffect, useReducer } from 'react'
import type { Bill, Charges, Item, Person } from './types'
import { uid } from './format'

export const PALETTE = ['#FFB4A2', '#B8E0D2', '#C3B1E1', '#FFD97D', '#A0C4FF', '#F4A6CD', '#B5E48C', '#FFC6A5']

const KEY = 'splitbill:v1'

export const emptyBill = (): Bill => ({
  title: '',
  people: [],
  items: [],
  charges: { servicePct: 5, taxPct: 10, taxAfterService: true, discount: 0, discountType: 'amount', extraFee: 0 },
  payerId: null,
})

export type Action =
  | { type: 'title'; title: string }
  | { type: 'addPerson'; name: string }
  | { type: 'removePerson'; id: string }
  | { type: 'restorePerson'; person: Person; index: number; items: Item[]; payerId: string | null }
  | { type: 'upsertItem'; item: Item }
  | { type: 'removeItem'; id: string }
  | { type: 'restoreItem'; item: Item; index: number }
  | { type: 'charges'; patch: Partial<Charges> }
  | { type: 'payer'; id: string }
  | { type: 'reset' }
  | { type: 'replace'; bill: Bill }

function reducer(bill: Bill, a: Action): Bill {
  switch (a.type) {
    case 'title':
      return { ...bill, title: a.title }
    case 'addPerson': {
      const used = new Set(bill.people.map((p) => p.color))
      const color = PALETTE.find((c) => !used.has(c)) ?? PALETTE[bill.people.length % PALETTE.length]
      const person = { id: uid(), name: a.name.trim(), color }
      return { ...bill, people: [...bill.people, person], payerId: bill.payerId ?? person.id }
    }
    case 'removePerson': {
      const people = bill.people.filter((p) => p.id !== a.id)
      return {
        ...bill,
        people,
        items: bill.items.map((i) => ({ ...i, sharedBy: i.sharedBy.filter((id) => id !== a.id) })),
        payerId: bill.payerId === a.id ? (people[0]?.id ?? null) : bill.payerId,
      }
    }
    case 'restorePerson': {
      const people = [...bill.people]
      people.splice(a.index, 0, a.person)
      return { ...bill, people, items: a.items, payerId: a.payerId }
    }
    case 'upsertItem': {
      const exists = bill.items.some((i) => i.id === a.item.id)
      return {
        ...bill,
        items: exists ? bill.items.map((i) => (i.id === a.item.id ? a.item : i)) : [...bill.items, a.item],
      }
    }
    case 'removeItem':
      return { ...bill, items: bill.items.filter((i) => i.id !== a.id) }
    case 'restoreItem': {
      const items = [...bill.items]
      items.splice(a.index, 0, a.item)
      return { ...bill, items }
    }
    case 'charges':
      return { ...bill, charges: { ...bill.charges, ...a.patch } }
    case 'payer':
      return { ...bill, payerId: a.id }
    case 'reset':
      return emptyBill()
    case 'replace':
      return a.bill
  }
}

function load(): Bill {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...emptyBill(), ...JSON.parse(raw) }
  } catch {
    /* storage tidak tersedia */
  }
  return emptyBill()
}

export function useBill() {
  const [bill, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(bill))
    } catch {
      /* abaikan */
    }
  }, [bill])
  return [bill, dispatch] as const
}
