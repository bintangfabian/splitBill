import { AnimatePresence, motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { useState, type Dispatch } from 'react'
import { toast } from 'sonner'
import type { Action } from '../lib/store'
import type { Bill } from '../lib/types'
import { FriendsIllustration } from './Illustrations'
import { Avatar, SectionTitle } from './ui'

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
      <SectionTitle eyebrow="Langkah 1" title={<>Siapa aja yang <span className="font-serif font-normal italic">ikut makan?</span></>} />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
        className="flex gap-2 rounded-[1.4rem] bg-surface p-1.5 shadow-[0_1px_0_var(--line),0_8px_24px_-12px_rgba(0,0,0,.15)]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ketik nama teman…"
          enterKeyHint="done"
          className="min-w-0 flex-1 bg-transparent px-4 text-base font-medium outline-none placeholder:text-muted"
        />
        <motion.button
          whileTap={{ scale: 0.9, rotate: 90 }}
          disabled={!name.trim()}
          className="grid size-12 place-items-center rounded-2xl bg-ink text-bg transition-opacity disabled:opacity-30"
          aria-label="Tambah teman"
        >
          <Plus size={22} strokeWidth={2.5} />
        </motion.button>
      </form>

      <AnimatePresence mode="popLayout" initial={false}>
        {bill.people.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <FriendsIllustration className="w-64" />
            <p className="mt-2 font-semibold">Belum ada yang ikut nih</p>
            <p className="mt-1 max-w-60 text-sm text-muted">Masukin nama kamu dan teman-teman yang mau patungan.</p>
          </motion.div>
        ) : (
          <motion.ul key="list" layout className="mt-5 grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {bill.people.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, filter: 'blur(6px)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28, delay: i < 8 ? 0 : 0 }}
                  className="relative flex items-center gap-3 rounded-[1.4rem] bg-surface p-3 pr-9"
                >
                  <Avatar name={p.name} color={p.color} size={42} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.name}</p>
                    {bill.payerId === p.id && <p className="text-xs font-semibold text-violet">Yang bayar</p>}
                  </div>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Hapus ${p.name}`}
                    className="absolute top-2 right-2 grid size-7 place-items-center rounded-full text-muted hover:bg-surface-2"
                  >
                    <X size={15} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>

      {bill.people.length === 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm text-muted">
          Tambah minimal satu orang lagi buat patungan 👀
        </motion.p>
      )}
    </div>
  )
}
