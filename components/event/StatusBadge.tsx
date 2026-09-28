"use client";

import type { SportEvent, EventStatus } from "@/lib/types";
import { getStatus, STATUS_LABEL } from "@/lib/date";
import { useIsClient } from "@/lib/useIsClient";
import Badge, { type BadgeTone } from "@/components/ui/Badge";

const STATUS_TONE: Record<EventStatus, BadgeTone> = {
  "segera-dibuka": "outline",
  dibuka: "track",
  "segera-ditutup": "urgent",
  "kuota-penuh": "urgent",
  "pendaftaran-ditutup": "outline",
  berlangsung: "start",
  selesai: "outline",
};

export default function StatusBadge({ event, className }: { event: SportEvent; className?: string }) {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <Badge tone="outline" className={className}>
        Memuat status…
      </Badge>
    );
  }

  const status: EventStatus = getStatus(event, new Date());

  return (
    <Badge tone={STATUS_TONE[status]} className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
