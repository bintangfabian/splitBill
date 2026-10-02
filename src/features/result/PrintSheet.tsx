import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Copy, Download, Share2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { Bill } from '../../domain/bill'
import type { BillResult } from '../../domain/calculate'
import { buildReceipt, type Receipt } from '../../domain/receipt'
import { buildShareText } from '../../domain/share'
import { rupiah } from '../../lib/format'
import { Button, Printer } from '../../ui'
import { Sheet } from '../../ui/Sheet'
import { renderReceiptImages, type ReceiptImages } from './receiptImage'
import { copyText, downloadFile, shareReceipt } from './shareReceipt'

type Phase = 'idle' | 'printing' | 'done'

const LCD: Record<Phase | 'loading', string> = {
  loading: 'MEMUAT...',
  idle: 'SIAP CETAK ▸',
  printing: 'MENCETAK...',
  done: 'BERES ^_^',
}

const STATUS: Record<Phase | 'loading', string> = {
  loading: 'Menyiapkan struk.',
  idle: 'Struk siap dicetak. Tekan tombol Cetak struk.',
  printing: 'Mencetak struk.',
  done: 'Struk selesai dicetak dan siap dibagikan.',
}

/** Gambar struk dibuat sekali saat halaman dibuka; URL-nya dilepas saat halaman ditutup. */
function useReceiptImages(receipt: Receipt) {
  const [state, setState] = useState<{ images: ReceiptImages; paperUrl: string } | null>(null)
  useEffect(() => {
    let alive = true
    let url = ''
    renderReceiptImages(receipt)
      .then((images) => {
        if (!alive) return
        url = URL.createObjectURL(images.paper)
        setState({ images, paperUrl: url })
      })
      .catch(() => toast.error('Gagal membuat gambar struk', { position: 'top-center' }))
    return () => {
      alive = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [receipt])
  return state
}

function PrintReceipt({ bill, result }: { bill: Bill; result: BillResult }) {
  const reduceMotion = useReducedMotion()
  const [printedAt] = useState(() => new Date())
  const receipt = useMemo(() => buildReceipt(bill, result, printedAt), [bill, result, printedAt])
  const text = useMemo(() => buildShareText(bill, result), [bill, result])
  const ready = useReceiptImages(receipt)
  const [phase, setPhase] = useState<Phase>('idle')
  const state = ready ? phase : 'loading'

  // Kertas panjang keluar lebih lama, seperti printer kasir sungguhan.
  const duration = ready ? Math.min(3.2, Math.max(1.4, 0.8 + ready.images.ratio * 0.9)) : 0
  const payer = receipt.payerName ? `, ${receipt.payerName} jadi tumbal yang bayarin dulu` : ''

  return (
    <div className="flex min-h-[72dvh] flex-col">
      <p className="mb-6 text-sm text-muted">Cetak dulu struknya, lalu bagikan gambar dan rinciannya ke grup.</p>

      <Printer
        message={LCD[state]}
        typing={state === 'printing' || state === 'done'}
        busy={state === 'printing'}
        disabled={state !== 'idle'}
        onPrint={() => setPhase(reduceMotion ? 'done' : 'printing')}
      >
        {ready && (
          <motion.div
            initial={false}
            // Saat siap, ujung kertas sudah nongol sedikit dari celah seperti printer kasir.
            animate={{ height: phase === 'idle' ? 22 : 'auto' }}
            transition={phase === 'printing' ? { duration, ease: 'linear' } : { duration: 0 }}
            onAnimationComplete={() => setPhase((p) => (p === 'printing' ? 'done' : p))}
            // Kertas menempel di bawah wadah, jadi ujung bawahnya keluar dulu dari celah.
            className={`flex flex-col justify-end ${phase === 'done' ? 'overflow-visible' : 'overflow-hidden'}`}
          >
            <motion.img
              src={ready.paperUrl}
              alt={`Struk ${receipt.title}: total ${rupiah(receipt.total)}${payer}, ${receipt.people.length} orang.`}
              animate={{ rotate: phase === 'done' ? -1.2 : 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              style={{ originY: 0 }}
              className="block w-full drop-shadow-[0_10px_12px_rgba(0,0,0,.16)]"
            />
          </motion.div>
        )}
      </Printer>
      <p className="sr-only" aria-live="polite">
        {STATUS[state]}
      </p>

      <div className="flex-1" />
      {/* Bar tombol ditarik sampai dasar sheet (melewati padding pb-safe) supaya kertas tidak mengintip di bawahnya. */}
      <AnimatePresence>
        {phase === 'done' && ready && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky -bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 -mx-6 mt-6 -mb-[max(1rem,env(safe-area-inset-bottom))] bg-linear-to-t from-surface from-75% to-transparent px-6 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <Button className="w-full" onClick={() => shareReceipt(ready.images.share, text)}>
              <Share2 size={18} /> Bagikan struk
            </Button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {/* Di layar < 360 px ikonnya disembunyikan supaya label tetap satu baris. */}
              <Button variant="soft" className="!px-3 text-sm whitespace-nowrap" onClick={() => downloadFile(ready.images.share)}>
                <Download size={16} className="max-[359px]:hidden" /> Simpan gambar
              </Button>
              <Button variant="soft" className="!px-3 text-sm whitespace-nowrap" onClick={() => void copyText(text)}>
                <Copy size={16} className="max-[359px]:hidden" /> Salin teks
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Halaman bagikan: struk dicetak dari printer, lalu gambar dan teksnya dibagikan. */
export default function PrintSheet({
  open,
  onOpenChange,
  bill,
  result,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill: Bill
  result: BillResult
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Struk patungan">
      <PrintReceipt bill={bill} result={result} />
    </Sheet>
  )
}
