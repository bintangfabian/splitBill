import type { Receipt } from '../../domain/receipt'
import { plainAmount, rupiah, slugify } from '../../lib/format'
import { wrapText } from '../../lib/text'
import { LOGO } from '../../ui'

// Ukuran dalam piksel logis; kanvasnya digambar 3× supaya tajam di layar HP dan saat dibagikan.
const W = 260
const PAD = 16
const INNER = W - PAD * 2
const ZIG = 7
const TOOTH = 10
const MARGIN = 28

const INK = '#1d1d1b'
const MUTED = '#6f6d66'
const RULE = '#bdbab0'
const PAPER = '#fffefa'
const LIME = '#d4f35b'
const LAVENDER = '#c3b1e1'
// Warna kotak dan wajah logo, sama persis dengan ikon aplikasi.
const LOGO_INK = '#141414'
const LOGO_SIZE = 34

const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Roboto Mono", "Liberation Mono", monospace'
const SERIF = '"Instrument Serif", Georgia, serif'
const mono = (size: number, weight = 400) => `${weight} ${size}px ${MONO}`
const serif = (size: number) => `italic 400 ${size}px ${SERIF}`

type Draw = (ctx: CanvasRenderingContext2D) => void

/**
 * Susun isi struk dari atas ke bawah. Setiap baris dicatat sebagai perintah gambar,
 * jadi tinggi kertas sudah diketahui sebelum kanvas aslinya dibuat.
 */
