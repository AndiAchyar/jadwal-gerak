"use client";

import type { SportEvent } from "@/lib/types";
import { formatRupiah, getCurrentFee } from "@/lib/date";
import { useIsClient } from "@/lib/useIsClient";
import Badge from "@/components/ui/Badge";

export default function EventCardPrice({ event }: { event: SportEvent }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <span className="text-sm text-muted">Memuat harga…</span>;
  }

  const now = new Date();
  const fees = event.categories.map((c) => getCurrentFee(c, now));
  const minPrice = Math.min(...fees.map((f) => f.fee.price));
  const earlyBirdAktif = fees.some((f) => f.fee.until);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-ink">Mulai {formatRupiah(minPrice)}</span>
      {earlyBirdAktif && <Badge tone="start">Early Bird</Badge>}
    </div>
  );
}
