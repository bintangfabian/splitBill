import { describe, expect, it } from 'vitest'
import { initials, parseNumber, rupiah, thousands } from './format'

describe('rupiah', () => {
  it('memformat ke rupiah tanpa desimal dan membulatkan', () => {
    expect(rupiah(15000)).toBe('Rp 15.000')
    expect(rupiah(1234.5)).toBe('Rp 1.235')
    expect(rupiah(0)).toBe('Rp 0')
    expect(rupiah(-5000)).toBe('-Rp 5.000')
  })
})

describe('thousands', () => {
  it('memberi pemisah ribuan dan mengosongkan nol', () => {
    expect(thousands(1500000)).toBe('1.500.000')
    expect(thousands(0)).toBe('')
  })
})

describe('parseNumber', () => {
  it('mengambil digit saja', () => {
    expect(parseNumber('Rp 1.500.000')).toBe(1500000)
    expect(parseNumber('12a3')).toBe(123)
  })

  it('mengembalikan 0 untuk input tanpa angka', () => {
    expect(parseNumber('')).toBe(0)
    expect(parseNumber('abc')).toBe(0)
  })
})

describe('initials', () => {
  it('mengambil huruf pertama dari maksimal dua kata', () => {
    expect(initials('Budi Santoso')).toBe('BS')
    expect(initials('budi')).toBe('B')
    expect(initials('Muhammad Haikal Faruq')).toBe('MH')
    expect(initials('   ')).toBe('')
  })

  it('bisa dibatasi satu huruf untuk avatar kecil', () => {
    expect(initials('Budi Santoso', 1)).toBe('B')
    expect(initials('Ani 😎', 1)).toBe('A')
  })

  it('tidak memotong emoji jadi separuh karakter', () => {
    expect(initials('Ani 😎')).toBe('A😎')
    expect(initials('Rina 🇮🇩')).toBe('R🇮🇩')
    expect(initials('👨‍👩‍👧 Keluarga')).toBe('👨‍👩‍👧K')
  })
})
