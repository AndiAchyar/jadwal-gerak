import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-track">404</p>
      <h1 className="font-display text-2xl font-bold text-ink">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-muted">
        Event atau halaman yang kamu cari mungkin sudah tidak tersedia, atau alamatnya salah ketik.
      </p>
      <Link
        href="/"
        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/90"
      >
        Kembali ke Beranda
      </Link>
    </Container>
  );
}
