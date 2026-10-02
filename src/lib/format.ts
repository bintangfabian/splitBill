const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const plain = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })
// Per grapheme supaya emoji (😎, 🇮🇩, 👨‍👩‍👧) tidak terpotong jadi separuh karakter
const graphemes = new Intl.Segmenter('id', { granularity: 'grapheme' })

export const rupiah = (n: number) => idr.format(Math.round(n)).replace(/\s/g, ' ')
export const thousands = (n: number) => (n ? plain.format(n) : '')
/** Angka dengan pemisah ribuan tanpa "Rp", termasuk nol, mis. untuk kolom harga di struk. */
export const plainAmount = (n: number) => plain.format(Math.round(n))
export const parseNumber = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0

export const initials = (name: string, max = 2) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((w) => [...graphemes.segment(w)][0]?.segment.toUpperCase() ?? '')
    .join('')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

/** Waktu cetak struk dalam jam lokal, mis. "2 Okt 2026 · 06.12". */
export function receiptDate(d: Date) {
  const time = [d.getHours(), d.getMinutes()].map((n) => String(n).padStart(2, '0')).join('.')
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${time}`
}

/** Potongan nama file yang aman dari teks bebas, mis. "Makan Malam!" → "makan-malam". */
export const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
