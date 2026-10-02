/**
 * Pecah teks jadi baris yang muat di `max` piksel menurut `measure`.
 * Baris dipotong di spasi; kata yang lebih panjang dari satu baris dipotong per karakter.
 */
export function wrapText(text: string, max: number, measure: (s: string) => number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word
    if (measure(next) <= max) {
      line = next
      continue
    }
    if (line) lines.push(line)
    line = ''
    // Kata yang tidak muat sendirian dipotong per karakter (emoji dihitung utuh).
    for (const ch of Array.from(word)) {
      if (line && measure(line + ch) > max) {
        lines.push(line)
        line = ''
      }
      line += ch
    }
  }
  if (line) lines.push(line)
  return lines
}
