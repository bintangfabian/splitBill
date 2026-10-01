import confetti from 'canvas-confetti'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { calculate } from '../domain/calculate'
import { LAST_STEP, stepBlocker } from '../domain/steps'
import { ChargesStep } from '../features/charges/ChargesStep'
import { ItemsStep } from '../features/items/ItemsStep'
import { PeopleStep } from '../features/people/PeopleStep'
import { ResultStep } from '../features/result/ResultStep'
import { useBill } from '../state/useBill'
import { AppToaster } from '../ui'
import { AppHeader } from './AppHeader'
import { BottomBar } from './BottomBar'
import { StepNav } from './StepNav'

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

  // Maju hanya kalau syarat langkahnya terpenuhi; pesan kesalahan tampil sebagai toast.
  const tryGo = (to: number) => {
    const msg = to > step ? stepBlocker(to, bill, result) : null
    if (msg) return toast.warning(msg)
    go(to)
  }

  useEffect(() => {
    if (step !== LAST_STEP) return
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
        <AppHeader title={bill.title} onTitleChange={(title) => dispatch({ type: 'title', title })} onReset={reset}>
          <StepNav step={step} onSelect={tryGo} />
        </AppHeader>

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

        <BottomBar step={step} total={result.total} onBack={() => go(step - 1)} onNext={() => tryGo(step + 1)} onEditItems={() => go(1)} />
      </div>

      <AppToaster />
    </MotionConfig>
  )
}
