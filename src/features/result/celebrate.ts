const COLORS = ['#D4F35B', '#7C5CFF', '#FF7A59', '#FFD97D', '#B8E0D2']

/** Confetti dimuat saat pertama kali dibutuhkan, bukan saat aplikasi dibuka. */
export async function celebrate() {
  const { default: confetti } = await import('canvas-confetti')
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.25 }, colors: COLORS, disableForReducedMotion: true })
}
