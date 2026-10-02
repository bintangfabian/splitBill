import type { ReactNode } from 'react'
import { Drawer } from 'vaul'

/** Bottom sheet ala iOS (Vaul): bisa di-drag turun untuk menutup. */
export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  children: ReactNode
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-lg flex-col rounded-t-[2rem] bg-surface outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line" />
          <div className="px-6 pt-4">
            <Drawer.Title className="text-xl font-bold tracking-tight">{title}</Drawer.Title>
            <Drawer.Description className="sr-only">{title}</Drawer.Description>
          </div>
          <div className="no-scrollbar overflow-y-auto px-6 pt-5 pb-safe">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
