import { describe, expect, it } from 'vitest'
import { emptyBill, type Bill, type Item } from '../domain/bill'
import { billReducer, PALETTE } from './billReducer'

const withPeople = (...names: string[]) => names.reduce<Bill>((b, name) => billReducer(b, { type: 'addPerson', name }), emptyBill())
const item = (id: string, sharedBy: string[]): Item => ({ id, name: id, price: 10000, qty: 1, sharedBy })

describe('billReducer', () => {
  it('menambah orang dengan nama yang di-trim, warna unik, dan orang pertama jadi pembayar', () => {
    const b = withPeople('  Budi ', 'Ani')
    expect(b.people.map((p) => p.name)).toEqual(['Budi', 'Ani'])
    expect(b.people.map((p) => p.color)).toEqual([PALETTE[0], PALETTE[1]])
    expect(b.payerId).toBe(b.people[0].id)
  })

  it('memakai lagi warna yang sudah tidak terpakai', () => {
    let b = withPeople('Budi', 'Ani')
    b = billReducer(b, { type: 'removePerson', id: b.people[0].id })
    b = billReducer(b, { type: 'addPerson', name: 'Rina' })
    expect(b.people.find((p) => p.name === 'Rina')?.color).toBe(PALETTE[0])
  })

  it('menghapus orang dari pesanan dan memindahkan pembayar ke orang pertama yang tersisa', () => {
    let b = withPeople('Budi', 'Ani')
    const [budi, ani] = b.people
    b = billReducer(b, { type: 'upsertItem', item: item('x', [budi.id, ani.id]) })
    b = billReducer(b, { type: 'removePerson', id: budi.id })
    expect(b.people).toEqual([ani])
    expect(b.items[0].sharedBy).toEqual([ani.id])
    expect(b.payerId).toBe(ani.id)
  })

  it('mengosongkan pembayar kalau semua orang dihapus', () => {
    let b = withPeople('Budi')
    b = billReducer(b, { type: 'removePerson', id: b.people[0].id })
    expect(b.payerId).toBeNull()
  })

  it('mengembalikan orang yang dihapus ke posisi dan kondisi semula', () => {
    let before = withPeople('Budi', 'Ani')
    before = billReducer(before, { type: 'upsertItem', item: item('x', before.people.map((p) => p.id)) })
    const budi = before.people[0]
    const after = billReducer(before, { type: 'removePerson', id: budi.id })
    const restored = billReducer(after, { type: 'restorePerson', person: budi, index: 0, items: before.items, payerId: before.payerId })
    expect(restored).toEqual(before)
  })

  it('menambah pesanan baru dan mengganti pesanan dengan id yang sama', () => {
    let b = billReducer(emptyBill(), { type: 'upsertItem', item: item('x', []) })
    b = billReducer(b, { type: 'upsertItem', item: { ...item('x', []), name: 'Nasi', qty: 2 } })
    expect(b.items).toEqual([{ ...item('x', []), name: 'Nasi', qty: 2 }])
  })

  it('mengembalikan pesanan yang dihapus ke urutan semula', () => {
    let before = emptyBill()
    for (const id of ['x', 'y', 'z']) before = billReducer(before, { type: 'upsertItem', item: item(id, []) })
    const after = billReducer(before, { type: 'removeItem', id: 'y' })
    expect(after.items.map((i) => i.id)).toEqual(['x', 'z'])
    expect(billReducer(after, { type: 'restoreItem', item: before.items[1], index: 1 })).toEqual(before)
  })

  it('menggabungkan perubahan pajak, judul, dan pembayar', () => {
    let b = billReducer(emptyBill(), { type: 'charges', patch: { taxPct: 11 } })
    b = billReducer(b, { type: 'title', title: 'Makan malam' })
    b = billReducer(b, { type: 'payer', id: 'p1' })
    expect(b.charges).toEqual({ ...emptyBill().charges, taxPct: 11 })
    expect(b.title).toBe('Makan malam')
    expect(b.payerId).toBe('p1')
  })

  it('menyimpan info rekening pembayar dan mengosongkannya saat reset', () => {
    const b = billReducer(emptyBill(), { type: 'paymentInfo', paymentInfo: 'GoPay 081234567890' })
    expect(b.paymentInfo).toBe('GoPay 081234567890')
    expect(billReducer(b, { type: 'reset' }).paymentInfo).toBe('')
  })

  it('mengosongkan tagihan lewat reset dan memulihkannya lewat replace', () => {
    const full = withPeople('Budi', 'Ani')
    const reset = billReducer(full, { type: 'reset' })
    expect(reset).toEqual(emptyBill())
    expect(billReducer(reset, { type: 'replace', bill: full })).toBe(full)
  })
})
