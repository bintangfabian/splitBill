import { describe, expect, it } from 'vitest'
import { emptyBill, type Bill, type Charges, type Item } from './bill'
import { calculate } from './calculate'
import { billMood } from './mood'

const people = [
  { id: 'a', name: 'Budi', color: '#000' },
  { id: 'b', name: 'Ani', color: '#000' },
]
const item = (id: string, sharedBy: string[]): Item => ({ id, name: id, price: 50000, qty: 1, sharedBy })
const mood = (patch: Partial<Bill>, charges: Partial<Charges> = {}) => {
  const base = emptyBill()
  const bill = { ...base, people, ...patch, charges: { ...base.charges, ...charges } }
  return billMood(calculate(bill))
}

describe('billMood', () => {
  it('senang kalau semua pesanan sudah ada pemiliknya dan tanpa diskon', () => {
    expect(mood({ items: [item('x', ['a', 'b'])] })).toBe('happy')
  })

  it('girang kalau diskon memotong tagihan, baik nominal maupun persen', () => {
    expect(mood({ items: [item('x', ['a'])] }, { discount: 10000 })).toBe('excited')
    expect(mood({ items: [item('x', ['a'])] }, { discount: 20, discountType: 'pct' })).toBe('excited')
  })

  it('tetap senang kalau diskon diisi tapi belum ada pesanan yang dipotong', () => {
    expect(mood({ items: [] }, { discount: 10000 })).toBe('happy')
  })

  it('cemas kalau ada pesanan tanpa pemilik, walaupun ada diskon', () => {
    expect(mood({ items: [item('x', ['a']), item('y', [])] })).toBe('worried')
    expect(mood({ items: [item('x', ['a']), item('y', ['orang-terhapus'])] }, { discount: 10000 })).toBe('worried')
  })
})
