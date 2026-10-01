# Design SplitBill

Panduan tampilan untuk siapa pun yang mengubah UI, manusia maupun agent. Kalau ragu, ikuti dokumen ini daripada selera pribadi.

## Konteks pemakaian

Orang baru selesai makan. Satu tangan memegang HP, satu lagi memegang struk, dan ruangannya sering remang. Tugasnya selesai dalam satu sampai dua menit. Jadi aplikasi ini alat kerja: harus cepat dibaca, cepat diisi, dan tidak minta perhatian.

## Dunia visual: struk

Kertas putih, tinta gelap, angka rata kanan, dan garis putus-putus seperti struk kasir. Hasil akhirnya benar-benar berbentuk struk yang dirobek.

- Warna dipakai untuk **menandai orang** (avatar). Di luar itu, tampilan hanya memakai tinta dan abu-abu.
- Struktur dibangun dari **daftar berkelompok** (kartu putih dengan garis pemisah tipis), bukan kartu warna-warni yang ditumpuk.
- Setiap elemen harus membawa informasi. Kalau dihapus dan tidak ada yang hilang, berarti memang tidak perlu.

## Token

Semua warna ada di [`src/index.css`](src/index.css). Jangan menulis warna heksadesimal langsung di komponen, kecuali warna avatar orang.

| Token | Light | Dark | Dipakai untuk |
| --- | --- | --- | --- |
| `bg` | `#F1F2F4` | `#0E0F11` | latar halaman |
| `surface` | `#FFFFFF` | `#1A1B1F` | kartu, sheet, bar bawah |
| `surface-2` | `#F1F2F4` | `#24252A` | isian form, tombol sekunder |
| `ink` | `#111215` | `#F4F5F7` | teks utama, tombol utama |
| `muted` | `#5B5E66` | `#A3A6AE` | teks sekunder (kontras ≥ 4,5:1 di `bg` dan `surface`) |
| `line` | `#E3E4E8` | `#2E3036` | garis pemisah, border |
| `danger` | `#C2361F` | `#FF6B57` | hapus, pesanan tanpa pemilik |

Radius: 12 px untuk kontrol, 16 px untuk kartu, 24 px untuk sheet dan bar bawah.

## Tipografi

- Satu keluarga: **Plus Jakarta Sans**, dirancang untuk Jakarta, cocok untuk produk lokal.
- Judul langkah 26 px / 700 / tracking −0,02 em, memakai `text-wrap: balance`.
- Teks isi 15–16 px. Teks sekunder memakai `muted`, bukan teks yang diperkecil dan dipudarkan sekaligus.
- Semua angka uang memakai `tabular-nums` supaya rata kanan dan tidak bergeser saat berubah.

## Motion

Token ada di [`src/ui/motion.ts`](src/ui/motion.ts). Jangan menulis durasi, easing, atau nilai spring langsung di komponen.

- Motion hanya untuk **umpan balik** (tombol ditekan, item masuk/keluar), **kesinambungan** (pindah langkah, pill langkah aktif), dan **satu momen utama**.
- Momen utamanya: struk di langkah Hasil **tercetak** dari atas ke bawah saat pertama kali muncul untuk isi tagihan itu. Tidak ada confetti.
- Transisi rutin 150–200 ms dengan ease-out. Tidak ada bounce, tidak ada animasi yang berulang terus.
- `prefers-reduced-motion`: gerakan dihilangkan, perubahan opacity dan state tetap ada.

## Ilustrasi dan logo

- Ilustrasi berupa garis tunggal 2 px dengan ujung membulat, berwarna `muted`, dan diam. Gaya garisnya sama dengan ikon Lucide supaya ikon dan ilustrasi terasa satu sistem.
- Logo berupa struk yang terbelah dua, tanpa wajah atau maskot. Sumbernya [`public/logo.svg`](public/logo.svg). Ikon PWA dibuat ulang dengan `npm run icons`.
- Ikon hanya dari Lucide. Emoji tidak dipakai sebagai ikon di UI.

## Copy

- Bahasa Indonesia santai tapi jelas, tanpa emoji di UI.
- Tombol menyebut aksinya: "Tambah pesanan", "Lihat hasil", "Bagikan".
- Placeholder hanya contoh. Label tetap ditulis di atas isian atau lewat `aria-label`.
- Untuk aksi yang menghapus, pakai Urungkan, bukan dialog konfirmasi.

## Jangan

Hal-hal ini sengaja dibuang dari desain lama. Jangan dikembalikan:

- Label kecil di atas judul ("LANGKAH 1").
- Aksen serif miring di judul.
- Latar beige hangat ala template.
- Kartu statistik besar (angka raksasa, label kecil, kartu warna di bawahnya).
- Blob atau ilustrasi yang melayang dan berdenyut terus-menerus, termasuk confetti.
- `backdrop-blur` sebagai hiasan.
- Kartu di dalam kartu.
- Glyph atau emoji sebagai pengganti ikon ("✓", "👀").

## Cara mengecek

1. `npm run test:e2e` untuk alur pengguna.
2. Lihat setiap langkah di lebar 320 px dan 390 px, mode terang dan gelap.
3. Kontras teks ≥ 4,5:1 dan target sentuh ≥ 40 px.
