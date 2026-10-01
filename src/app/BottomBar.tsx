import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-react'
import { LAST_STEP } from '../domain/steps'
import { AnimatedRupiah, Button } from '../ui'

const CHARGES_STEP = 2

/** Bar bawah yang selalu terlihat: kembali, jumlah sementara, dan aksi utama langkah ini. */
export function BottomBar({
  step,
  subtotal,
  total,
  onBack,
  onNext,
  onShare,
}: {
  step: number
  subtotal: number
  total: number
  onBack: () => void
  onNext: () => void
  onShare: () => void
}) {
  // Sebelum langkah Pajak, pajak & service belum diatur, jadi yang ditampilkan subtotal pesanan.
  const showTotal = step >= CHARGES_STEP

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-4 pb-safe">
      <div className="flex items-center gap-2 rounded-[1.8rem] border border-line bg-surface/85 p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,.25)] backdrop-blur-xl">
        <AnimatePresence initial={false}>
          {step > 0 && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}>
              <Button variant="soft" onClick={onBack} aria-label="Kembali" className="!px-4">
                <ArrowLeft size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="min-w-0 flex-1 pl-2">
          <p className="text-[11px] font-semibold text-muted">{showTotal ? 'Total' : 'Subtotal'}</p>
          <AnimatedRupiah
            value={showTotal ? total : subtotal}
            className="block text-[clamp(14px,4.4vw,16px)] font-extrabold whitespace-nowrap"
          />
        </div>
        {step === LAST_STEP ? (
          <Button onClick={onShare} className="shrink-0 !px-4">
            {/* Di layar sangat sempit cukup ikon share, supaya total tidak terpotong. */}
            <Share2 size={18} /> <span className="max-[359px]:sr-only">Bagikan</span>
          </Button>
        ) : (
          <Button onClick={onNext} className="shrink-0 !px-4">
            {step === LAST_STEP - 1 ? (
              <>
                <span className="max-[359px]:hidden">Lihat hasil</span>
                <span className="min-[360px]:hidden">Hasil</span>
              </>
            ) : (
              'Lanjut'
            )}
            <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </footer>
  )
}
