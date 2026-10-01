const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const plain = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

export const rupiah = (n: number) => idr.format(Math.round(n)).replace(/\s/g, ' ')
export const thousands = (n: number) => (n ? plain.format(n) : '')
export const parseNumber = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

export const uid = () => Math.random().toString(36).slice(2, 10)
