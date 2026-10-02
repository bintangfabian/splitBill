import { describe, expect, it } from 'vitest'
import { wrapText } from './text'

// Huruf monospace: tiap karakter selebar 1.
const mono = (s: string) => Array.from(s).length

describe('wrapText', () => {
  it('memotong di spasi supaya tiap baris muat', () => {
    expect(wrapText('Kepiting Saus Padang Spesial', 14, mono)).toEqual(['Kepiting Saus', 'Padang Spesial'])
  })

  it('membiarkan teks pendek tetap satu baris dan merapikan spasi berlebih', () => {
    expect(wrapText('  Es   Teh  ', 14, mono)).toEqual(['Es Teh'])
    expect(wrapText('', 14, mono)).toEqual([])
  })

  it('memotong paksa kata yang lebih panjang dari satu baris', () => {
    expect(wrapText('BCA 12345678901234 a.n. Budi', 8, mono)).toEqual(['BCA', '12345678', '901234', 'a.n.', 'Budi'])
  })

  it('tidak membelah emoji', () => {
    expect(wrapText('😎😎😎', 2, mono)).toEqual(['😎😎', '😎'])
  })
})
