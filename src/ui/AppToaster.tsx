import { Toaster } from 'sonner'

export function AppToaster() {
  return (
    // Toast muncul di atas bar bawah, dekat jempol dan tombol Urungkan, tanpa menutupi navigasi langkah.
    <Toaster
      position="bottom-center"
      offset={{ bottom: 'calc(env(safe-area-inset-bottom) + 104px)' }}
      mobileOffset={{ bottom: 'calc(env(safe-area-inset-bottom) + 104px)' }}
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
