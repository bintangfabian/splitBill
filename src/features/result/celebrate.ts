import confetti from 'canvas-confetti'

const COLORS = ['#D4F35B', '#7C5CFF', '#FF7A59', '#FFD97D', '#B8E0D2']

export function celebrate() {
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.25 }, colors: COLORS, disableForReducedMotion: true })
}
