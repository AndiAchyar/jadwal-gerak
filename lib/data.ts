import eventData from "@/data/event.json";
import olahragaData from "@/data/olahraga.json";
import kotaData from "@/data/kota.json";
import type { City, DistanceBucket, SortOrder, Sport, SportEvent } from "@/lib/types";
import { getCurrentFee, getStatus, isPendaftaranAktif } from "@/lib/date";

const events = eventData as SportEvent[];
const sports = olahragaData as Sport[];
const cities = kotaData as City[];

const DAY_MS = 24 * 60 * 60 * 1000;

export function getAllEvents(): SportEvent[] {
  return events;
}

export function getEventBySlug(slug: string): SportEvent | undefined {
  return events.find((e) => e.slug === slug);
}

export function getAllSports(): Sport[] {
  return sports;
}

export function getSportBySlug(slug: string): Sport | undefined {
  return sports.find((s) => s.slug === slug);
}

export function getAllCities(): City[] {
  return cities;
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getEventsBySport(slug: string): SportEvent[] {
  return events.filter((e) => e.sport === slug);
}

export function getEventsByCity(slug: string): SportEvent[] {
  return events.filter((e) => e.city === slug);
}

export function getFeaturedEvents(): SportEvent[] {
  return events.filter((e) => e.featured);
}

/** Event yang mulai dalam 7 hari ke depan, atau sedang berlangsung saat ini. */
export function getEventsThisWeek(now: Date): SportEvent[] {
  const in7Days = now.getTime() + 7 * DAY_MS;
  return events.filter((e) => {
    const status = getStatus(e, now);
    if (status === "berlangsung") return true;
    const start = new Date(e.startDateTime).getTime();
    return start >= now.getTime() && start <= in7Days;
  });
}

export function getEventsWithActiveEarlyBird(now: Date): SportEvent[] {
  return events.filter((e) =>
    e.categories.some((c) => Boolean(getCurrentFee(c, now).fee.until))
  );
}

export function getEarliestActiveEarlyBirdUntil(event: SportEvent, now: Date): Date | null {
  const untils = event.categories
    .map((c) => getCurrentFee(c, now))
    .filter((f) => f.fee.until)
    .map((f) => new Date(f.fee.until as string).getTime());
  if (untils.length === 0) return null;
  return new Date(Math.min(...untils));
}

export function getMinCurrentPrice(event: SportEvent, now: Date): number {
  return Math.min(...event.categories.map((c) => getCurrentFee(c, now).fee.price));
}

export function getDistanceBucket(km: number): DistanceBucket {
  if (km <= 5) return "5k";
  if (km <= 10) return "10k";
  if (km <= 21) return "21k";
  if (km <= 42) return "42k";
  return "ultra";
}

export const DISTANCE_BUCKET_LABEL: Record<DistanceBucket, string> = {
  "5k": "≤ 5K",
  "10k": "10K",
  "21k": "21K",
  "42k": "42K",
  ultra: "Ultra (>42K)",
};

function matchKeyword(event: SportEvent, keyword: string): boolean {
  const q = keyword.trim().toLowerCase();
  if (!q) return true;
  return (
    event.title.toLowerCase().includes(q) ||
    event.organizer.toLowerCase().includes(q) ||
    event.venue.toLowerCase().includes(q) ||
    event.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export type EventFilters = {
  keyword?: string;
  sport?: string;
  city?: string;
  month?: string;
  distance?: DistanceBucket;
  fee?: "gratis" | "berbayar";
  statusBukaSaja?: boolean;
  tampilkanLewat?: boolean;
  sort?: SortOrder;
};

export function getFilteredEvents(filters: EventFilters, now: Date): SportEvent[] {
  let result = events.slice();

  if (!filters.tampilkanLewat) {
    result = result.filter((e) => getStatus(e, now) !== "selesai");
  }
  if (filters.keyword) {
    result = result.filter((e) => matchKeyword(e, filters.keyword!));
  }
  if (filters.sport) {
    result = result.filter((e) => e.sport === filters.sport);
  }
  if (filters.city) {
    result = result.filter((e) => e.city === filters.city);
  }
  if (filters.month) {
    result = result.filter((e) => e.startDateTime.slice(0, 7) === filters.month);
  }
  if (filters.distance) {
    result = result.filter(
      (e) =>
        e.sport === "lari" &&
        e.categories.some(
          (c) => c.distanceKm !== undefined && getDistanceBucket(c.distanceKm) === filters.distance
        )
    );
  }
  if (filters.fee) {
    result = result.filter((e) => {
      const hasZero = e.categories.some((c) => getCurrentFee(c, now).fee.price === 0);
      const hasPaid = e.categories.some((c) => getCurrentFee(c, now).fee.price > 0);
      return filters.fee === "gratis" ? hasZero : hasPaid;
    });
  }
  if (filters.statusBukaSaja) {
    result = result.filter((e) => isPendaftaranAktif(getStatus(e, now)));
  }

  return sortEvents(result, filters.sort ?? "tanggal", now);
}

export function sortEvents(list: SportEvent[], order: SortOrder, now: Date): SportEvent[] {
  const sorted = list.slice();
  if (order === "deadline") {
    sorted.sort(
      (a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime()
    );
  } else if (order === "harga") {
    sorted.sort((a, b) => getMinCurrentPrice(a, now) - getMinCurrentPrice(b, now));
  } else {
    sorted.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  }
  return sorted;
}
