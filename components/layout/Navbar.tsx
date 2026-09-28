"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "@/components/ui/Container";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/event", label: "Event" },
  { href: "/kalender", label: "Kalender" },
  { href: "/tentang", label: "Tentang" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight text-ink">
          Jadwal<span className="text-track">Gerak</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  active ? "text-track" : "text-ink hover:text-track"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Buka menu navigasi"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink sm:hidden"
        >
          <span className="sr-only">Menu</span>
          {open ? "✕" : "☰"}
        </button>
      </Container>

      {open && (
        <nav className="border-t border-line bg-surface sm:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    active ? "bg-track/10 text-track" : "text-ink hover:bg-paper"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </Container>
        </nav>
      )}
    </header>
  );
}
