# Jadwal Gerak

Website informasi jadwal event olahraga di Indonesia (fun run, maraton, trail run, gowes, renang, triathlon,
dan turnamen komunitas). Tahap ini adalah fondasi: data statis berbasis JSON, tanpa login/database/form kirim
event.

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS v4
- Data disimpan sebagai file JSON di `data/`
- npm

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain:

```bash
npm run lint   # ESLint
npm run build  # build produksi
npm run start  # jalankan hasil build produksi
```

> Catatan: jika port 3000 sudah dipakai proses lain di komputer kamu, jalankan `npm run dev -- -p 3100`
> (ganti `3100` dengan port bebas).

## Struktur Folder

```
app/
  layout.tsx                 Navbar + Footer, lang="id", template judul
  page.tsx                   Beranda
  not-found.tsx
  event/page.tsx             Daftar event: pencarian, filter, urutan (searchParams di URL)
  event/[slug]/page.tsx      Detail event (generateStaticParams, generateMetadata, notFound)
  olahraga/[slug]/page.tsx   Event per jenis olahraga
  kota/[slug]/page.tsx       Event per kota
  kalender/page.tsx          Kalender bulanan (?bulan=YYYY-MM)
  tentang/page.tsx           Tentang + disclaimer
components/
  layout/    Navbar, Footer
  event/     EventCard, StatusBadge, Countdown, PriceList, FilterBar, MonthCalendar, dll.
             (StatusBadge, Countdown, PriceList, EventActions, EventCardPrice adalah client
             component — status, harga berlaku, dan countdown dihitung setelah mount di
             browser, bukan saat build, supaya tidak basi di halaman yang di-generate statis)
  ui/        Button, Badge, Container
data/
  event.json      14 event contoh (fiktif)
  olahraga.json   Daftar jenis olahraga
  kota.json       Daftar kota + zona waktu
lib/
  types.ts     Definisi tipe data
  data.ts      Fungsi baca/cari/filter/urutkan data event
  date.ts      Logika status pendaftaran, harga berlaku, dan format tanggal/waktu Indonesia
  useIsClient.ts  Hook kecil untuk komponen yang menghitung sesuatu hanya di client
public/images/  Aset gambar lokal (poster event, jika ada)
```

## Menambah / Mengubah Event

Edit `data/event.json`. Setiap event mengikuti tipe `SportEvent` di `lib/types.ts`. Beberapa hal penting:

### 1. Format tanggal WAJIB pakai offset zona waktu

Semua field tanggal (`startDateTime`, `endDateTime`, `registrationOpen`, `registrationDeadline`,
`racePack.date`, `fees[].until`) memakai ISO 8601 lengkap dengan offset, **bukan** `Z` (UTC):

```
"2026-11-15T05:30:00+07:00"   → WIB
"2026-11-15T05:30:00+08:00"   → WITA
"2026-11-15T05:30:00+09:00"   → WIT
```

Label WIB/WITA/WIT, penentuan bulan untuk filter kalender, dan urutan tanggal semuanya dibaca langsung dari
offset ini (lihat `lib/date.ts`), jadi jangan menuliskan waktu dalam UTC lalu mengandalkan konversi — tulis
langsung jam lokal di lokasi event beserta offset yang sesuai.

### 2. Menulis tier harga (`categories[].fees`)

`fees` adalah array tier harga yang **urut secara kronologis**. Tier yang aktif adalah tier pertama yang
field `until`-nya belum lewat (atau tier tanpa `until` sama sekali, biasanya tier terakhir/"Normal"):

```json
"fees": [
  { "label": "Early Bird", "price": 150000, "until": "2026-10-15T23:59:00+07:00" },
  { "label": "Normal", "price": 200000 }
]
```

- Harga `0` otomatis ditampilkan sebagai "Gratis".
- Tier terakhir sebaiknya tidak diberi `until`, supaya selalu ada harga yang berlaku setelah semua tier lain
  lewat.
- Boleh menambah lebih dari dua tier (mis. Early Bird → Presale → Normal), asalkan `until` diurutkan naik.

### 3. Field lain yang perlu diperhatikan

- `categories[].distanceKm` dipakai untuk filter jarak (≤5K, 10K, 21K, 42K, Ultra) — hanya efektif untuk
  event dengan `sport: "lari"`.
- `categories[].quotaStatus` diisi manual: `"tersedia" | "hampir-penuh" | "penuh"`.
- `poster` boleh dikosongkan (`""`) — kartu/detail event otomatis menampilkan placeholder nama olahraga +
  jarak. Jika diisi, taruh file gambar di `public/images/` dan gunakan path lokal (jangan pakai URL gambar
  dari internet).
- `sport` dan `city` harus sama persis dengan salah satu `slug` di `data/olahraga.json` / `data/kota.json`.
- Status pendaftaran (`segera-dibuka`, `dibuka`, `segera-ditutup`, `kuota-penuh`, `pendaftaran-ditutup`,
  `berlangsung`, `selesai`) dihitung otomatis dari kombinasi `registrationOpen`, `registrationDeadline`,
  `startDateTime`/`endDateTime`, dan `quotaStatus` semua kategori — tidak perlu diisi manual.

## Verifikasi yang Sudah Dilakukan

- `npm run lint` — tanpa error
- `npm run build` — berhasil (semua rute statis/dinamis ter-generate)
- Semua rute diuji lewat `npm run dev` / `npm run start`
- Ketujuh status pendaftaran, pergantian harga early bird → normal, filter jarak & bulan (tersimpan di URL),
  serta navigasi kalender antar bulan sudah dicek manual, termasuk tampilan di layar HP.
