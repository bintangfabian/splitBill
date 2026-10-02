import { describe, expect, it } from 'vitest'
import { emptyBill, payerOf } from './bill'

describe('payerOf', () => {
  const people = [
    { id: 'a', name: 'Budi', color: '#000' },
    { id: 'b', name: 'Ani', color: '#000' },
  ]

  it('mengembalikan orang yang bayar duluan', () => {
    expect(payerOf({ ...emptyBill(), people, payerId: 'b' })?.name).toBe('Ani')
  })

  it('kosong kalau belum dipilih atau orangnya sudah dihapus', () => {
    expect(payerOf({ ...emptyBill(), people, payerId: null })).toBeUndefined()
    expect(payerOf({ ...emptyBill(), people, payerId: 'x' })).toBeUndefined()
  })
})
