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

  it('menyebut diskon dan biaya lain yang dipakai', () => {
    const text = share(bill({ charges: { ...emptyBill().charges, discount: 10, discountType: 'pct', extraFee: 12000 } }))
    expect(text).toContain('Service 5% · Pajak 10% · Diskon 10% · Biaya lain Rp 12.000')
    const nominal = share(bill({ charges: { ...emptyBill().charges, discount: 5000 } }))
    expect(nominal).toContain('Service 5% · Pajak 10% · Diskon Rp 5.000')
  })

  it('menulis rekening atau e-wallet pembayar di bawah total', () => {
    const lines = share(bill({ paymentInfo: '  BCA 1234567890 a.n. Budi ' })).split('\n')
    expect(lines.slice(1, 3)).toEqual(['Total: Rp 23.100 — dibayar Budi', 'Transfer ke: BCA 1234567890 a.n. Budi'])
  })

  it('tidak menulis baris transfer kalau info kosong atau belum ada pembayar', () => {
    expect(share(bill({ paymentInfo: '   ' }))).not.toContain('Transfer ke')
    expect(share(bill({ paymentInfo: 'BCA 123', payerId: null }))).not.toContain('Transfer ke')
  })

  it('tidak menulis baris biaya kalau tanpa service, pajak, diskon, dan biaya lain', () => {
    const text = share(bill({ charges: { ...emptyBill().charges, servicePct: 0, taxPct: 0 } }))
    expect(text).not.toContain('Service')
    expect(text).not.toContain('Pajak')
    expect(text.endsWith('• Ani: Rp 10.000\n\nDihitung pakai SplitBill ✨')).toBe(true)
  })
})
