import { describe, expect, it } from 'vitest'
import { emptyBill, type Bill } from './bill'
import { calculate } from './calculate'
import { buildShareText } from './share'

const bill = (patch: Partial<Bill> = {}): Bill => ({
  ...emptyBill(),
  title: 'Makan malam',
  people: [
    { id: 'a', name: 'Budi', color: '#000' },
    { id: 'b', name: 'Ani', color: '#000' },
  ],
  items: [{ id: 'x', name: 'Bakso', price: 20000, qty: 1, sharedBy: ['a', 'b'] }],
  payerId: 'a',
  ...patch,
})
const share = (b: Bill) => buildShareText(b, calculate(b))

describe('buildShareText', () => {
  it('menuliskan total, pembayar, dan tagihan tiap orang', () => {
    expect(share(bill())).toBe(
      [
        '🧾 Makan malam',
        'Total: Rp 23.100 — dibayar Budi',
        '',
        '• Budi (yang bayar): Rp 11.550',
        '• Ani: Rp 11.550',
        '',
        'Service 5% · Pajak 10%',
        'Dihitung pakai SplitBill ✨',
      ].join('\n'),
    )
  })

  it('memakai judul bawaan dan tanpa pembayar kalau belum diisi', () => {
    const text = share(bill({ title: '', payerId: null }))
    expect(text.split('\n').slice(0, 2)).toEqual(['🧾 Split Bill', 'Total: Rp 23.100'])
  })
})
