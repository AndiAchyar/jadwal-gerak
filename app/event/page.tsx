import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import EventCard from "@/components/event/EventCard";
import FilterBar from "@/components/event/FilterBar";
import { getFilteredEvents, type EventFilters } from "@/lib/data";
import type { DistanceBucket, SortOrder } from "@/lib/types";

export const metadata: Metadata = {
  title: "Daftar Event",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getParam(params: Awaited<SearchParams>, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function EventListPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const filters: EventFilters = {
    keyword: getParam(params, "q"),
    sport: getParam(params, "olahraga"),
    city: getParam(params, "kota"),
    month: getParam(params, "bulan"),
    distance: getParam(params, "jarak") as DistanceBucket | undefined,
    fee: getParam(params, "biaya") as "gratis" | "berbayar" | undefined,
    statusBukaSaja: getParam(params, "buka") === "1",
    tampilkanLewat: getParam(params, "lewat") === "1",
    sort: (getParam(params, "urutan") as SortOrder | undefined) ?? "tanggal",
  };

  const results = getFilteredEvents(filters, new Date());

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Daftar Event</h1>
      <p className="mb-6 mt-1 text-muted">Temukan event olahraga sesuai jenis, kota, dan waktu yang kamu inginkan.</p>

      <FilterBar />

      <p className="mb-4 mt-6 text-sm font-semibold text-ink">{results.length} event ditemukan</p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center text-muted">
          Tidak ada event yang cocok dengan filter kamu. Coba ubah kata kunci atau filter lainnya.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      )}
    </Container>
  );
}
