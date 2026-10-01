import { useEffect, useReducer } from 'react'
import { billReducer } from './billReducer'
import { loadBill, saveBill } from './storage'

/** State tagihan yang otomatis tersimpan di localStorage. */
export function useBill() {
  const [bill, dispatch] = useReducer(billReducer, undefined, () => loadBill())
  useEffect(() => saveBill(bill), [bill])
  return [bill, dispatch] as const
}
