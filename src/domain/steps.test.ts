import { describe, expect, it } from 'vitest'
import { emptyBill, type Bill, type Item } from './bill'
import { calculate } from './calculate'
import { stepBlocker } from './steps'

const people = [
  { id: 'a', name: 'Budi', color: '#000' },
  { id: 'b', name: 'Ani', color: '#000' },
]
const item = (id: string, sharedBy: string[]): Item => ({ id, name: id, price: 1000, qty: 1, sharedBy })
const blocker = (target: number, patch: Partial<Bill>) => {
  const bill = { ...emptyBill(), ...patch }
  return stepBlocker(target, bill, calculate(bill))
}

describe('stepBlocker', () => {
  it('selalu mengizinkan langkah Teman', () => {
    expect(blocker(0, {})).toBeNull()
  })

  it('butuh minimal 2 orang untuk membuka Pesanan', () => {
    expect(blocker(1, { people: [people[0]] })).toBe('Tambah minimal 2 orang dulu')
    expect(blocker(1, { people })).toBeNull()
  })

  it('butuh minimal 1 pesanan untuk membuka Pajak dan Hasil', () => {
    expect(blocker(2, { people })).toBe('Tambah minimal 1 pesanan')
    expect(blocker(3, { people })).toBe('Tambah minimal 1 pesanan')
  })

  it('menahan Pajak kalau ada pesanan tanpa pemilik', () => {
    expect(blocker(2, { people, items: [item('x', ['a']), item('y', []), item('z', [])] })).toBe('2 pesanan belum ada yang pesan')
  })

  it('mengizinkan Hasil kalau semua syarat terpenuhi', () => {
    expect(blocker(3, { people, items: [item('x', ['a', 'b'])] })).toBeNull()
  })
})
