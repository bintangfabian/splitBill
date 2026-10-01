import { toast } from 'sonner'
import type { Bill } from '../../domain/bill'
import type { BillResult } from '../../domain/calculate'
import { buildShareText } from '../../domain/share'

/** Bagikan rincian lewat menu share HP, atau salin ke clipboard kalau share tidak tersedia. */
export async function shareBill(bill: Bill, result: BillResult) {
  const text = buildShareText(bill, result)
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Split Bill', text })
      return
    }
    await navigator.clipboard.writeText(text)
    toast.success('Rincian disalin', { description: 'Tinggal tempel di grup chat.' })
  } catch (e) {
    if ((e as Error).name !== 'AbortError') toast.error('Gagal membagikan rincian')
  }
}
