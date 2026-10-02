import { toast } from 'sonner'

// Toast di atas supaya tidak tertutup sheet struk.
const position = 'top-center' as const

const failed = (e: unknown, message: string) => {
  if ((e as Error).name !== 'AbortError') toast.error(message, { position })
}

export function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Rincian disalin', { position, description: 'Tinggal tempel di grup chat.' })
  } catch (e) {
    failed(e, 'Gagal menyalin rincian')
  }
}

/**
 * Bagikan gambar struk dan teks rincian sekaligus lewat menu share HP.
 * Kalau perangkat tidak bisa berbagi file (mis. laptop), gambar diunduh dan teksnya disalin.
 * Dipanggil langsung dari klik tanpa `await` sebelumnya, karena Safari menolak share di luar gestur pengguna.
 */
export function shareReceipt(file: File, text: string) {
  if (navigator.canShare?.({ files: [file] })) {
    navigator.share({ files: [file], text }).catch((e) => failed(e, 'Gagal membagikan struk'))
    return
  }
  downloadFile(file)
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success('Gambar struk tersimpan', { position, description: 'Rinciannya juga udah disalin, tinggal tempel di grup.' }))
    .catch(() => toast.success('Gambar struk tersimpan', { position }))
}
