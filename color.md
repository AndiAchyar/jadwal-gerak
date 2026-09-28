# Palet Warna — Jadwal Gerak

Nuansa energik dan sporty: latar netral terang, aksen teal yang tegas, dan oranye/merah yang dipakai secara terbatas sebagai sorotan.

| Token     | Hex       | Peran                                                          |
| --------- | --------- | ---------------------------------------------------------------- |
| `paper`   | `#F6F7F4` | Latar halaman                                                    |
| `surface` | `#FFFFFF` | Latar kartu/panel                                                 |
| `ink`     | `#102A43` | Teks utama, tombol utama                                          |
| `track`   | `#0F766E` | Aksen utama, tautan, badge status "dibuka"                        |
| `start`   | `#FB923C` | Hanya sebagai LATAR sorotan (mis. label "Minggu ini"); teks selalu `ink` di atasnya |
| `urgent`  | `#B91C1C` | Hanya untuk badge "segera ditutup" dan "kuota penuh"; teks selalu putih |
| `muted`   | `#52606D` | Teks sekunder                                                     |
| `line`    | `#D9E2EC` | Border/pembatas                                                   |

## Rasio kontras (WCAG AA)

Standar AA yang dipakai: teks normal ≥ 4.5:1, teks besar (≥18px bold atau ≥24px reguler) ≥ 3:1. Dihitung dengan rumus luminance relatif WCAG.

| Pasangan                              | Rasio     | Status                          |
| -------------------------------------- | --------- | -------------------------------- |
| `ink` di atas `paper`                  | 13.59 : 1 | Lolos AAA                        |
| `ink` di atas `surface`                | 14.61 : 1 | Lolos AAA                        |
| `muted` di atas `paper`                | 6.01 : 1  | Lolos AA                         |
| `muted` di atas `surface`              | 6.46 : 1  | Lolos AA                         |
| `track` di atas `paper` (tautan)       | 5.09 : 1  | Lolos AA                         |
| `track` di atas `surface`              | 5.47 : 1  | Lolos AA                         |
| Teks putih di atas `ink` (tombol utama)| 14.61 : 1 | Lolos AAA                        |
| Teks putih di atas `track` (badge)     | 5.47 : 1  | Lolos AA                         |
| `ink` di atas `start` (label sorotan)  | 6.45 : 1  | Lolos AA                         |
| Teks putih di atas `urgent` (badge)    | 6.47 : 1  | Lolos AA                         |

## Aturan pemakaian

- `start` dan `urgent` **tidak pernah** dipakai sebagai warna teks di atas `paper`/`surface` — keduanya hanya latar blok kecil (badge/label) dengan teks kontras di atasnya.
- Status pendaftaran tidak boleh dibedakan hanya lewat warna. `StatusBadge` selalu menampilkan label teks ("Segera Dibuka", "Segera Ditutup", dst.) selain warna latarnya.
- Font judul/heading memakai `font-display` (Archivo, tebal) untuk kesan sporty; teks isi memakai `font-sans` (Plus Jakarta Sans) agar tetap mudah dibaca.
