"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { formatDateShort } from "@/lib/utils";
import type { Event } from "@/types/event";

// ===== Types =====
type FilterCategory = "All" | "upcoming" | "ongoing" | "completed";

const categories: FilterCategory[] = [
  "All",
  "upcoming",
  "ongoing",
  "completed",
];

const categoryLabel: Record<FilterCategory, string> = {
  All: "All",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

const statusColor: Record<string, string> = {
  upcoming: "#124076",
  ongoing: "#0891b2",
  completed: "#374151",
};

// ===== Event Card =====
function EventCard({ event }: { event: Event }) {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-primary/5">
        {event.thumbnail ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${event.thumbnail}`}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#124076"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.3}
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {/* Status Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold text-white capitalize"
          style={{ backgroundColor: statusColor[event.status] ?? "#124076" }}
        >
          {event.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {formatDateShort(event.start_date)}
        </p>
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--text-body)" }}
        >
          {event.title}
        </h3>
        {event.location && (
          <p
            className="text-[11px] flex items-center gap-1"
            style={{ color: "var(--text-muted)" }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </p>
        )}
        <div className="mt-auto pt-2">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-md bg-primary text-white text-[11px] font-semibold transition-all duration-200 hover:opacity-90"
          >
            Baca Selengkapnya
          </Link>
        </div>
      </div>
    </div>
  );
}

// ===== Skeleton Card =====
function SkeletonCard() {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-primary/10 animate-pulse"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <div className="w-full aspect-video bg-primary/10" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-20 rounded bg-primary/10" />
        <div className="h-4 w-full rounded bg-primary/10" />
        <div className="h-4 w-3/4 rounded bg-primary/10" />
        <div className="h-7 w-28 rounded bg-primary/10 mt-2" />
      </div>
    </div>
  );
}

// ===== Page =====
export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");

  const filtered = events.filter((event) => {
    const matchCategory =
      activeCategory === "All" || event.status === activeCategory;
    const matchSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div
      className="flex flex-col min-h-screen pt-16"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* ===== Header ===== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-6">
          <h1
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ color: "var(--text-body)" }}
          >
            Kegiatan
          </h1>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Cari kegiatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-4 pr-10 rounded-full border text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-body)",
                borderColor: "rgba(18, 64, 118, 0.2)",
              }}
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <span
              className="text-xs mr-1"
              style={{ color: "var(--text-muted)" }}
            >
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 capitalize"
                style={{
                  backgroundColor:
                    activeCategory === cat ? "#124076" : "transparent",
                  color:
                    activeCategory === cat ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {categoryLabel[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Grid ===== */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Data */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-20 gap-3"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-sm">Tidak ada kegiatan ditemukan</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
