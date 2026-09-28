"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllCities, getAllSports, DISTANCE_BUCKET_LABEL } from "@/lib/data";
import type { DistanceBucket } from "@/lib/types";

const DISTANCE_OPTIONS: DistanceBucket[] = ["5k", "10k", "21k", "42k", "ultra"];

const SELECT_CLASS =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-track";

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sports = getAllSports();
  const cities = getAllCities();

  const urlKeyword = searchParams.get("q") ?? "";
  const [keyword, setKeyword] = useState(urlKeyword);
  const [syncedKeyword, setSyncedKeyword] = useState(urlKeyword);

  if (urlKeyword !== syncedKeyword) {
    setSyncedKeyword(urlKeyword);
    setKeyword(urlKeyword);
  }

  // `searchParams` dari next/navigation baru diperbarui setelah navigasi benar-benar commit,
  // jadi selama itu closure applyParams tetap membawa nilai lama. Jika beberapa filter diubah
  // sangat cepat berturut-turut (beberapa onChange dalam satu batch React, sebelum re-render
  // terjadi), membandingkan searchParams (yang masih basi di semua panggilan dalam batch yang
  // sama) langsung di dalam applyParams justru salah mendeteksi "perubahan dari luar" pada
  // setiap panggilan setelah yang pertama. Sebagai gantinya, paramsRef hanya disegarkan dari
  // searchParams di dalam useEffect (dijalankan setelah commit, bukan saat render/batch),
  // sehingga selama satu batch klik cepat, paramsRef terus terakumulasi dengan benar; begitu
  // navigasi asing (mis. tombol back/forward) benar-benar commit, effect ini menyegarkannya.
  const paramsRef = useRef(new URLSearchParams(searchParams.toString()));
  const lastSyncedRef = useRef(searchParams.toString());

  useEffect(() => {
    const current = searchParams.toString();
    if (current !== lastSyncedRef.current) {
      paramsRef.current = new URLSearchParams(current);
      lastSyncedRef.current = current;
    }
  }, [searchParams]);

  function applyParams(mutate: (params: URLSearchParams) => void) {
    mutate(paramsRef.current);
    const next = paramsRef.current.toString();
    lastSyncedRef.current = next;
    router.push(`${pathname}?${next}`);
  }

  function updateParam(key: string, value: string) {
    applyParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  function toggleParam(key: string) {
    applyParams((params) => {
      if (params.get(key) === "1") {
        params.delete(key);
      } else {
        params.set(key, "1");
      }
    });
  }

  function handleKeywordSubmit(e: FormEvent) {
    e.preventDefault();
    updateParam("q", keyword);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
      <form onSubmit={handleKeywordSubmit} className="flex gap-2">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari judul, penyelenggara, venue, atau tag..."
          aria-label="Cari event"
          className="w-full rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-track"
        />
        <button type="submit" className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          Cari
        </button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <select
          aria-label="Filter jenis olahraga"
          value={searchParams.get("olahraga") ?? ""}
          onChange={(e) => updateParam("olahraga", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Semua Olahraga</option>
          {sports.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter kota"
          value={searchParams.get("kota") ?? ""}
          onChange={(e) => updateParam("kota", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Semua Kota</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="month"
          aria-label="Filter bulan pelaksanaan"
          value={searchParams.get("bulan") ?? ""}
          onChange={(e) => updateParam("bulan", e.target.value)}
          className={SELECT_CLASS}
        />

        <select
          aria-label="Filter jarak (lari)"
          value={searchParams.get("jarak") ?? ""}
          onChange={(e) => updateParam("jarak", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Semua Jarak (Lari)</option>
          {DISTANCE_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {DISTANCE_BUCKET_LABEL[d]}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter biaya"
          value={searchParams.get("biaya") ?? ""}
          onChange={(e) => updateParam("biaya", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Semua Biaya</option>
          <option value="gratis">Gratis</option>
          <option value="berbayar">Berbayar</option>
        </select>

        <select
          aria-label="Urutkan"
          value={searchParams.get("urutan") ?? "tanggal"}
          onChange={(e) => updateParam("urutan", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="tanggal">Tanggal Terdekat</option>
          <option value="deadline">Deadline Terdekat</option>
          <option value="harga">Harga Termurah</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-ink">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={searchParams.get("buka") === "1"}
            onChange={() => toggleParam("buka")}
            className="h-4 w-4 rounded border-line accent-track"
          />
          Hanya yang masih buka pendaftaran
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={searchParams.get("lewat") === "1"}
            onChange={() => toggleParam("lewat")}
            className="h-4 w-4 rounded border-line accent-track"
          />
          Tampilkan event yang sudah lewat
        </label>
      </div>
    </div>
  );
}
