import Link from "next/link";
import Container from "@/components/ui/Container";
import EventCard from "@/components/event/EventCard";
import {
  getAllCities,
  getAllSports,
  getEarliestActiveEarlyBirdUntil,
  getEventsByCity,
  getEventsBySport,
  getEventsThisWeek,
  getEventsWithActiveEarlyBird,
  getFeaturedEvents,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default function BerandaPage() {
  const now = new Date();
  const sports = getAllSports();
  const cities = getAllCities();
  const mingguIni = getEventsThisWeek(now).slice(0, 4);
  const earlyBird = getEventsWithActiveEarlyBird(now)
    .slice()
    .sort(
      (a, b) =>
        (getEarliestActiveEarlyBirdUntil(a, now)?.getTime() ?? 0) -
        (getEarliestActiveEarlyBirdUntil(b, now)?.getTime() ?? 0)
    )
    .slice(0, 4);
  const featured = getFeaturedEvents();

  return (
    <div>
      <section className="bg-surface">
        <Container className="flex flex-col gap-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Temukan jadwal event olahraga di seluruh Indonesia
            </h1>
            <p className="mt-3 text-base text-muted">
              Fun run, maraton, trail run, gowes, renang, hingga turnamen komunitas — semua jadwal, biaya, dan status
              pendaftaran dalam satu tempat.
            </p>
          </div>
          <form action="/event" method="GET" className="flex max-w-xl gap-2">
            <input
              type="search"
              name="q"
              placeholder="Cari nama event, kota, atau penyelenggara..."
              aria-label="Cari event"
              className="w-full rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-track"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/90"
            >
              Cari
            </button>
          </form>
        </Container>
      </section>

      {mingguIni.length > 0 && (
        <Container className="py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Minggu Ini</h2>
            <Link href="/event" className="text-sm font-semibold text-track hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mingguIni.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </Container>
      )}

      {earlyBird.length > 0 && (
        <Container className="py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Early Bird Segera Berakhir</h2>
            <Link href="/event" className="text-sm font-semibold text-track hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {earlyBird.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </Container>
      )}

      <Container className="py-10">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">Jelajahi per Jenis Olahraga</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sports.map((sport) => (
            <Link
              key={sport.slug}
              href={`/olahraga/${sport.slug}`}
              className="rounded-2xl border border-line bg-surface p-4 text-center transition-colors hover:border-track"
            >
              <p className="font-display font-bold text-ink">{sport.name}</p>
              <p className="text-xs text-muted">{getEventsBySport(sport.slug).length} event</p>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="py-10">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">Jelajahi per Kota</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/kota/${city.slug}`}
              className="rounded-2xl border border-line bg-surface p-4 text-center transition-colors hover:border-track"
            >
              <p className="font-display font-bold text-ink">{city.name}</p>
              <p className="text-xs text-muted">{getEventsByCity(city.slug).length} event</p>
            </Link>
          ))}
        </div>
      </Container>

      {featured.length > 0 && (
        <Container className="py-10">
          <h2 className="mb-4 font-display text-xl font-bold text-ink">Event Pilihan</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </Container>
      )}
    </div>
  );
}
