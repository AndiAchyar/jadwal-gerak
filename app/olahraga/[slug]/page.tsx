import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import EventCard from "@/components/event/EventCard";
import { getAllSports, getEventsBySport, getSportBySlug } from "@/lib/data";

export async function generateStaticParams() {
  return getAllSports().map((sport) => ({ slug: sport.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sport = getSportBySlug(slug);
  if (!sport) return {};
  return { title: `Event ${sport.name}` };
}

export default async function OlahragaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sport = getSportBySlug(slug);
  if (!sport) notFound();

  const events = getEventsBySport(slug);

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Event {sport.name}</h1>
      <p className="mb-6 mt-1 text-muted">{events.length} event ditemukan untuk kategori {sport.name}.</p>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center text-muted">
          Belum ada event untuk jenis olahraga ini.
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
