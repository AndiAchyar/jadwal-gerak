import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Tentang",
};

export default function TentangPage() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="mb-4 font-display text-2xl font-bold text-ink">Tentang Jadwal Gerak</h1>
      <div className="flex flex-col gap-4 text-ink">
        <p>
          Jadwal Gerak adalah website informasi jadwal event olahraga di Indonesia, mulai dari fun run, maraton,
          trail run, gowes, renang, hingga turnamen komunitas seperti futsal dan bulu tangkis. Tujuan kami adalah
          memudahkan pencinta olahraga menemukan event yang sesuai dengan lokasi, jenis olahraga, jarak, dan
          anggaran mereka dalam satu tempat.
        </p>
        <p>
          Pada tahap ini, Jadwal Gerak menampilkan data event secara statis dan belum mendukung pendaftaran akun,
          login, maupun pengiriman event oleh penyelenggara secara mandiri. Fitur-fitur tersebut direncanakan untuk
          tahap pengembangan berikutnya.
        </p>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-2 font-display text-lg font-bold text-ink">Disclaimer</h2>
          <p className="text-sm text-muted">
            Jadwal, harga, dan kuota event yang ditampilkan di situs ini dapat berubah sewaktu-waktu tanpa
            pemberitahuan terlebih dahulu. Pengunjung disarankan untuk selalu mengecek kanal resmi penyelenggara
            (situs pendaftaran resmi atau akun Instagram terkait) sebelum melakukan pendaftaran atau mengambil
            keputusan berdasarkan informasi di situs ini.
          </p>
        </div>
      </div>
    </Container>
  );
}
