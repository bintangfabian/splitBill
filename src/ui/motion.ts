/**
 * Token motion. Lihat DESIGN.md: motion hanya untuk umpan balik, kesinambungan,
 * dan satu momen utama (struk tercetak). Jangan menulis nilai ini langsung di komponen.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1],
} as const

export const duration = {
  /** umpan balik langsung: tekan tombol, toggle */
  fast: 0.15,
  /** perubahan state rutin: pindah langkah, item masuk/keluar */
  base: 0.2,
  /** angka total berubah */
  number: 0.35,
  /** momen utama: struk tercetak */
  print: 0.6,
} as const

export const spring = {
  /** kontrol kecil: pill langkah aktif, segmented, toggle */
  snappy: { type: 'spring', stiffness: 520, damping: 42 },
  /** item daftar bergeser saat ada yang masuk/keluar */
  list: { type: 'spring', stiffness: 420, damping: 38 },
} as const

export const press = { scale: 0.97 } as const