function layout(r: Receipt, measure: CanvasRenderingContext2D) {
  const ops: Draw[] = []
  let y = ZIG + 20

  const textWidth = (s: string, font: string) => {
    measure.font = font
    return measure.measureText(s).width
  }
  const lines = (s: string, font: string, max = INNER) => wrapText(s, max, (t) => textWidth(t, font))
  const text = (s: string, x: number, at: number, font: string, color = INK, align: CanvasTextAlign = 'left') =>
    ops.push((ctx) => {
      ctx.font = font
      ctx.fillStyle = color
      ctx.textAlign = align
      ctx.textBaseline = 'middle'
      ctx.fillText(s, x, at)
    })
  const centered = (s: string, font: string, lineHeight: number, color = INK) => {
    for (const l of lines(s, font)) {
      text(l, W / 2, y + lineHeight / 2, font, color, 'center')
      y += lineHeight
    }
  }
  const dashed = (gap = 12) => {
    const at = y + gap
    ops.push((ctx) => {
      ctx.save()
      ctx.strokeStyle = RULE
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(PAD, at)
      ctx.lineTo(W - PAD, at)
      ctx.stroke()
      ctx.restore()
    })
    y = at + gap
  }
  /** Label di kiri (boleh beberapa baris) dan angka rata kanan di baris pertama. */
  const row = (label: string, value: string, font = mono(11.5), color = INK, lineHeight = 17) => {
    const room = INNER - textWidth(value, font) - 12
    const wrapped = lines(label, font, room)
    wrapped.forEach((l, i) => text(l, PAD, y + lineHeight / 2 + i * lineHeight, font, color))
    text(value, W - PAD, y + lineHeight / 2, font, color, 'right')
    y += Math.max(1, wrapped.length) * lineHeight
  }
  const caption = (s: string) => {
    text(s.toUpperCase().split('').join(' '), PAD, y + 6, mono(9, 600), MUTED)
    y += 18
  }

  // Kepala struk: logo Tookthel, nama "toko", judul tagihan, dan waktu cetak.
  const logoAt = y
  ops.push((ctx) => {
    ctx.save()
    ctx.translate(W / 2 - LOGO_SIZE / 2, logoAt)
    ctx.scale(LOGO_SIZE / 512, LOGO_SIZE / 512)
    for (const [d, color] of [
      [LOGO.tile, LOGO_INK],
      [LOGO.receipt, LIME],
    ]) {
      ctx.fillStyle = color
      // eslint-disable-next-line unicorn/no-array-fill-with-reference-type -- fill() kanvas dengan Path2D, bukan Array.fill
      ctx.fill(new Path2D(d))
    }
    ctx.fillStyle = LOGO_INK
    for (const [cx, cy] of LOGO.eyes) {
      ctx.beginPath()
      ctx.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = LOGO_INK
    ctx.lineCap = 'round'
    ctx.lineWidth = 16
    ctx.stroke(new Path2D(LOGO.smile))
    ctx.lineCap = 'butt'
    ctx.lineWidth = 10
    ctx.globalAlpha = 0.35
    ctx.setLineDash([14, 14])
    ctx.stroke(new Path2D(LOGO.cut))
    ctx.restore()
  })
  y += LOGO_SIZE + 6
  centered('T O O K T H E L', mono(9.5, 700), 14, MUTED)
  y += 6
  centered(r.title, serif(27), 29)
  y += 2
  centered(`${r.printedAt} · ${r.people.length} orang`, mono(9.5), 14, MUTED)

  dashed(14)
  for (const item of r.items) {
    row(item.name, plainAmount(item.amount))
    if (item.qty > 1) {
      text(`  ${item.qty} x ${plainAmount(item.price)}`, PAD, y + 7, mono(10), MUTED)
      y += 15
    }
    y += 3
  }

  dashed(10)
  row('Subtotal', plainAmount(r.subtotal))
  for (const c of r.charges) row(c.label, c.amount < 0 ? `-${plainAmount(-c.amount)}` : plainAmount(c.amount), mono(11.5), MUTED)

  // TOTAL dengan coretan stabilo lime, sedikit miring seperti ditandai tangan.
  y += 10
  const totalAt = y
  ops.push((ctx) => {
    ctx.save()
    ctx.translate(W / 2, totalAt + 12)
    for (const [angle, alpha] of [
      [-0.018, 0.75],
      [-0.006, 0.55],
    ]) {
      ctx.save()
      ctx.rotate(angle)
      ctx.globalAlpha = alpha
      ctx.fillStyle = LIME
      ctx.beginPath()
      // roundRect belum ada di Safari < 16; kotak biasa juga cukup sebagai stabilo.
      if (ctx.roundRect) ctx.roundRect(-INNER / 2 - 5, -11, INNER + 10, 22, 5)
      else ctx.rect(-INNER / 2 - 5, -11, INNER + 10, 22)
      ctx.fill()
      ctx.restore()
    }
    ctx.restore()
  })
  text('TOTAL', PAD, totalAt + 12, mono(13, 700))
  text(rupiah(r.total), W - PAD, totalAt + 12, mono(14, 700), INK, 'right')
  y += 24

  dashed(14)
  caption('Patungan')
  for (const p of r.people) row(p.isPayer ? `${p.name} (tumbal)` : p.name, rupiah(p.amount), mono(11.5, p.isPayer ? 400 : 600))
  if (r.roundingNote) {
    y += 4
    for (const l of lines(r.roundingNote, mono(9.5))) {
      text(l, PAD, y + 7, mono(9.5), MUTED)
      y += 14
    }
  }

  if (r.payerName) {
    dashed(14)
    caption('Transfer ke')
    for (const l of lines(r.payerName, mono(12, 700))) {
      text(l, PAD, y + 9, mono(12, 700))
      y += 18
    }
    for (const l of lines(r.paymentInfo || '(rekening belum diisi)', mono(11.5))) {
      text(l, PAD, y + 8, mono(11.5), r.paymentInfo ? INK : MUTED)
      y += 17
    }
  }

  dashed(14)
  y += 2
  centered('Makasih udah patungan!', serif(21), 24)
  centered('dihitung pakai Tookthel', mono(9.5), 14, MUTED)
  y += 20 + ZIG

  return { ops, height: Math.ceil(y) }
}

/** Kertas struk bergerigi di atas dan bawah. */
function paperPath(ctx: CanvasRenderingContext2D, height: number) {
  ctx.beginPath()
  ctx.moveTo(0, ZIG)
  for (let x = 0; x < W; x += TOOTH) {
    ctx.lineTo(x + TOOTH / 2, 0)
    ctx.lineTo(x + TOOTH, ZIG)
  }
  ctx.lineTo(W, height - ZIG)
  for (let x = W; x > 0; x -= TOOTH) {
    ctx.lineTo(x - TOOTH / 2, height)
    ctx.lineTo(x - TOOTH, height - ZIG)
  }
  ctx.closePath()
}

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Gagal membuat gambar'))), 'image/png'))

/** Skala 3×, diturunkan untuk struk yang sangat panjang supaya tidak melewati batas kanvas Safari. */
const scaleFor = (w: number, h: number) => Math.max(1, Math.min(3, Math.sqrt(14_000_000 / (w * h))))

export type ReceiptImages = {
  /** Kertas saja (latar transparan) untuk animasi keluar dari printer. */
  paper: Blob
  /** Kertas di atas latar lavender untuk dibagikan. */
  share: File
  /** Perbandingan tinggi : lebar kertas. */
  ratio: number
}

export async function renderReceiptImages(r: Receipt): Promise<ReceiptImages> {
  // Kanvas tidak menunggu font web, jadi pastikan Instrument Serif miring sudah dimuat (kalau gagal, pakai Georgia).
  await document.fonts?.load(serif(27)).catch(() => undefined)

  const measure = document.createElement('canvas').getContext('2d')!
  const { ops, height } = layout(r, measure)

  const s = scaleFor(W + MARGIN * 2, height + MARGIN * 2)
  const paper = document.createElement('canvas')
  paper.width = Math.round(W * s)
  paper.height = Math.round(height * s)
  const p = paper.getContext('2d')!
  p.scale(s, s)
  paperPath(p, height)
  p.fillStyle = PAPER
  p.fill()
  for (const op of ops) op(p)

  // Versi bagikan: kertas di atas kartu lavender dengan bintang dan titik warna seperti ilustrasi Tookthel.
  const cw = W + MARGIN * 2
  const ch = height + MARGIN * 2
  const card = document.createElement('canvas')
  card.width = Math.round(cw * s)
  card.height = Math.round(ch * s)
  const c = card.getContext('2d')!
  c.scale(s, s)
  c.fillStyle = LAVENDER
  c.fillRect(0, 0, cw, ch)
  c.save()
  c.shadowColor = 'rgba(20, 20, 20, 0.22)'
  c.shadowBlur = 18
  c.shadowOffsetY = 8
  c.drawImage(paper, MARGIN, MARGIN, W, height)
  c.restore()
  c.lineWidth = 1.6
  c.strokeStyle = INK
  c.lineJoin = 'round'
  const star = new Path2D('M14 4l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z')
  c.fillStyle = LIME
  // eslint-disable-next-line unicorn/no-array-fill-with-reference-type -- fill() kanvas dengan Path2D, bukan Array.fill
  c.fill(star)
  c.stroke(star)
  for (const [x, y, fill] of [
    [cw - 14, 16, '#FF7A59'],
    [12, ch - 40, '#FFD97D'],
    [cw - 13, ch - 70, '#B8E0D2'],
  ] as const) {
    c.beginPath()
    c.arc(x, y, 4, 0, Math.PI * 2)
    c.fillStyle = fill
    c.fill()
    c.stroke()
  }

  const [paperBlob, shareBlob] = await Promise.all([toBlob(paper), toBlob(card)])
  const name = `struk-${slugify(r.title) || 'patungan'}.png`
  return { paper: paperBlob, share: new File([shareBlob], name, { type: 'image/png' }), ratio: height / W }
}
