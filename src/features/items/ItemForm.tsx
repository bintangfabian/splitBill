import { motion } from 'motion/react'
import { Check, Minus, Plus, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Bill, Item } from '../../domain/bill'
import { rupiah } from '../../lib/format'
import { Avatar, Button, MoneyInput } from '../../ui'
import { duration, press } from '../../ui/motion'

export function ItemForm({
  initial,
  bill,
  isNew,
  onSave,
  onSaveAndAddAnother,
  onDelete,
}: {
  initial: Item
  bill: Bill
  isNew: boolean
  onSave: (i: Item) => void
  /** Simpan lalu langsung kosongkan form untuk menu berikutnya tanpa menutup sheet. */
  onSaveAndAddAnother: (i: Item) => void
  onDelete: () => void
}) {
  const [item, setItem] = useState(initial)
  const set = (patch: Partial<Item>) => setItem((i) => ({ ...i, ...patch }))
  const allSelected = bill.people.length > 0 && bill.people.every((p) => item.sharedBy.includes(p.id))
  const togglePerson = (id: string) =>
    set({ sharedBy: item.sharedBy.includes(id) ? item.sharedBy.filter((x) => x !== id) : [...item.sharedBy, id] })

  const problem = !item.name.trim()
    ? 'Nama menunya diisi dulu ya'
    : !item.price
      ? 'Harganya belum diisi'
      : item.sharedBy.length === 0
        ? 'Pilih minimal satu orang yang pesan'
        : null

  const submit = (save: (i: Item) => void) => {
    if (problem) return toast.error(problem, { position: 'top-center' })
    save({ ...item, name: item.name.trim() })
    if (isNew) toast.success(`${item.name.trim()} ditambahkan`, { position: 'top-center' })
  }

  return (
    <div className="space-y-5 pb-2">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted">Nama menu</p>
        <input
          value={item.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="mis. Nasi Goreng"
          aria-label="Nama menu"
          // eslint-disable-next-line jsx-a11y/no-autofocus -- fokus ke field pertama saat sheet pesanan baru dibuka
          autoFocus={isNew}
          className="h-12 w-full rounded-control bg-surface-2 px-4 text-[17px] font-semibold ring-ink outline-none transition-shadow placeholder:font-medium placeholder:text-muted focus:ring-2"
        />
      </div>

      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-xs font-semibold text-muted">Harga satuan</p>
          <MoneyInput label="Harga satuan" value={item.price} onChange={(price) => set({ price })} />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted">Jumlah</p>
          <div className="flex h-12 items-center gap-1 rounded-control bg-surface-2 p-1">
            <motion.button
              whileTap={press}
              transition={{ duration: duration.fast }}
              onClick={() => set({ qty: Math.max(1, item.qty - 1) })}
              disabled={item.qty <= 1}
              className="grid size-10 place-items-center rounded-[9px] bg-surface transition-opacity disabled:opacity-40"
              aria-label="Kurangi jumlah"
            >
              <Minus size={16} />
            </motion.button>
            <span className="w-7 text-center font-bold tabular-nums" aria-live="polite">
              {item.qty}
            </span>
            <motion.button
              whileTap={press}
              transition={{ duration: duration.fast }}
              onClick={() => set({ qty: item.qty + 1 })}
              className="grid size-10 place-items-center rounded-[9px] bg-surface"
              aria-label="Tambah jumlah"
            >
              <Plus size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted">Dipesan oleh</p>
          <button
            onClick={() => set({ sharedBy: allSelected ? [] : bill.people.map((p) => p.id) })}
            aria-pressed={allSelected}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors ${allSelected ? 'bg-ink text-bg' : 'bg-surface-2 text-ink'}`}
          >
            <Users size={13} aria-hidden /> Semua
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {bill.people.map((p) => {
            const on = item.sharedBy.includes(p.id)
            return (
              <motion.button
                key={p.id}
                whileTap={press}
                transition={{ duration: duration.fast }}
                onClick={() => togglePerson(p.id)}
                aria-pressed={on}
                className="flex min-h-10 items-center gap-2 rounded-full py-1 pr-3.5 pl-1 text-sm font-semibold transition-colors"
                style={on ? { backgroundColor: p.color, color: '#111215' } : { backgroundColor: 'var(--surface-2)' }}
              >
                <Avatar name={p.name} color={p.color} size={28} />
                {p.name}
                {on && <Check size={14} strokeWidth={2.75} aria-hidden />}
              </motion.button>
            )
          })}
        </div>
        {item.sharedBy.length > 1 && item.price > 0 && (
          <p className="mt-3 text-sm text-muted">
            Masing-masing <b className="font-semibold text-ink tabular-nums">{rupiah((item.price * item.qty) / item.sharedBy.length)}</b> sebelum pajak
          </p>
        )}
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="soft" onClick={onDelete} aria-label="Hapus pesanan" className="!px-4 text-danger">
              <Trash2 size={18} />
            </Button>
          )}
          <Button className="flex-1" onClick={() => submit(onSave)}>
            <span>
              {isNew ? 'Tambahkan' : 'Simpan'} · <span className="tabular-nums">{rupiah(item.price * item.qty)}</span>
            </span>
          </Button>
        </div>
        {isNew && (
          <Button variant="ghost" className="w-full text-[15px] text-muted" onClick={() => submit(onSaveAndAddAnother)}>
            <Plus size={16} /> Simpan & tambah menu lain
          </Button>
        )}
      </div>
    </div>
  )
}
