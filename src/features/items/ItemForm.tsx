import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Bill, Item } from '../../domain/bill'
import { rupiah } from '../../lib/format'
import { Avatar, Button, MoneyInput } from '../../ui'

export function ItemForm({
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
        <MoneyInput label="Harga satuan" value={item.price} onChange={(price) => set({ price })} className="flex-1" />
        <div className="flex items-center gap-1 rounded-2xl bg-surface-2 p-1.5">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => set({ qty: Math.max(1, item.qty - 1) })} className="grid size-9 place-items-center rounded-xl bg-surface" aria-label="Kurangi jumlah">
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
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => set({ qty: item.qty + 1 })} className="grid size-9 place-items-center rounded-xl bg-surface" aria-label="Tambah jumlah">
            <Plus size={16} />
          </motion.button>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Siapa yang pesan?</p>
          <button
            onClick={() => set({ sharedBy: allSelected ? [] : bill.people.map((p) => p.id) })}
            aria-pressed={allSelected}
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
                aria-pressed={on}
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
