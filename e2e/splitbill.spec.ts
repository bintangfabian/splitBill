import { expect, test, type Page } from '@playwright/test'

type NewItem = { name: string; price: number; qty?: number; who: string[] | 'semua' }

// Saat transisi, judul langkah lama dan baru sempat tampil bersamaan, jadi cari judul yang spesifik.
const expectStep = (page: Page, title: string) => expect(page.getByRole('heading', { level: 2, name: new RegExp(title) })).toBeVisible()
const next = (page: Page) => page.getByRole('button', { name: /Lanjut|Lihat hasil/ }).click()
const openStep = (page: Page, name: string) => page.locator('nav').getByRole('button', { name: new RegExp(name) }).click()

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
  await sheet.getByLabel('Nama menu').fill(name)
  await sheet.getByLabel('Harga satuan').fill(String(price))
  for (let i = 1; i < qty; i++) await sheet.getByRole('button', { name: 'Tambah jumlah' }).click()
  if (who === 'semua') await sheet.getByRole('button', { name: 'Semua' }).click()
  else for (const w of who) await sheet.getByRole('button', { name: w, exact: true }).click()
  await sheet.getByRole('button', { name: /^Tambahkan/ }).click()
  await expect(sheet).toBeHidden()
}

/** Isi tagihan langsung lewat localStorage untuk skenario yang tidak menguji pengisian awal. */
async function seed(page: Page) {
  await page.goto('/')
  await page.evaluate(() =>
    localStorage.setItem(
      'splitbill:v1',
      JSON.stringify({
        title: '',
        people: [
          { id: 'a', name: 'Budi', color: '#FFB4A2' },
          { id: 'b', name: 'Ani', color: '#B8E0D2' },
        ],
        items: [{ id: 'x', name: 'Iga Bakar', price: 100000, qty: 1, sharedBy: ['a', 'b'] }],
        charges: { servicePct: 5, taxPct: 10, taxAfterService: true, discount: 0, discountType: 'amount', extraFee: 0 },
        payerId: 'a',
      }),
    ),
  )
  await page.reload()
}

async function readShared(page: Page) {
  await page.locator('footer').getByRole('button', { name: 'Bagikan', exact: true }).click()
  await expect(page.getByText('Rincian disalin')).toBeVisible()
  return page.evaluate(() => navigator.clipboard.readText())
}

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  // Paksa jalur salin ke clipboard supaya teks yang dibagikan bisa diperiksa.
  await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: undefined }))
})

test('alur lengkap: teman → pesanan → pajak → hasil → bagikan', async ({ page }) => {
  await page.goto('/')

  await addPeople(page, 'Budi', 'Ani', 'Rina')
  await next(page)
  await expectStep(page, 'dipesan')

  await addItem(page, { name: 'Nasi Goreng', price: 25000, qty: 2, who: ['Budi', 'Ani'] })
  await addItem(page, { name: 'Es Teh', price: 5000, qty: 3, who: 'semua' })
  await addItem(page, { name: 'Ayam Bakar', price: 40000, who: ['Rina'] })
  await expect(page.getByText('Subtotal (3 menu)')).toBeVisible()
  await expect(page.getByRole('button', { name: /Ayam Bakar/ })).toContainText('Rina')
  // Sebelum pajak diatur, bar bawah menampilkan subtotal yang sama dengan daftar pesanan.
  await expect(page.locator('footer')).toContainText('Subtotal')
  await expect(page.locator('footer')).toContainText('Rp 105.000')

  await next(page)
  await expectStep(page, 'Pajak')
  await expect(page.locator('footer').getByText('Total', { exact: true })).toBeVisible()
  await expect(page.locator('footer')).toContainText('Rp 121.275')

  await next(page)
  await expectStep(page, 'Rincian patungan')
  await expect(page.locator('footer').getByText('Total', { exact: true })).toBeVisible()

  const shared = await readShared(page)
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
  await expectStep(page, 'yang ikut')
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
  await expectStep(page, 'dipesan')
})

