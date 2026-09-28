"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@/lib/useIsClient";

function diffParts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const hari = Math.floor(totalSeconds / 86400);
  const jam = Math.floor((totalSeconds % 86400) / 3600);
  const menit = Math.floor((totalSeconds % 3600) / 60);
  const detik = totalSeconds % 60;
  return { hari, jam, menit, detik };
}

export default function Countdown({ targetIso }: { targetIso: string }) {
  const isClient = useIsClient();
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!isClient) {
    return <p className="text-sm text-muted">Memuat hitung mundur…</p>;
  }

  const now = new Date();
  const target = new Date(targetIso);
  if (now.getTime() >= target.getTime()) {
    return <p className="font-display text-lg font-bold text-track">Hari-H telah tiba!</p>;
  }

  const { hari, jam, menit, detik } = diffParts(target, now);
  const items = [
    { label: "Hari", value: hari },
    { label: "Jam", value: jam },
    { label: "Menit", value: menit },
    { label: "Detik", value: detik },
  ];

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-live="off">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-14 flex-col items-center rounded-xl border border-line bg-surface px-3 py-2"
        >
          <span className="font-display text-xl font-bold text-ink">{String(item.value).padStart(2, "0")}</span>
          <span className="text-[11px] text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
