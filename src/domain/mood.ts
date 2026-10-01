import type { BillResult } from './calculate'

/** Ekspresi maskot struk di langkah Pesanan dan Pajak. */
export type Mood = 'happy' | 'excited' | 'worried'

/**
 * Cemas kalau masih ada pesanan tanpa pemilik, karena tagihan belum bisa dibagi.
 * Girang kalau diskon benar-benar memotong tagihan. Selain itu senang.
 */
export function billMood(result: BillResult): Mood {
  if (result.unassigned > 0) return 'worried'
  if (result.discount > 0) return 'excited'
  return 'happy'
}