test('data tetap ada setelah halaman dimuat ulang', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi', 'Ani')
  await next(page)
  await addItem(page, { name: 'Bakso', price: 20000, who: 'semua' })

  await page.reload()
  await expectStep(page, 'dipesan')
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

test('urungkan reset mengembalikan data dan langkah terakhir', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi', 'Ani')
  await next(page)
  await addItem(page, { name: 'Bakso', price: 20000, who: 'semua' })

  await page.getByRole('button', { name: 'Kosongkan tagihan' }).click()
  await expect(page.getByText('Belum ada yang ditambahkan')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Kosongkan tagihan' })).toBeDisabled()

  await page.getByRole('button', { name: 'Urungkan' }).click()
  await expectStep(page, 'dipesan')
  await expect(page.getByRole('button', { name: /Bakso/ })).toBeVisible()
  await expect(page.locator('footer')).toContainText('Rp 20.000')
})

test('service, diskon, ongkir, dan urutan pajak bisa diatur lewat input berlabel', async ({ page }) => {
  await seed(page)
  await openStep(page, 'Pajak')

  await page.getByRole('button', { name: 'Service 10%' }).click()
  await page.getByLabel('Diskon (Rp)').fill('20000')
  await page.getByLabel('Ongkir atau biaya lain').fill('10000')
  // (100.000 − 20.000) + service 10% + pajak 10% dari (80.000 + 8.000) + ongkir 10.000
  await expect(page.locator('footer')).toContainText('Rp 106.800')

  await page.getByRole('switch', { name: /Pajak dihitung setelah service/ }).click()
  await expect(page.getByRole('switch', { name: /Pajak dihitung setelah service/ })).toHaveAttribute('aria-checked', 'false')
  await expect(page.locator('footer')).toContainText('Rp 106.000')

  await next(page)
  const shared = await readShared(page)
  expect(shared).toContain('Service 10% · Pajak 10% · Diskon Rp 20.000 · Biaya lain Rp 10.000')
})

test('struk tercetak sekali per isi tagihan, tidak setiap balik ke Hasil', async ({ page }) => {
  const receipt = page.locator('[data-print]')
  await seed(page)

  await openStep(page, 'Hasil')
  await expect(receipt).toHaveAttribute('data-print', 'on')

  // Tunggu struk lama benar-benar keluar; kalau kembali saat animasi keluar, instance yang sama dipakai lagi.
  await openStep(page, 'Pajak')
  await expect(receipt).toHaveCount(0)
  await openStep(page, 'Hasil')
  await expect(receipt).toHaveAttribute('data-print', 'off')

  // Isi tagihan berubah: struk dicetak ulang.
  await openStep(page, 'Pajak')
  await expect(receipt).toHaveCount(0)
  await page.getByRole('button', { name: 'Pajak 11%' }).click()
  await openStep(page, 'Hasil')
  await expect(receipt).toHaveAttribute('data-print', 'on')
})

test('simpan & tambah menu lain tanpa menutup sheet', async ({ page }) => {
  await page.goto('/')
  await addPeople(page, 'Budi', 'Ani')
  await next(page)

  await page.getByRole('button', { name: 'Tambah pesanan' }).click()
  const sheet = page.getByRole('dialog')
  await sheet.getByLabel('Nama menu').fill('Kopi Susu')
  await sheet.getByLabel('Harga satuan').fill('18000')
  await sheet.getByRole('button', { name: 'Budi', exact: true }).click()
  await sheet.getByRole('button', { name: /Simpan & tambah menu lain/ }).click()

  // Sheet tetap terbuka dengan form kosong dan kursor siap di nama menu.
  await expect(sheet).toBeVisible()
  await expect(sheet.getByLabel('Nama menu')).toHaveValue('')
  await expect(sheet.getByLabel('Nama menu')).toBeFocused()

  await sheet.getByLabel('Nama menu').fill('Roti Bakar')
  await sheet.getByLabel('Harga satuan').fill('22000')
  await sheet.getByRole('button', { name: 'Ani', exact: true }).click()
  await sheet.getByRole('button', { name: /^Tambahkan/ }).click()

  await expect(sheet).toBeHidden()
  await expect(page.getByText('Subtotal (2 menu)')).toBeVisible()
  await expect(page.getByRole('button', { name: /Kopi Susu/ })).toContainText('Budi')
  await expect(page.getByRole('button', { name: /Roti Bakar/ })).toContainText('Ani')
})

test('info rekening pembayar ikut dibagikan dan tetap tersimpan', async ({ page }) => {
  await seed(page)
  await openStep(page, 'Hasil')

  const info = page.getByLabel('Rekening atau e-wallet pembayar')
  await info.fill('BCA 1234567890 a.n. Budi')
  const shared = await readShared(page)
  expect(shared).toContain('Total: Rp 115.500 — dibayar Budi\nTransfer ke: BCA 1234567890 a.n. Budi')

  await page.reload()
  await openStep(page, 'Hasil')
  await expect(page.getByLabel('Rekening atau e-wallet pembayar')).toHaveValue('BCA 1234567890 a.n. Budi')
})

test.describe('layar kecil (320 px)', () => {
  test.use({ viewport: { width: 320, height: 568 } })

  test('total di bar bawah tidak terpotong', async ({ page }) => {
    await seed(page)
    for (const step of ['Pajak', 'Hasil']) {
      await openStep(page, step)
      const amount = page.locator('footer').getByText('Rp 115.500')
      await expect(amount).toBeVisible()
      const clipped = await amount.evaluate((el) => el.scrollWidth > el.clientWidth + 1)
      expect(clipped, `total terpotong di langkah ${step}`).toBe(false)
    }
  })
})
