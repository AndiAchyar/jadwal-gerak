"use client";

import type { SportEvent } from "@/lib/types";
import { getStatus, isPendaftaranAktif } from "@/lib/date";
import { getCityBySlug } from "@/lib/data";
import { useIsClient } from "@/lib/useIsClient";
import { LinkButton } from "@/components/ui/Button";

export default function EventActions({ event }: { event: SportEvent }) {
  const isClient = useIsClient();
  const aktif = isClient && isPendaftaranAktif(getStatus(event, new Date()));
  const city = getCityBySlug(event.city);
  const mapsQuery = encodeURIComponent(`${event.venue}, ${city?.name ?? ""}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="flex flex-col gap-3">
      <LinkButton
        href={event.registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        disabled={!aktif}
        className="w-full"
      >
        {aktif ? "Daftar Sekarang" : "Pendaftaran Tidak Tersedia"}
      </LinkButton>
      <LinkButton href={mapsUrl} target="_blank" rel="noopener noreferrer" variant="outline" className="w-full">
        Lihat Lokasi
      </LinkButton>
    </div>
  );
}
