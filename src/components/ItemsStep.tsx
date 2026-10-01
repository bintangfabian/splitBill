import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Minus, Plus, Trash2, Users } from 'lucide-react'
import { useState, type Dispatch } from 'react'
import { toast } from 'sonner'
import { rupiah, uid } from '../lib/format'
import type { Action } from '../lib/store'
import type { Bill, Item } from '../lib/types'
import { ReceiptIllustration } from './Illustrations'
import { AnimatedRupiah, Avatar, Button, MoneyInput, SectionTitle, Sheet } from './ui'

const blank = (): Item => ({ id: uid(), name: '', price: 0, qty: 1, sharedBy: [] })

export function ItemsStep({ bill, dispatch }: { bill: Bill; dispatch: Dispatch<Action> }) {
  const [draft, setDraft] = useState<Item | null>(null)
  const [open, setOpen] = useState(false)
  const people = new Map(bill.people.map((p) => [p.id, p]))
  const subtotal = bill.items.reduce((s, i) => s + i.price * i.qty, 0)

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
      <SectionTitle eyebrow="Langkah 2" title={<>Pesan <span className="font-serif font-normal italic">apa aja?</span></>}>
        Satu menu bisa dibagi ke beberapa orang, harganya otomatis dibagi rata.
      </SectionTitle>

      <AnimatePresence mode="popLayout" initial={false}>
        {bill.items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center pt-2 pb-6 text-center"
          >
            <ReceiptIllustration className="w-60" />
            <p className="mt-2 font-semibold">Struknya masih kosong</p>
            <p className="mt-1 max-w-60 text-sm text-muted">Tambahin menu satu-satu sesuai struk, lalu pilih siapa yang pesan.</p>
          </motion.div>
        ) : (
          <motion.ul key="list" layout className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {bill.items.map((item) => {
                const owners = item.sharedBy.map((id) => people.get(id)).filter((p) => !!p)
                return (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => edit(item)}
                      className="flex w-full items-center gap-3 rounded-[1.4rem] bg-surface p-4 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.name || 'Tanpa nama'}</p>
                        <p className="mt-0.5 text-sm text-muted tabular-nums">
                          {item.qty} × {rupiah(item.price)}
                        </p>
                        <div className="mt-2.5 flex items-center">
                          {owners.length === 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-coral/15 px-2.5 py-1 text-xs font-semibold text-coral">
                              <AlertCircle size={13} /> Belum ada yang pesan
                            </span>
                          ) : (
                            <>
                              <div className="flex -space-x-2">
                                {owners.slice(0, 5).map((p) => (
                                  <span key={p.id} className="inline-flex rounded-full ring-2 ring-surface">
                                    <Avatar name={p.name} color={p.color} size={26} />
                                  </span>
                                ))}
                              </div>
                              {owners.length > 1 && (
                                <span className="ml-2 text-xs font-medium text-muted">dibagi {owners.length}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <p className="shrink-0 font-bold tabular-nums">{rupiah(item.price * item.qty)}</p>
                    </motion.button>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>

      {bill.items.length > 0 && (
        <motion.div layout className="mt-4 flex items-center justify-between rounded-[1.4rem] border border-dashed border-line px-5 py-4">
          <span className="text-sm font-medium text-muted">Subtotal ({bill.items.length} menu)</span>
          <AnimatedRupiah value={subtotal} className="font-bold" />
        </motion.div>
      )}

      <Button variant="soft" className="mt-4 w-full border-2 border-dashed border-line !bg-transparent" onClick={() => edit(blank())}>
        <Plus size={18} /> Tambah pesanan
      </Button>

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
            onDelete={() => remove(draft.id)}
          />
        )}
      </Sheet>
    </div>
  )
}

function ItemForm({
  initial,
  bill,
  isNew,
  onSave,
  onDelete,
}: {
  initial: Item
  bill: Bill
  isNew: boolean
  onSave: (i: Item) => void
  onDelete: () => void
}) {
  const [item, setItem] = useState(initial)
  const set = (patch: Partial<Item>) => setItem((i) => ({ ...i, ...patch }))
  const allSelected = bill.people.length > 0 && bill.people.every((p) => item.sharedBy.includes(p.id))
  const togglePerson = (id: string) =>
    set({ sharedBy: item.sharedBy.includes(id) ? item.sharedBy.filter((x) => x !== id) : [...item.sharedBy, id] })

  const save = () => {
    if (!item.name.trim()) return toast.error('Nama menunya diisi dulu ya')
    if (!item.price) return toast.error('Harganya belum diisi')
    if (item.sharedBy.length === 0) return toast.error('Pilih minimal satu orang yang pesan')
    onSave({ ...item, name: item.name.trim() })
    if (isNew) toast.success(`${item.name.trim()} ditambahkan`)
  }

  return (
    <div className="space-y-5 pb-2">
      <input
        value={item.name}
        onChange={(e) => set({ name: e.target.value })}
        placeholder="Nama menu, mis. Nasi Goreng"
        autoFocus={isNew}
        className="w-full rounded-2xl bg-surface-2 px-4 py-3.5 text-lg font-semibold outline-none ring-ink/80 placeholder:font-medium placeholder:text-muted/70 focus:ring-2"
      />

      <div className="flex gap-3">
        <MoneyInput value={item.price} onChange={(price) => set({ price })} className="flex-1" />
        <div className="flex items-center gap-1 rounded-2xl bg-surface-2 p-1.5">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => set({ qty: Math.max(1, item.qty - 1) })} className="grid size-9 place-items-center rounded-xl bg-surface" aria-label="Kurangi">
            <Minus size={16} />
          </motion.button>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={item.qty}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              className="w-7 text-center font-bold tabular-nums"
            >
              {item.qty}
            </motion.span>
          </AnimatePresence>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => set({ qty: item.qty + 1 })} className="grid size-9 place-items-center rounded-xl bg-surface" aria-label="Tambah">
            <Plus size={16} />
          </motion.button>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Siapa yang pesan?</p>
          <button
            onClick={() => set({ sharedBy: allSelected ? [] : bill.people.map((p) => p.id) })}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${allSelected ? 'bg-ink text-bg' : 'bg-surface-2'}`}
          >
            <Users size={13} /> Semua
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {bill.people.map((p) => {
            const on = item.sharedBy.includes(p.id)
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => togglePerson(p.id)}
                animate={{ backgroundColor: on ? p.color : 'var(--surface-2)' }}
                className="flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-semibold"
                style={{ color: on ? '#141414' : undefined }}
              >
                <Avatar name={p.name} color={p.color} size={28} />
                {p.name}
              </motion.button>
            )
          })}
        </div>
        {item.sharedBy.length > 1 && item.price > 0 && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-muted">
            Masing-masing <b className="text-ink">{rupiah((item.price * item.qty) / item.sharedBy.length)}</b> sebelum pajak
          </motion.p>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        {!isNew && (
          <Button variant="soft" onClick={onDelete} aria-label="Hapus pesanan" className="!px-4 text-coral">
            <Trash2 size={18} />
          </Button>
        )}
        <Button className="flex-1" onClick={save}>
          {isNew ? 'Tambahkan' : 'Simpan'} · {rupiah(item.price * item.qty)}
        </Button>
      </div>
    </div>
  )
}
