import Link from "next/link";
import type { SportEvent } from "@/lib/types";
import { formatJam } from "@/lib/date";
import { getCityBySlug } from "@/lib/data";

const WEEKDAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function groupByDay(events: SportEvent[]): Map<number, SportEvent[]> {
  const map = new Map<number, SportEvent[]>();
  for (const event of events) {
    const day = Number(event.startDateTime.slice(8, 10));
    const list = map.get(day) ?? [];
    list.push(event);
    map.set(day, list);
  }
  return map;
}

export default function MonthCalendar({
  year,
  month,
  events,
  today,
}: {
  year: number;
  month: number;
  events: SportEvent[];
  today: Date;
}) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const leadingEmpty = (firstWeekday + 6) % 7;
  const byDay = groupByDay(events);

  const isTodayMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDate = today.getDate();

  const prevMonthDate = new Date(year, month - 2, 1);
  const nextMonthDate = new Date(year, month, 1);
  const prevHref = `?bulan=${prevMonthDate.getFullYear()}-${pad2(prevMonthDate.getMonth() + 1)}`;
  const nextHref = `?bulan=${nextMonthDate.getFullYear()}-${pad2(nextMonthDate.getMonth() + 1)}`;

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingEmpty }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const daysWithEvents = Array.from(byDay.keys()).sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link
          href={prevHref}
          className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-paper"
        >
          ← Bulan Sebelumnya
        </Link>
        <h2 className="font-display text-lg font-bold text-ink">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
        <Link
          href={nextHref}
          className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-paper"
        >
          Bulan Berikutnya →
        </Link>
      </div>

      {/* Grid untuk layar sedang ke atas */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface sm:block">
        <div className="grid grid-cols-7 border-b border-line bg-paper text-center text-xs font-semibold uppercase tracking-wide text-muted">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayEvents = day ? byDay.get(day) ?? [] : [];
            const isToday = isTodayMonth && day === todayDate;
            return (
              <div
                key={idx}
                className={`min-h-24 border-b border-r border-line p-1.5 last:border-r-0 ${
                  day === null ? "bg-paper/60" : ""
                }`}
              >
                {day !== null && (
                  <>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday ? "bg-track text-white" : "text-ink"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="mt-1 flex flex-col gap-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <Link
                          key={event.slug}
                          href={`/event/${event.slug}`}
                          className="truncate rounded bg-track/10 px-1.5 py-0.5 text-[11px] font-medium text-track hover:bg-track/20"
                          title={event.title}
                        >
                          {event.title}
                        </Link>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[11px] text-muted">+{dayEvents.length - 3} lainnya</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daftar per tanggal untuk layar kecil */}
      <div className="flex flex-col gap-3 sm:hidden">
        {daysWithEvents.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
            Tidak ada event pada bulan ini.
          </p>
        )}
        {daysWithEvents.map((day) => {
          const dayEvents = byDay.get(day) ?? [];
          const isToday = isTodayMonth && day === todayDate;
          return (
            <div key={day} className="rounded-2xl border border-line bg-surface p-3">
              <p className={`mb-2 text-sm font-semibold ${isToday ? "text-track" : "text-ink"}`}>
                {day} {MONTH_NAMES[month - 1]} {year}
                {isToday && " · Hari ini"}
              </p>
              <div className="flex flex-col gap-2">
                {dayEvents.map((event) => {
                  const city = getCityBySlug(event.city);
                  return (
                    <Link
                      key={event.slug}
                      href={`/event/${event.slug}`}
                      className="rounded-lg bg-paper px-3 py-2 text-sm text-ink hover:bg-line/40"
                    >
                      <span className="font-semibold">{event.title}</span>
                      <span className="block text-xs text-muted">
                        {formatJam(event.startDateTime)} · {city?.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
