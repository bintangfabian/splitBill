import { describe, expect, it } from 'vitest'
import { uid } from './id'

describe('uid', () => {
  it('membuat id 8 karakter yang berbeda tiap panggilan', () => {
    const a = uid()
    expect(a).toMatch(/^[a-z0-9]{8}$/)
    expect(uid()).not.toBe(a)
  })
})
