import { motion } from 'motion/react'
import { Printer as PrinterIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** Teks layar LCD; kalau `typing`, hurufnya muncul satu per satu seperti printer kasir. */
function LcdText({ text, typing }: { text: string; typing?: boolean }) {
  return (
    <span key={text} className="flex truncate whitespace-pre">
      {Array.from(text).map((ch, i) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key -- urutan huruf tetap selama teksnya sama
          key={i}
          initial={typing ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.01 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * Printer struk bergaya Tookthel: badan gelap seperti kartu total, layar LCD lime,
 * dan tombol cetak. `children` adalah kertas yang keluar dari celah di bawahnya.
 */
export function Printer({
  message,
  typing,
  busy,
  onPrint,
  disabled,
  children,
}: {
  message: string
  typing?: boolean
  /** Sedang mencetak: badan bergetar halus, tombol tertekan, lampu mint berkedip. */
  busy?: boolean
  onPrint: () => void
  disabled?: boolean
  children?: ReactNode
}) {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <motion.div
        animate={busy ? { x: [0, -0.6, 0.6, 0] } : { x: 0 }}
        transition={busy ? { duration: 0.16, repeat: Infinity } : { duration: 0 }}
        className="relative z-10 rounded-[1.6rem] bg-charcoal px-4 pt-4 pb-8 shadow-[0_18px_30px_-18px_rgba(0,0,0,.65)] ring-1 ring-white/10 dark:bg-[#2a2a27]"
      >
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex h-11 min-w-0 flex-1 items-center rounded-xl bg-black px-3 font-mono text-[11px] font-semibold tracking-[0.16em] text-lime shadow-[inset_0_2px_6px_rgba(0,0,0,.9)] [text-shadow:0_0_6px_rgba(212,243,91,.45)]"
          >
            <LcdText text={message} typing={typing} />
          </div>
          <div aria-hidden className="flex flex-col gap-1.5">
            <span className="size-1.5 rounded-full bg-coral" />
            <motion.span
              className="size-1.5 rounded-full bg-mint"
              animate={{ opacity: busy ? [1, 0.25, 1] : 1 }}
              transition={busy ? { duration: 0.5, repeat: Infinity } : { duration: 0 }}
            />
            <span className="size-1.5 rounded-full bg-butter" />
          </div>
          <div className="relative shrink-0">
            {/* Denyut halus selama tombol belum ditekan, sebagai petunjuk di mana harus mencetak. */}
            {!disabled && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-lime"
                animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <motion.button
              type="button"
              onClick={onPrint}
              disabled={disabled}
              aria-label="Cetak struk"
              whileTap={{ y: 2 }}
              animate={{ y: busy ? 2 : 0 }}
              className="relative grid size-12 place-items-center rounded-full bg-lime text-charcoal shadow-[inset_0_-3px_0_rgba(0,0,0,.28)] disabled:shadow-none"
            >
              <PrinterIcon size={20} strokeWidth={2.25} />
            </motion.button>
          </div>
        </div>
        {/* Celah kertas */}
        <div
          aria-hidden
          className="absolute inset-x-6 bottom-3.5 h-1.5 rounded-full bg-black shadow-[inset_0_1px_2px_rgba(0,0,0,.9),0_1px_0_rgba(255,255,255,.08)]"
        />
      </motion.div>
      {/* Kertas digambar di atas bibir printer, mulai dari tengah celah, supaya terlihat keluar dari celah. */}
      {children && <div className="relative z-20 mx-auto -mt-[17px] w-[calc(100%-60px)]">{children}</div>}
    </div>
  )
}
