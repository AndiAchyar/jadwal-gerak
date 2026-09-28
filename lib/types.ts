export type Sport = {
  slug: string;
  name: string;
};

export type City = {
  slug: string;
  name: string;
  province: string;
  timezone: "WIB" | "WITA" | "WIT";
};

export type QuotaStatus = "tersedia" | "hampir-penuh" | "penuh";

export type Fee = {
  label: string;
  price: number;
  until?: string;
};

export type EventCategory = {
  name: string;
  distanceKm?: number;
  fees: Fee[];
  quotaStatus: QuotaStatus;
};

export type RacePack = {
  date: string;
  location: string;
};

export type SportEvent = {
  slug: string;
  title: string;
  organizer: string;
  sport: string;
  city: string;
  venue: string;
  startDateTime: string;
  endDateTime?: string;
  registrationOpen: string;
  registrationDeadline: string;
  categories: EventCategory[];
  racePack?: RacePack;
  facilities: string[];
  description: string;
  rules: string[];
  registrationUrl: string;
  instagramUrl?: string;
  poster?: string;
  featured: boolean;
  tags: string[];
};

export type EventStatus =
  | "segera-dibuka"
  | "dibuka"
  | "segera-ditutup"
  | "kuota-penuh"
  | "pendaftaran-ditutup"
  | "berlangsung"
  | "selesai";

export type DistanceBucket = "5k" | "10k" | "21k" | "42k" | "ultra";

export type SortOrder = "tanggal" | "deadline" | "harga";
