import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-bold text-ink">
            Jadwal<span className="text-track">Gerak</span>
          </p>
          <p className="mt-1 max-w-sm">
            Informasi jadwal event olahraga di Indonesia: lari, trail run, gowes, renang, dan turnamen komunitas.
          </p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <Link href="/tentang" className="font-semibold text-track hover:underline">
            Tentang &amp; Disclaimer
          </Link>
          <p>© {new Date().getFullYear()} Jadwal Gerak. Data event bersifat contoh/fiktif.</p>
        </div>
      </Container>
    </footer>
  );
}
