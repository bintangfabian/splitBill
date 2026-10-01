import { Toaster } from 'sonner'

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      offset={16}
      toastOptions={{
        classNames: {
          toast: '!rounded-2xl !border-line !bg-surface !text-ink !font-sans !shadow-xl',
          description: '!text-muted',
          actionButton: '!rounded-full !bg-ink !text-bg !font-semibold',
        },
      }}
    />
  )
}
