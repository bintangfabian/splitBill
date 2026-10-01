import { describe, expect, it } from 'vitest'
import { emptyBill, type Bill } from '../domain/bill'
import { loadBill, saveBill } from './storage'

function memoryStorage(initial: string | null = null) {
  let value = initial
  return {
    getItem: () => value,
    setItem: (_key: string, v: string) => {
      value = v
    },
    get value() {
      return value
    },
  }
}
const broken = {
  getItem: (): string | null => {
    throw new Error('akses ditolak')
  },
  setItem: () => {
    throw new Error('penyimpanan penuh')
  },
}

describe('loadBill', () => {
  it('mengembalikan tagihan kosong kalau belum ada data', () => {
    expect(loadBill(memoryStorage())).toEqual(emptyBill())
  })

  it('membaca tagihan yang tersimpan', () => {
    const saved: Bill = { ...emptyBill(), title: 'Makan malam', payerId: 'a' }
    expect(loadBill(memoryStorage(JSON.stringify(saved)))).toEqual(saved)
  })

  it('melengkapi field charges yang belum ada di data lama', () => {
    const old = { ...emptyBill(), title: 'Lama', charges: { servicePct: 0, taxPct: 11 } }
    expect(loadBill(memoryStorage(JSON.stringify(old))).charges).toEqual({ ...emptyBill().charges, servicePct: 0, taxPct: 11 })
  })

  it('mengisi info rekening kosong untuk data yang disimpan sebelum fitur itu ada', () => {
    const { paymentInfo: _, ...old } = { ...emptyBill(), title: 'Lama' }
    expect(loadBill(memoryStorage(JSON.stringify(old))).paymentInfo).toBe('')
  })

  it('mengembalikan tagihan kosong kalau data rusak atau storage tidak bisa diakses', () => {
    expect(loadBill(memoryStorage('{bukan json'))).toEqual(emptyBill())
    expect(loadBill(broken)).toEqual(emptyBill())
  })
})

describe('saveBill', () => {
  it('menyimpan tagihan sebagai JSON', () => {
    const store = memoryStorage()
    const bill = { ...emptyBill(), title: 'Ngopi' }
    saveBill(bill, store)
    expect(store.value).toBe(JSON.stringify(bill))
  })

  it('tidak melempar error kalau storage penuh', () => {
    expect(() => saveBill(emptyBill(), broken)).not.toThrow()
  })
})
