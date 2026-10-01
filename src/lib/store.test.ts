import { describe, expect, it } from 'vitest'
import { emptyBill, PALETTE, reducer } from './store'
import type { Bill, Item } from './types'

const withPeople = (...names: string[]) => names.reduce<Bill>((b, name) => reducer(b, { type: 'addPerson', name }), emptyBill())
const item = (id: string, sharedBy: string[]): Item => ({ id, name: id, price: 10000, qty: 1, sharedBy })

describe('reducer', () => {
  it('menambah orang dengan nama yang di-trim, warna unik, dan orang pertama jadi pembayar', () => {
    const b = withPeople('  Budi ', 'Ani')
    expect(b.people.map((p) => p.name)).toEqual(['Budi', 'Ani'])
    expect(b.people.map((p) => p.color)).toEqual([PALETTE[0], PALETTE[1]])
    expect(b.payerId).toBe(b.people[0].id)
  })

  it('memakai lagi warna yang sudah tidak terpakai', () => {
    let b = withPeople('Budi', 'Ani')
    b = reducer(b, { type: 'removePerson', id: b.people[0].id })
    b = reducer(b, { type: 'addPerson', name: 'Rina' })
    expect(b.people.find((p) => p.name === 'Rina')?.color).toBe(PALETTE[0])
  })

  it('menghapus orang dari pesanan dan memindahkan pembayar ke orang pertama yang tersisa', () => {
    let b = withPeople('Budi', 'Ani')
    const [budi, ani] = b.people
    b = reducer(b, { type: 'upsertItem', item: item('x', [budi.id, ani.id]) })
    b = reducer(b, { type: 'removePerson', id: budi.id })
    expect(b.people).toEqual([ani])
    expect(b.items[0].sharedBy).toEqual([ani.id])
    expect(b.payerId).toBe(ani.id)
  })

  it('mengosongkan pembayar kalau semua orang dihapus', () => {
    let b = withPeople('Budi')
    b = reducer(b, { type: 'removePerson', id: b.people[0].id })
    expect(b.payerId).toBeNull()
  })

  it('mengembalikan orang yang dihapus ke posisi dan kondisi semula', () => {
    let before = withPeople('Budi', 'Ani')
    before = reducer(before, { type: 'upsertItem', item: item('x', before.people.map((p) => p.id)) })
    const budi = before.people[0]
    const after = reducer(before, { type: 'removePerson', id: budi.id })
    const restored = reducer(after, { type: 'restorePerson', person: budi, index: 0, items: before.items, payerId: before.payerId })
    expect(restored).toEqual(before)
  })

  it('menambah pesanan baru dan mengganti pesanan dengan id yang sama', () => {
    let b = reducer(emptyBill(), { type: 'upsertItem', item: item('x', []) })
    b = reducer(b, { type: 'upsertItem', item: { ...item('x', []), name: 'Nasi', qty: 2 } })
    expect(b.items).toEqual([{ ...item('x', []), name: 'Nasi', qty: 2 }])
  })

  it('mengembalikan pesanan yang dihapus ke urutan semula', () => {
    let before = emptyBill()
    for (const id of ['x', 'y', 'z']) before = reducer(before, { type: 'upsertItem', item: item(id, []) })
    const after = reducer(before, { type: 'removeItem', id: 'y' })
    expect(after.items.map((i) => i.id)).toEqual(['x', 'z'])
    expect(reducer(after, { type: 'restoreItem', item: before.items[1], index: 1 })).toEqual(before)
  })

  it('menggabungkan perubahan pajak, judul, dan pembayar', () => {
    let b = reducer(emptyBill(), { type: 'charges', patch: { taxPct: 11 } })
    b = reducer(b, { type: 'title', title: 'Makan malam' })
    b = reducer(b, { type: 'payer', id: 'p1' })
    expect(b.charges).toEqual({ ...emptyBill().charges, taxPct: 11 })
    expect(b.title).toBe('Makan malam')
    expect(b.payerId).toBe('p1')
  })

  it('mengosongkan tagihan lewat reset dan memulihkannya lewat replace', () => {
    const full = withPeople('Budi', 'Ani')
    const reset = reducer(full, { type: 'reset' })
    expect(reset).toEqual(emptyBill())
    expect(reducer(reset, { type: 'replace', bill: full })).toBe(full)
  })
})
