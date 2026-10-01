import confetti from 'canvas-confetti'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { ChargesStep } from './components/ChargesStep'
import { SplitMark } from './components/Illustrations'
import { ItemsStep } from './components/ItemsStep'
import { PeopleStep } from './components/PeopleStep'
import { ResultStep } from './components/ResultStep'
import { AnimatedRupiah, Button } from './components/ui'
import { calculate } from './lib/calc'
import { useBill } from './lib/store'

const STEPS = ['Teman', 'Pesanan', 'Pajak', 'Hasil']

export default function App() {
  const [bill, dispatch] = useBill()
  const [step, setStep] = useState(() => (bill.items.length ? 1 : 0))
  const [dir, setDir] = useState(1)
  const result = useMemo(() => calculate(bill), [bill])

  const go = (to: number) => {
    setDir(to > step ? 1 : -1)
    setStep(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Validasi sebelum lanjut — pesan kesalahan tampil sebagai toast.
  const blocker = (s: number): string | null => {
    if (s >= 1 && bill.people.length < 2) return 'Tambah minimal 2 orang dulu'
    if (s >= 2 && bill.items.length === 0) return 'Tambah minimal 1 pesanan'
    if (s >= 2 && result.unassigned > 0) return `${result.unassigned} pesanan belum ada yang pesan`
    return null
  }

  const next = () => {
    const msg = blocker(step + 1)
    if (msg) return toast.warning(msg)
    go(step + 1)
  }

  useEffect(() => {
    if (step !== 3) return
    const colors = ['#D4F35B', '#7C5CFF', '#FF7A59', '#FFD97D', '#B8E0D2']
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.25 }, colors, disableForReducedMotion: true })
  }, [step])

  const reset = () =>
    toast('Mulai tagihan baru?', {
      description: 'Semua nama & pesanan akan dihapus.',
      action: {
        label: 'Hapus',
        onClick: () => {
          const prev = bill
          dispatch({ type: 'reset' })
          go(0)
          toast.success('Tagihan baru siap', {
            action: { label: 'Urungkan', onClick: () => dispatch({ type: 'replace', bill: prev }) },
          })
        },
      },
    })

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative mx-auto flex min-h-dvh max-w-lg flex-col">
        <header className="sticky top-0 z-20 bg-bg/80 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <SplitMark className="size-10 shrink-0" />
            <input
              value={bill.title}
              onChange={(e) => dispatch({ type: 'title', title: e.target.value })}
              placeholder="Makan di mana nih?"
              className="min-w-0 flex-1 bg-transparent text-lg font-bold tracking-tight outline-none placeholder:text-muted/70"
              aria-label="Nama tagihan"
            />
            <motion.button
              whileTap={{ rotate: -180, scale: 0.9 }}
              onClick={reset}
              className="grid size-10 place-items-center rounded-full bg-surface text-muted"
              aria-label="Tagihan baru"
            >
              <RotateCcw size={17} />
            </motion.button>
          </div>

          <nav className="mt-4 flex gap-1.5 rounded-full bg-surface p-1">
            {STEPS.map((label, i) => (
              <button
                key={label}
                onClick={() => {
                  const msg = blocker(i)
                  if (i > step && msg) return toast.warning(msg)
                  go(i)
                }}
                className="relative flex-1 rounded-full py-2 text-xs font-bold"
              >
                {i === step && (
                  <motion.span
                    layoutId="step-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className={`relative transition-colors ${i === step ? 'text-bg' : i < step ? 'text-ink' : 'text-muted'}`}>
                  {i < step ? '✓ ' : ''}
                  {label}
                </span>
              </button>
            ))}
          </nav>
        </header>

        <main className="relative z-10 flex-1 overflow-x-clip px-5 pt-4 pb-36">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.section
              key={step}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d * 48, opacity: 0, filter: 'blur(4px)' }),
                center: { x: 0, opacity: 1, filter: 'blur(0px)' },
                exit: (d: number) => ({ x: d * -48, opacity: 0, filter: 'blur(4px)' }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <PeopleStep bill={bill} dispatch={dispatch} />}
              {step === 1 && <ItemsStep bill={bill} dispatch={dispatch} />}
              {step === 2 && <ChargesStep bill={bill} result={result} dispatch={dispatch} />}
              {step === 3 && <ResultStep bill={bill} result={result} dispatch={dispatch} />}
            </motion.section>
          </AnimatePresence>
        </main>

        {/* Bar bawah yang selalu terlihat */}
        <footer className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-4 pb-safe">
          <div className="flex items-center gap-2 rounded-[1.8rem] border border-line bg-surface/85 p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,.25)] backdrop-blur-xl">
            <AnimatePresence initial={false}>
              {step > 0 && (
                <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}>
                  <Button variant="soft" onClick={() => go(step - 1)} aria-label="Kembali" className="!px-4">
                    <ArrowLeft size={18} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="min-w-0 flex-1 pl-2">
              <p className="text-[11px] font-semibold text-muted">Total sementara</p>
              <AnimatedRupiah value={result.total} className="block truncate font-extrabold" />
            </div>
            {step < 3 ? (
              <Button onClick={next}>
                {step === 2 ? 'Lihat hasil' : 'Lanjut'} <ArrowRight size={18} />
              </Button>
            ) : (
              <Button variant="soft" onClick={() => go(1)}>
                Ubah pesanan
              </Button>
            )}
          </div>
        </footer>
      </div>

      <Toaster
        position="top-center"
        offset={16}
        toastOptions={{
          classNames: {
            toast: '!rounded-2xl !border-line !bg-surface !text-ink !font-sans !shadow-xl',
            description: '!text-muted',
            actionButton: '!rounded-full !bg-ink !text-bg !font-semibold',
          },
        }}
      />
    </MotionConfig>
  )
}
