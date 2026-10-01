export type Person = { id: string; name: string; color: string }

export type Item = {
  id: string
  name: string
  price: number // harga satuan
  qty: number
  sharedBy: string[] // id orang yang ikut menanggung item ini
}

export type Charges = {
  servicePct: number
  taxPct: number
  taxAfterService: boolean // pajak dihitung dari subtotal + service
  discount: number
  discountType: 'amount' | 'pct'
  extraFee: number // ongkir / biaya lain, dibagi rata
  roundTo: number // kelipatan pembulatan tagihan per orang: 1 (tanpa pembulatan), 100, 500, 1000
}

export type Bill = {
  title: string
  people: Person[]
  items: Item[]
  charges: Charges
  payerId: string | null
  paymentInfo: string // rekening / e-wallet si pembayar, ikut di teks bagikan
}

export const emptyBill = (): Bill => ({
  title: '',
  people: [],
  items: [],
  charges: { servicePct: 5, taxPct: 10, taxAfterService: true, discount: 0, discountType: 'amount', extraFee: 0, roundTo: 1 },
  payerId: null,
  paymentInfo: '',
})
