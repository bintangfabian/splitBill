import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Plus } from 'lucide-react'
import { lazy, Suspense, useState, type Dispatch } from 'react'
import { toast } from 'sonner'
import type { Bill, Item } from '../../domain/bill'
import { itemsSubtotal } from '../../domain/calculate'
import { rupiah } from '../../lib/format'
import { uid } from '../../lib/id'
import type { Action } from '../../state/billReducer'
import { AnimatedRupiah, Avatar, Button, ReceiptIllustration, SectionTitle } from '../../ui'
import { duration, spring } from '../../ui/motion'
import { ItemForm } from './ItemForm'

// Bottom sheet (Vaul + Radix) baru dimuat saat langkah Pesanan dibuka.
const Sheet = lazy(() => import('../../ui/Sheet').then((m) => ({ default: m.Sheet })))

const blank = (): Item => ({ id: uid(), name: '', price: 0, qty: 1, sharedBy: [] })

export function ItemsStep({ bill, dispatch }: { bill: Bill; dispatch: Dispatch<Action> }) {
  const [draft, setDraft] = useState<Item | null>(null)
  const [open, setOpen] = useState(false)
  const people = new Map(bill.people.map((p) => [p.id, p]))
  const subtotal = itemsSubtotal(bill.items)

  const edit = (item: Item) => {
    setDraft(item)
    setOpen(true)
  }

  const remove = (id: string) => {
    const index = bill.items.findIndex((i) => i.id === id)
    const item = bill.items[index]
    dispatch({ type: 'removeItem', id })
    setOpen(false)
    toast(`${item.name || 'Pesanan'} dihapus`, {
      action: { label: 'Urungkan', onClick: () => dispatch({ type: 'restoreItem', item, index }) },
    })
  }

  return (
    <div>
      <SectionTitle title="Apa saja yang dipesan?">Ketuk menu untuk mengubah. Menu yang dipesan beberapa orang dibagi rata.</SectionTitle>

      {bill.items.length === 0 ? (
        <div className="flex flex-col items-center px-6 pt-6 pb-2 text-center">
          <ReceiptIllustration className="w-40 text-muted" />
          <p className="mt-4 font-semibold">Struknya masih kosong</p>
          <p className="mt-1 max-w-64 text-[15px] text-muted">Masukkan menu satu per satu sesuai struk, lalu pilih siapa yang pesan.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card bg-surface">
          <ul className="divide-y divide-line">
            <AnimatePresence mode="popLayout" initial={false}>
              {bill.items.map((item) => {
                const owners = item.sharedBy.map((id) => people.get(id)).filter((p) => !!p)
                return (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: duration.fast } }}
                    transition={spring.list}
                  >
                    <button onClick={() => edit(item)} className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors active:bg-surface-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.name || 'Tanpa nama'}</p>
                        <p className="mt-0.5 text-sm text-muted tabular-nums">
                          {item.qty} × {rupiah(item.price)}
                        </p>
                        <div className="mt-2 flex items-center">
                          {owners.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-danger">
                              <AlertCircle size={13} aria-hidden /> Belum ada yang pesan
                            </span>
                          ) : (
                            <>
                              <div className="flex -space-x-1.5">
                                {owners.slice(0, 5).map((p) => (
                                  <span key={p.id} className="inline-flex rounded-full ring-2 ring-surface">
                                    <Avatar name={p.name} color={p.color} size={24} />
                                  </span>
                                ))}
                              </div>
                              <span className="ml-2 truncate text-xs font-medium text-muted">
                                {owners.length > 1 ? `dibagi ${owners.length}` : owners[0].name}
                              </span>
                              {owners.length > 1 && <span className="sr-only">{owners.map((p) => p.name).join(', ')}</span>}
                            </>
                          )}
                        </div>
                      </div>
                      <p className="shrink-0 font-semibold tabular-nums">{rupiah(item.price * item.qty)}</p>
                    </button>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
          <div className="px-4 pb-3.5">
            <div className="rule-dashed" />
            <div className="flex items-center justify-between pt-3">
              <span className="text-[15px] text-muted">Subtotal ({bill.items.length} menu)</span>
              <AnimatedRupiah value={subtotal} className="font-bold" />
            </div>
          </div>
        </div>
      )}

      <Button variant={bill.items.length === 0 ? 'primary' : 'soft'} className="mt-4 w-full" onClick={() => edit(blank())}>
        <Plus size={18} /> Tambah pesanan
      </Button>

      <Suspense fallback={null}>
        <Sheet
          open={open}
          onOpenChange={setOpen}
          title={bill.items.some((i) => i.id === draft?.id) ? 'Ubah pesanan' : 'Pesanan baru'}
        >
          {draft && (
            <ItemForm
              key={draft.id}
              initial={draft}
              bill={bill}
              isNew={!bill.items.some((i) => i.id === draft.id)}
              onSave={(item) => {
                dispatch({ type: 'upsertItem', item })
                setOpen(false)
              }}
              onSaveAndAddAnother={(item) => {
                dispatch({ type: 'upsertItem', item })
                setDraft(blank())
              }}
              onDelete={() => remove(draft.id)}
            />
          )}
        </Sheet>
      </Suspense>
    </div>
  )
}
