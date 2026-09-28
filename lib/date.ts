import type { EventCategory, EventStatus, Fee, SportEvent } from "@/lib/types";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function getOffsetMinutes(iso: string): number {
  const match = iso.match(/([+-])(\d{2}):(\d{2})$/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);
  return sign * (hours * 60 + minutes);
}

function getIanaTimeZone(iso: string): string {
  const offset = getOffsetMinutes(iso);
  if (offset === 8 * 60) return "Asia/Makassar";
  if (offset === 9 * 60) return "Asia/Jayapura";
  return "Asia/Jakarta";
}

export function getTimezoneLabel(iso: string): "WIB" | "WITA" | "WIT" {
  const offset = getOffsetMinutes(iso);
  if (offset === 8 * 60) return "WITA";
  if (offset === 9 * 60) return "WIT";
  return "WIB";
}

/** Bagian tanggal (tahun, bulan, hari) suatu instant, dihitung pada zona waktu offset ISO-nya sendiri. */
function zonedDateParts(date: Date, offsetMinutes: number): { y: number; m: number; d: number } {
  const shifted = new Date(date.getTime() + offsetMinutes * 60000);
  return { y: shifted.getUTCFullYear(), m: shifted.getUTCMonth(), d: shifted.getUTCDate() };
}

function daysBetween(a: Date, b: Date, offsetMinutes: number): number {
  const pa = zonedDateParts(a, offsetMinutes);
  const pb = zonedDateParts(b, offsetMinutes);
  const utcA = Date.UTC(pa.y, pa.m, pa.d);
  const utcB = Date.UTC(pb.y, pb.m, pb.d);
  return Math.round((utcB - utcA) / DAY_MS);
}

export function formatTanggal(iso: string): string {
  const date = new Date(iso);
  const timeZone = getIanaTimeZone(iso);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);
}

export function formatJam(iso: string): string {
  const date = new Date(iso);
  const timeZone = getIanaTimeZone(iso);
  const parts = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour}.${minute} ${getTimezoneLabel(iso)}`;
}

export function formatTanggalWaktu(iso: string): string {
  return `${formatTanggal(iso)}, ${formatJam(iso)}`;
}

export function formatRupiah(amount: number): string {
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "3 hari lagi" / "Besok" / "Hari ini" / "Selesai", dihitung relatif terhadap `now`. */
export function sisaWaktu(targetIso: string, now: Date): string {
  const target = new Date(targetIso);
  const offset = getOffsetMinutes(targetIso);
  const days = daysBetween(now, target, offset);
  if (days < 0) return "Selesai";
  if (days === 0) return "Hari ini";
  if (days === 1) return "Besok";
  return `${days} hari lagi`;
}

const STATUS_ORDER: EventStatus[] = [
  "segera-dibuka",
  "dibuka",
  "segera-ditutup",
  "kuota-penuh",
  "pendaftaran-ditutup",
  "berlangsung",
  "selesai",
];

export const STATUS_LABEL: Record<EventStatus, string> = {
  "segera-dibuka": "Segera Dibuka",
  dibuka: "Pendaftaran Dibuka",
  "segera-ditutup": "Segera Ditutup",
  "kuota-penuh": "Kuota Penuh",
  "pendaftaran-ditutup": "Pendaftaran Ditutup",
  berlangsung: "Sedang Berlangsung",
  selesai: "Selesai",
};

export function getStatus(event: SportEvent, now: Date): EventStatus {
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime ?? new Date(start.getTime() + 12 * HOUR_MS));
  const registrationOpen = new Date(event.registrationOpen);
  const registrationDeadline = new Date(event.registrationDeadline);

  if (now.getTime() > end.getTime()) return "selesai";
  if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) return "berlangsung";
  if (now.getTime() < registrationOpen.getTime()) return "segera-dibuka";

  const semuaPenuh = event.categories.every((c) => c.quotaStatus === "penuh");
  if (semuaPenuh) return "kuota-penuh";

  if (now.getTime() > registrationDeadline.getTime()) return "pendaftaran-ditutup";
  if (registrationDeadline.getTime() - now.getTime() <= 7 * DAY_MS) return "segera-ditutup";

  return "dibuka";
}

export function isPendaftaranAktif(status: EventStatus): boolean {
  return status === "dibuka" || status === "segera-ditutup";
}

export function getCurrentFee(
  category: EventCategory,
  now: Date
): { fee: Fee; message?: string } {
  const current =
    category.fees.find((fee) => !fee.until || new Date(fee.until).getTime() >= now.getTime()) ??
    category.fees[category.fees.length - 1];

  if (current.until) {
    const sisa = sisaWaktu(current.until, now);
    const label = sisa === "Hari ini" ? "berakhir hari ini" : sisa === "Besok" ? "berakhir besok" : `berakhir ${sisa}`;
    return { fee: current, message: `${current.label} ${label}` };
  }
  return { fee: current };
}

export { STATUS_ORDER };
