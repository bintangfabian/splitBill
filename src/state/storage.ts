import { emptyBill, type Bill } from '../domain/bill'

const KEY = 'splitbill:v1'

type Store = Pick<Storage, 'getItem' | 'setItem'>

export function loadBill(storage: Store = globalThis.localStorage): Bill {
  try {
    const raw = storage.getItem(KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      const empty = emptyBill()
      // Data lama bisa belum punya semua field charges, jadi isi kekurangannya dengan nilai bawaan.
      return { ...empty, ...saved, charges: { ...empty.charges, ...saved.charges } }
    }
  } catch {
    /* storage tidak tersedia atau isinya rusak */
  }
  return emptyBill()
}

export function saveBill(bill: Bill, storage: Store = globalThis.localStorage) {
  try {
    storage.setItem(KEY, JSON.stringify(bill))
  } catch {
    /* abaikan */
  }
}
