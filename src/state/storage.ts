import { emptyBill, type Bill } from '../domain/bill'

const KEY = 'tookthel:v1'
// Key sebelum ganti nama dari SplitBill; tetap dibaca supaya tagihan pengguna lama tidak hilang.
const LEGACY_KEY = 'splitbill:v1'

type Store = Pick<Storage, 'getItem' | 'setItem'>

export function loadBill(storage: Store = globalThis.localStorage): Bill {
  try {
    const raw = storage.getItem(KEY) ?? storage.getItem(LEGACY_KEY)
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
