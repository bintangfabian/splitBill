import { AnimatePresence, motion } from 'motion/react'
import { Plus, Wallet, X } from 'lucide-react'
import { useState, type Dispatch } from 'react'
import { toast } from 'sonner'
import type { Bill } from '../../domain/bill'
import type { Action } from '../../state/billReducer'
import { Avatar, PeopleIllustration, SectionTitle } from '../../ui'
import { duration, press, spring } from '../../ui/motion'

export function PeopleStep({ bill, dispatch }: { bill: Bill; dispatch: Dispatch<Action> }) {
  const [name, setName] = useState('')

  const add = () => {
    const n = name.trim()
    if (!n) return
    if (bill.people.some((p) => p.name.toLowerCase() === n.toLowerCase())) {
      toast.warning(`${n} sudah ada di daftar`)
      return
    }
    dispatch({ type: 'addPerson', name: n })
    setName('')
  }

  const remove = (id: string) => {
    const index = bill.people.findIndex((p) => p.id === id)
    const person = bill.people[index]
    const snapshot = { items: bill.items, payerId: bill.payerId }
    dispatch({ type: 'removePerson', id })
    toast(`${person.name} dihapus`, {
      action: { label: 'Urungkan', onClick: () => dispatch({ type: 'restorePerson', person, index, ...snapshot }) },
    })
  }

  return (
    <div>
      <SectionTitle title="Siapa saja yang ikut?">
        Orang pertama dicatat sebagai yang bayar duluan. Bisa diganti di langkah Hasil.
      </SectionTitle>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
        className="flex gap-2 rounded-card bg-surface p-1.5"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ketik nama teman…"
          aria-label="Nama teman"
          enterKeyHint="done"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-base font-medium outline-none placeholder:text-muted"
        />
        <motion.button
          whileTap={press}
          transition={{ duration: duration.fast }}
          disabled={!name.trim()}
          className="grid size-11 place-items-center rounded-control bg-ink text-bg transition-opacity disabled:opacity-30"
          aria-label="Tambah teman"
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.button>
      </form>

      {bill.people.length === 0 ? (
        <div className="flex flex-col items-center px-6 pt-10 pb-4 text-center">
          <PeopleIllustration className="w-40 text-muted" />
          <p className="mt-4 font-semibold">Belum ada yang ditambahkan</p>
          <p className="mt-1 max-w-64 text-[15px] text-muted">Masukkan nama kamu dan teman-teman yang ikut patungan.</p>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {bill.people.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: duration.fast } }}
                transition={spring.list}
                className="relative flex items-center gap-2.5 rounded-card bg-surface p-3 pr-4"
              >
                <Avatar name={p.name} color={p.color} size={40} />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-[15px] leading-tight font-semibold wrap-break-word">{p.name}</p>
                  {bill.payerId === p.id && (
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-muted">
                      <Wallet size={12} aria-hidden /> Bayar duluan
                    </p>
                  )}
                </div>
                <button
                  onClick={() => remove(p.id)}
                  aria-label={`Hapus ${p.name}`}
                  className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border-2 border-bg bg-surface-2 text-muted before:absolute before:-inset-2.5 active:text-ink"
                >
                  <X size={12} strokeWidth={2.75} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {bill.people.length === 1 && <p className="mt-4 text-center text-[15px] text-muted">Tambah minimal satu orang lagi.</p>}
    </div>
  )
}
