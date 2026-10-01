import { expect, test, type Page } from '@playwright/test'

type NewItem = { name: string; price: number; qty?: number; who: string[] | 'semua' }

const heading = (page: Page) => page.getByRole('heading', { level: 2 })
const next = (page: Page) => page.getByRole('button', { name: /Lanjut|Lihat hasil/ }).click()

async function addPeople(page: Page, ...names: string[]) {
  const input = page.getByPlaceholder('Ketik nama teman…')
  for (const name of names) {
    await input.fill(name)
    await input.press('Enter')
  }
}

async function addItem(page: Page, { name, price, qty = 1, who }: NewItem) {
  await page.getByRole('button', { name: 'Tambah pesanan' }).click()
  const sheet = page.getByRole('dialog')
  await sheet.getByPlaceholder('Nama menu, mis. Nasi Goreng').fill(name)
  await sheet.getByPlaceholder('0').fill(String(price))
  for (let i = 1; i < qty; i++) await sheet.getByRole('button', { name: 'Tambah', exact: true }).click()
  if (who === 'semua') await sheet.getByRole('button', { name: 'Semua' }).click()
  else for (const w of who) await sheet.getByRole('button', { name: new RegExp(`${w}$`) }).click()
  await sheet.getByRole('button', { name: /^Tambahkan/ }).click()
  await expect(sheet).toBeHidden()
}

test('alur lengkap: teman → pesanan → pajak → hasil → bagikan', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  // Paksa jalur salin ke clipboard supaya hasilnya bisa diperiksa.
  await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: undefined }))
  await page.goto('/')

  await addPeople(page, 'Budi', 'Ani', 'Rina')
  await next(page)
  await expect(heading(page)).toContainText('Pesan')

  await addItem(page, { name: 'Nasi Goreng', price: 25000, qty: 2, who: ['Budi', 'Ani'] })
  await addItem(page, { name: 'Es Teh', price: 5000, qty: 3, who: 'semua' })
  await addItem(page, { name: 'Ayam Bakar', price: 40000, who: ['Rina'] })
  await expect(page.getByText('Subtotal (3 menu)')).toBeVisible()

  await next(page)
  await expect(heading(page)).toContainText('Pajak')
  await expect(page.locator('footer')).toContainText('Rp 121.275')

  await next(page)
  await expect(heading(page)).toContainText('Beres')
  await expect(page.getByText('Total tagihan')).toBeVisible()

  await page.getByRole('button', { name: /Bagikan ke grup/ }).click()
  await expect(page.getByText('Rincian disalin')).toBeVisible()
  const shared = await page.evaluate(() => navigator.clipboard.readText())
  expect(shared).toContain('Total: Rp 121.275 — dibayar Budi')
  expect(shared).toContain('• Budi (yang bayar): Rp 34.650')
  expect(shared).toContain('• Ani: Rp 34.650')
  expect(shared).toContain('• Rina: Rp 51.975')
})

test('tidak bisa lanjut sebelum ada minimal 2 orang', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi')
  await next(page)
  await expect(page.getByText('Tambah minimal 2 orang dulu')).toBeVisible()
  await expect(heading(page)).toContainText('ikut makan')
})

test('pesanan tanpa pemilik menahan langkah pajak', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi', 'Ani', 'Rina')
  await next(page)
  await addItem(page, { name: 'Sate', price: 30000, who: ['Budi'] })

  await page.getByRole('button', { name: 'Kembali' }).click()
  await page.getByRole('button', { name: 'Hapus Budi' }).click()
  await next(page)
  await expect(page.getByText('Belum ada yang pesan')).toBeVisible()

  await next(page)
  await expect(page.getByText('1 pesanan belum ada yang pesan')).toBeVisible()
  await expect(heading(page)).toContainText('Pesan')
})

test('data tetap ada setelah halaman dimuat ulang', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi', 'Ani')
  await next(page)
  await addItem(page, { name: 'Bakso', price: 20000, who: 'semua' })

  await page.reload()
  await expect(heading(page)).toContainText('Pesan')
  await expect(page.getByRole('button', { name: /Bakso/ })).toBeVisible()
})

test('hapus pesanan bisa diurungkan', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi', 'Ani')
  await next(page)
  await addItem(page, { name: 'Bakso', price: 20000, who: 'semua' })

  await page.getByRole('button', { name: /Bakso/ }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Hapus pesanan' }).click()
  await expect(page.getByRole('button', { name: /Bakso/ })).toHaveCount(0)

  await page.getByRole('button', { name: 'Urungkan' }).click()
  await expect(page.getByRole('button', { name: /Bakso/ })).toBeVisible()
})

test('reset tagihan bisa diurungkan', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi', 'Ani')
  await next(page)
  await addItem(page, { name: 'Bakso', price: 20000, who: 'semua' })

  await page.getByRole('button', { name: 'Tagihan baru' }).click()
  await page.getByRole('button', { name: 'Hapus', exact: true }).click()
  await expect(page.getByText('Belum ada yang ikut nih')).toBeVisible()

  await page.getByRole('button', { name: 'Urungkan' }).click()
  await expect(page.getByText('Budi', { exact: true })).toBeVisible()
  await expect(page.locator('footer')).toContainText('Rp 23.100')
})
