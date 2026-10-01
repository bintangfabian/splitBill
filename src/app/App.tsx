import { AnimatePresence, motion, MotionConfig, type Variants } from 'motion/react'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { calculate, itemsSubtotal } from '../domain/calculate'
import { stepBlocker } from '../domain/steps'
import { ChargesStep } from '../features/charges/ChargesStep'
import { ItemsStep } from '../features/items/ItemsStep'
import { PeopleStep } from '../features/people/PeopleStep'
import { ResultStep } from '../features/result/ResultStep'
import { shareBill } from '../features/result/shareBill'
import { useBill } from '../state/useBill'
import { AppToaster } from '../ui'
import { duration, ease } from '../ui/motion'
import { AppHeader } from './AppHeader'
import { BottomBar } from './BottomBar'
import { StepNav } from './StepNav'
import { useStepper } from './useStepper'

// Langkah lama dan baru beranimasi bersamaan (popLayout), jadi konten baru langsung muncul.
const stepVariants: Variants = {
  enter: (d: number) => ({ x: d * 16, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -16, opacity: 0 }),
}

export default function App() {
  const [bill, dispatch] = useBill()
  const { step, dir, go } = useStepper(bill.items.length ? 1 : 0)
  const result = useMemo(() => calculate(bill), [bill])

  // Maju hanya kalau syarat langkahnya terpenuhi; pesan kesalahan tampil sebagai toast.
  const tryGo = (to: number) => {
    const msg = to > step ? stepBlocker(to, bill, result) : null
    if (msg) return toast.warning(msg)
    go(to)
  }

  const isEmpty = !bill.title && bill.people.length === 0 && bill.items.length === 0

  // Langsung dikosongkan tanpa konfirmasi; salah pencet cukup diurungkan dari toast.
  const reset = () => {
    const prev = { bill, step }
    dispatch({ type: 'reset' })
    go(0)
    toast('Tagihan dikosongkan', {
      duration: 6000,
      action: {
        label: 'Urungkan',
        onClick: () => {
          dispatch({ type: 'replace', bill: prev.bill })
          go(prev.step)
        },
      },
    })
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col">
        <AppHeader
          title={bill.title}
          onTitleChange={(title) => dispatch({ type: 'title', title })}
          onReset={reset}
          canReset={!isEmpty}
        >
          <StepNav step={step} onSelect={tryGo} />
        </AppHeader>

        <main className="relative flex-1 overflow-x-clip px-5 pt-3 pb-36">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.section
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: duration.base, ease: ease.out }}
            >
              {step === 0 && <PeopleStep bill={bill} dispatch={dispatch} />}
              {step === 1 && <ItemsStep bill={bill} dispatch={dispatch} />}
              {step === 2 && <ChargesStep bill={bill} result={result} dispatch={dispatch} />}
              {step === 3 && <ResultStep bill={bill} result={result} dispatch={dispatch} />}
            </motion.section>
          </AnimatePresence>
        </main>

        <BottomBar
          step={step}
          subtotal={itemsSubtotal(bill.items)}
          total={result.total}
          onBack={() => go(step - 1)}
          onNext={() => tryGo(step + 1)}
          onShare={() => void shareBill(bill, result)}
        />
      </div>

      <AppToaster />
    </MotionConfig>
  )
}
