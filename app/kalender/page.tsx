import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import MonthCalendar from "@/components/event/MonthCalendar";
import { getAllEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kalender Event",
};

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  if (params.bulan && /^\d{4}-\d{2}$/.test(params.bulan)) {
    const [y, m] = params.bulan.split("-").map(Number);
    if (m >= 1 && m <= 12) {
      year = y;
      month = m;
    }
  }

  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const events = getAllEvents().filter((event) => event.startDateTime.slice(0, 7) === monthPrefix);

  return (
    <Container className="py-10">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Kalender Event</h1>
      <p className="mb-6 text-muted">Lihat jadwal event olahraga per bulan.</p>
      <MonthCalendar year={year} month={month} events={events} today={now} />
    </Container>
  );
}
