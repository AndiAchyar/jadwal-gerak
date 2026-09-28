"use client";

import type { EventCategory, QuotaStatus } from "@/lib/types";
import { formatRupiah, getCurrentFee } from "@/lib/date";
import { useIsClient } from "@/lib/useIsClient";
import Badge, { type BadgeTone } from "@/components/ui/Badge";

const QUOTA_LABEL: Record<QuotaStatus, string> = {
  tersedia: "Tersedia",
  "hampir-penuh": "Hampir Penuh",
  penuh: "Penuh",
};

const QUOTA_TONE: Record<QuotaStatus, BadgeTone> = {
  tersedia: "outline",
  "hampir-penuh": "start",
  penuh: "urgent",
};

function CategoryRow({ category, now }: { category: EventCategory; now: Date }) {
  const { fee, message } = getCurrentFee(category, now);
  const otherFees = category.fees.filter((f) => f !== fee);

  return (
    <tr className="border-b border-line last:border-0">
      <td className="py-3 pr-4 font-semibold text-ink">{category.name}</td>
      <td className="py-3 pr-4 text-muted">{category.distanceKm ? `${category.distanceKm} km` : "—"}</td>
      <td className="py-3 pr-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-ink">{formatRupiah(fee.price)}</span>
          {message && <span className="text-xs text-track">{message}</span>}
          {otherFees.length > 0 && (
            <span className="text-xs text-muted line-through decoration-muted">
              {otherFees.map((f) => formatRupiah(f.price)).join(", ")}
            </span>
          )}
        </div>
      </td>
      <td className="py-3">
        <Badge tone={QUOTA_TONE[category.quotaStatus]}>{QUOTA_LABEL[category.quotaStatus]}</Badge>
      </td>
    </tr>
  );
}

export default function PriceList({ categories }: { categories: EventCategory[] }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <div className="h-32 animate-pulse rounded-xl bg-line/40" aria-label="Memuat harga" />;
  }

  const now = new Date();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="py-2 pr-4">Kategori</th>
            <th className="py-2 pr-4">Jarak</th>
            <th className="py-2 pr-4">Biaya</th>
            <th className="py-2">Kuota</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <CategoryRow key={category.name} category={category} now={now} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
