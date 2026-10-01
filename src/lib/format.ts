const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const plain = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })
// Per grapheme supaya emoji (😎, 🇮🇩, 👨‍👩‍👧) tidak terpotong jadi separuh karakter
const graphemes = new Intl.Segmenter('id', { granularity: 'grapheme' })

export const rupiah = (n: number) => idr.format(Math.round(n)).replace(/\s/g, ' ')
export const thousands = (n: number) => (n ? plain.format(n) : '')
export const parseNumber = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => [...graphemes.segment(w)][0]?.segment.toUpperCase() ?? '')
    .join('')
