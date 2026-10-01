import { useCallback, useState } from 'react'

/** Langkah aktif beserta arah animasinya (1 maju, -1 mundur). */
export function useStepper(initial: number) {
  const [{ step, dir }, setNav] = useState({ step: initial, dir: 1 })
  const go = useCallback((to: number) => {
    setNav((n) => ({ step: to, dir: to > n.step ? 1 : -1 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  return { step, dir, go }
}
