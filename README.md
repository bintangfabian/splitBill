# SplitBill

Bagi tagihan bareng teman tanpa ribet. Masukkan siapa yang ikut, apa yang dipesan, lalu pajak dan service. SplitBill menghitung berapa yang harus ditransfer tiap orang ke yang bayar duluan.

Dibuat sebagai PWA, jadi bisa dipasang di layar utama HP dan tetap jalan tanpa internet.

## Fitur

- **4 langkah:** Teman → Pesanan → Pajak → Hasil.
- **Menu bisa dibagi** ke beberapa orang. Harganya otomatis dibagi rata di antara yang pesan.
- **Simpan & tambah menu lain** tanpa menutup sheet, untuk input banyak menu sekaligus.
- **Service, pajak (PB1), diskon (Rp atau %), dan ongkir/biaya lain.** Pajak bisa dihitung sebelum atau sesudah service.
- **Pilih yang bayar duluan.** Hasilnya menampilkan siapa transfer berapa ke siapa, beserta rincian per orang.
- **Bagikan ke grup** lewat menu share HP, atau salin teks kalau share tidak tersedia.
- **Hapus dengan Urungkan.** Orang, pesanan, dan tagihan yang terhapus bisa dikembalikan dari toast.
- **Tersimpan otomatis** di perangkat (localStorage), tidak ada server dan tidak perlu akun.
- Mode gelap mengikuti pengaturan HP.

## Cara hitung

```
subtotal − diskon → + service → + pajak → + biaya lain
```

- Diskon, service, dan pajak dibagi **proporsional** sesuai porsi pesanan tiap orang.
- Ongkir/biaya lain dibagi **rata** ke semua orang.
- Tagihan tiap orang dibulatkan ke rupiah. Selisih pembulatan ditanggung yang bayar duluan, supaya jumlahnya sama persis dengan total struk.

Logikanya ada di [`src/domain/calculate.ts`](src/domain/calculate.ts) beserta unit test-nya.

## Menjalankan di lokal

Butuh Node.js 22 atau lebih baru.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal. Untuk mencoba dari HP di jaringan yang sama, jalankan `npm run dev -- --host`.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server development |
| `npm run typecheck` | Cek tipe TypeScript |
| `npm run lint` | Lint (oxlint), warning dianggap gagal |
| `npm test` | Unit test (Vitest) |
| `npm run test:e2e` | E2E di browser (Playwright) |
| `npm run build` | Build production + PWA ke `dist/` |
| `npm run icons` | Buat ulang ikon PWA dari `public/logo.svg` |

Pertama kali menjalankan E2E: `npx playwright install --only-shell chromium`.

CI di GitHub Actions menjalankan typecheck, lint, unit test, dan E2E di setiap PR.

## Deploy ke Vercel

1. Di Vercel, pilih **Add New → Project**, lalu import repo ini.
2. Framework terdeteksi otomatis sebagai **Vite**. Build command `npm run build`, output `dist`.
3. Klik **Deploy**.

Pengaturan rewrite dan cache service worker sudah ada di [`vercel.json`](vercel.json). Setiap PR otomatis dapat preview deployment.

## Teknologi

React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Vaul (bottom sheet), Sonner (toast), dan vite-plugin-pwa. Test memakai Vitest dan Playwright.

## Kontribusi

Aturan kerja, struktur folder, dan format commit/PR ada di [`AGENTS.md`](AGENTS.md). Ringkasnya: Issue → branch → PR → merge, tanpa push langsung ke `main`.
