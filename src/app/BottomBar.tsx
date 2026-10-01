import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { LAST_STEP } from '../domain/steps'
import { AnimatedRupiah, Button } from '../ui'

/** Bar bawah yang selalu terlihat: kembali, total sementara, dan lanjut. */
export function BottomBar({
  step,
  total,
  onBack,
  onNext,
  onEditItems,
}: {
  step: number
  total: number
  onBack: () => void
  onNext: () => void
  onEditItems: () => void
}) {
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
          <p className="text-[11px] font-semibold text-muted">{step === LAST_STEP ? 'Total' : 'Total sementara'}</p>
          <AnimatedRupiah value={total} className="block truncate font-extrabold" />
        </div>
        {step < LAST_STEP ? (
          <Button onClick={onNext}>
            {step === LAST_STEP - 1 ? 'Lihat hasil' : 'Lanjut'} <ArrowRight size={18} />
          </Button>
        ) : (
          <Button variant="soft" onClick={onEditItems}>
            Ubah pesanan
          </Button>
        )}
      </div>
    </footer>
  )
}
