import type { Bill } from './bill'
import type { BillResult } from './calculate'

export const STEPS = ['Teman', 'Pesanan', 'Pajak', 'Hasil'] as const
export const LAST_STEP = STEPS.length - 1

/** Alasan langkah `target` belum bisa dibuka, atau null kalau boleh lanjut. */
export function stepBlocker(target: number, bill: Bill, result: BillResult): string | null {
  if (target >= 1 && bill.people.length < 2) return 'Tambah minimal 2 orang dulu'
  if (target >= 2 && bill.items.length === 0) return 'Tambah minimal 1 pesanan'
  if (target >= 2 && result.unassigned > 0) return `${result.unassigned} pesanan belum ada yang pesan`
  return null
}
