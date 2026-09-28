import Link from "next/link";
import Image from "next/image";
import type { SportEvent } from "@/lib/types";
import { formatTanggal } from "@/lib/date";
import { DISTANCE_BUCKET_LABEL, getCityBySlug, getDistanceBucket, getSportBySlug } from "@/lib/data";
import StatusBadge from "@/components/event/StatusBadge";
import EventCardPrice from "@/components/event/EventCardPrice";
import Badge from "@/components/ui/Badge";

export default function EventCard({ event }: { event: SportEvent }) {
  const sport = getSportBySlug(event.sport);
  const city = getCityBySlug(event.city);
  const jarakChips = Array.from(
    new Set(
      event.categories
        .filter((c) => c.distanceKm !== undefined)
        .map((c) => getDistanceBucket(c.distanceKm as number))
    )
  );

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-md"
    >
      <div className="flex h-32 items-center justify-center bg-paper text-center">
        {event.poster ? (
          <Image src={event.poster} alt={event.title} width={400} height={200} className="h-full w-full object-cover" />
        ) : (
          <div className="px-4">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-track">{sport?.name}</p>
            {jarakChips.length > 0 && (
              <p className="text-xs text-muted">{jarakChips.map((b) => DISTANCE_BUCKET_LABEL[b]).join(" · ")}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <StatusBadge event={event} className="self-start" />
        <h3 className="font-display text-base font-bold text-ink group-hover:text-track">{event.title}</h3>
        <p className="text-sm text-muted">{formatTanggal(event.startDateTime)}</p>
        <p className="text-sm text-muted">{city?.name}</p>
        {jarakChips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {jarakChips.map((b) => (
              <Badge key={b} tone="outline">
                {DISTANCE_BUCKET_LABEL[b]}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto pt-2">
          <EventCardPrice event={event} />
        </div>
      </div>
    </Link>
  );
}
