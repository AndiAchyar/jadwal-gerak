import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/event/StatusBadge";
import Countdown from "@/components/event/Countdown";
import PriceList from "@/components/event/PriceList";
import EventActions from "@/components/event/EventActions";
import { getAllEvents, getCityBySlug, getEventBySlug, getSportBySlug } from "@/lib/data";
import { formatTanggalWaktu } from "@/lib/date";

export async function generateStaticParams() {
  return getAllEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.description,
  };
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 font-medium text-ink">{value}</p>
    </div>
  );
}

function buildTimeline(event: NonNullable<ReturnType<typeof getEventBySlug>>) {
  const earlyBirdUntils = Array.from(
    new Set(
      event.categories.flatMap((c) => c.fees.map((f) => f.until)).filter((v): v is string => Boolean(v))
    )
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const items = [
    { label: "Pendaftaran Dibuka", value: event.registrationOpen },
    earlyBirdUntils[0] ? { label: "Akhir Early Bird", value: earlyBirdUntils[0] } : null,
    { label: "Batas Pendaftaran", value: event.registrationDeadline },
    event.racePack ? { label: "Pengambilan Race Pack", value: event.racePack.date } : null,
    { label: "Hari-H", value: event.startDateTime },
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return items.sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime());
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const sport = getSportBySlug(event.sport);
  const city = getCityBySlug(event.city);
  const timeline = buildTimeline(event);

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-2xl border border-line bg-paper">
            {event.poster ? (
              <Image
                src={event.poster}
                alt={event.title}
                width={1024}
                height={1536}
                className="h-auto max-h-[32rem] w-auto object-contain"
              />
            ) : (
              <div className="text-center">
                <p className="font-display text-2xl font-extrabold text-track">{sport?.name}</p>
                {event.categories.some((c) => c.distanceKm !== undefined) && (
                  <p className="mt-1 text-sm text-muted">
                    {event.categories
                      .filter((c) => c.distanceKm !== undefined)
                      .map((c) => `${c.distanceKm} km`)
                      .join(" · ")}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <StatusBadge event={event} className="mb-3" />
            <h1 className="font-display text-3xl font-bold text-ink">{event.title}</h1>
            <p className="mt-1 text-muted">Diselenggarakan oleh {event.organizer}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-muted">Menuju hari-H</p>
            <Countdown targetIso={event.startDateTime} />
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-4">
            <InfoItem label="Olahraga" value={sport?.name ?? "-"} />
            <InfoItem label="Tanggal & Jam" value={formatTanggalWaktu(event.startDateTime)} />
            <InfoItem label="Kota" value={city?.name ?? "-"} />
            <InfoItem label="Venue" value={event.venue} />
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl font-bold text-ink">Kategori &amp; Biaya</h2>
            <PriceList categories={event.categories} />
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl font-bold text-ink">Timeline</h2>
            <ol className="flex flex-col gap-4 border-l-2 border-line pl-4">
              {timeline.map((item) => (
                <li key={item.label} className="relative">
                  <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-track" />
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="text-sm text-muted">{formatTanggalWaktu(item.value)}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl font-bold text-ink">Fasilitas Peserta</h2>
            <ul className="flex flex-wrap gap-2">
              {event.facilities.map((facility) => (
                <li key={facility}>
                  <Badge tone="outline">{facility}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl font-bold text-ink">Deskripsi</h2>
            <p className="leading-relaxed text-ink">{event.description}</p>
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl font-bold text-ink">Peraturan</h2>
            <ul className="list-inside list-disc space-y-1 text-ink">
              {event.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside>
          <div className="sticky top-20 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
            <EventActions event={event} />
            {event.instagramUrl && (
              <a
                href={event.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm font-semibold text-track hover:underline"
              >
                Instagram penyelenggara →
              </a>
            )}
          </div>
        </aside>
      </div>
    </Container>
  );
}
