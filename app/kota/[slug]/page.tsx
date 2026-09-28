import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import EventCard from "@/components/event/EventCard";
import { getAllCities, getCityBySlug, getEventsByCity } from "@/lib/data";

export async function generateStaticParams() {
  return getAllCities().map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  return { title: `Event di ${city.name}` };
}

export default async function KotaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const events = getEventsByCity(slug);

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Event di {city.name}</h1>
      <p className="mb-6 mt-1 text-muted">
        {events.length} event ditemukan di {city.name}, {city.province}.
      </p>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center text-muted">
          Belum ada event di kota ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      )}
    </Container>
  );
}
