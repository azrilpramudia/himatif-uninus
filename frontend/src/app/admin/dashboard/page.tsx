"use client";

import Image from "next/image";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { useGallery } from "@/hooks/useGallery";
import type { Event, EventStatus } from "@/types/event";

const statusLabels: Record<EventStatus, string> = {
  upcoming: "Akan datang",
  ongoing: "Berlangsung",
  completed: "Selesai",
};

const statusStyles: Record<EventStatus, string> = {
  upcoming: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  ongoing: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  completed: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal belum ditentukan";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function SummaryIcon({ type }: { type: "events" | "gallery" | "upcoming" }) {
  const paths = {
    events: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h3" />
      </>
    ),
    gallery: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
    upcoming: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[type]}
    </svg>
  );
}

function EventRow({ event }: { event: Event }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <SummaryIcon type="events" />
        </div>
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--text-body)" }}
          >
            {event.title}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {formatDate(event.start_date)}
            {event.location ? ` · ${event.location}` : ""}
          </p>
        </div>
      </div>
      <span
        className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[event.status]}`}
      >
        {statusLabels[event.status]}
      </span>
    </li>
  );
}

export default function DashboardPage() {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const {
    galleries,
    loading: galleriesLoading,
    error: galleriesError,
  } = useGallery();

  const upcomingEvents = events.filter(
    (event) => event.status === "upcoming" || event.status === "ongoing",
  );
  const recentEvents = [...events]
    .sort(
      (first, second) =>
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime(),
    )
    .slice(0, 4);

  const summaries = [
    {
      label: "Total kegiatan",
      value: events.length,
      type: "events" as const,
      href: "/admin/dashboard/events",
      note: `${events.filter((event) => event.status === "completed").length} kegiatan selesai`,
    },
    {
      label: "Foto galeri",
      value: galleries.length,
      type: "gallery" as const,
      href: "/admin/dashboard/gallery",
      note: "Koleksi dokumentasi HIMATIF",
    },
    {
      label: "Kegiatan aktif",
      value: upcomingEvents.length,
      type: "upcoming" as const,
      href: "/admin/dashboard/events",
      note: "Akan datang atau sedang berlangsung",
    },
  ];

  return (
    <div className="space-y-7">
      <section
        className="relative overflow-hidden rounded-2xl border border-primary/10 p-6 shadow-sm sm:p-8"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/himatif-logo.png"
              alt=""
              width={72}
              height={72}
              className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-18 sm:w-18"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Panel pengelola
              </p>
              <h1
                className="mt-1 text-2xl font-bold sm:text-3xl"
                style={{ color: "var(--text-body)" }}
              >
                Selamat datang
              </h1>
              <p
                className="mt-1 max-w-xl text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Kelola kegiatan dan dokumentasi HIMATIF UNINUS dari satu tempat.
              </p>
            </div>
          </div>
          <Link
            href="/admin/dashboard/events"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Kelola kegiatan
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <section
        aria-label="Ringkasan konten"
        className="grid gap-4 sm:grid-cols-3"
      >
        {summaries.map((summary) => (
          <Link
            key={summary.label}
            href={summary.href}
            className="group rounded-xl border border-primary/10 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {summary.label}
                </p>
                <p
                  className="mt-2 text-3xl font-bold"
                  style={{ color: "var(--text-body)" }}
                >
                  {eventsLoading || galleriesLoading ? "—" : summary.value}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <SummaryIcon type={summary.type} />
              </span>
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
              {summary.note}
            </p>
          </Link>
        ))}
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        <section
          className="rounded-xl border border-primary/10 p-5 shadow-sm sm:p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--text-body)" }}
              >
                Kegiatan terbaru
              </h2>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Konten kegiatan yang terakhir ditambahkan
              </p>
            </div>
            <Link
              href="/admin/dashboard/events"
              className="shrink-0 text-xs font-semibold text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {eventsError ? (
            <p
              role="alert"
              className="rounded-lg bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400"
            >
              Gagal memuat kegiatan: {eventsError}
            </p>
          ) : eventsLoading ? (
            <div className="space-y-3" aria-label="Memuat kegiatan">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-17 animate-pulse rounded-xl bg-primary/5"
                />
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <ul className="space-y-3">
              {recentEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-primary/20 px-4 py-10 text-center">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-body)" }}
              >
                Belum ada kegiatan
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Kegiatan yang ditambahkan akan muncul di sini.
              </p>
              <Link
                href="/admin/dashboard/events"
                className="mt-4 inline-flex rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              >
                Buka pengelolaan kegiatan
              </Link>
            </div>
          )}
        </section>

        <section
          className="rounded-xl border border-primary/10 p-5 shadow-sm sm:p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="mb-5">
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--text-body)" }}
            >
              Akses cepat
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Pintasan untuk mengelola konten website
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/dashboard/events"
              className="flex items-center gap-3 rounded-xl border border-primary/10 p-4 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <SummaryIcon type="events" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block text-sm font-semibold"
                  style={{ color: "var(--text-body)" }}
                >
                  Kegiatan
                </span>
                <span
                  className="mt-1 block text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tambah dan perbarui kegiatan
                </span>
              </span>
              <span className="text-primary" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/admin/dashboard/gallery"
              className="flex items-center gap-3 rounded-xl border border-primary/10 p-4 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <SummaryIcon type="gallery" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block text-sm font-semibold"
                  style={{ color: "var(--text-body)" }}
                >
                  Galeri
                </span>
                <span
                  className="mt-1 block text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Kelola foto dokumentasi
                </span>
              </span>
              <span className="text-primary" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          {galleriesError && (
            <p
              role="alert"
              className="mt-4 text-xs text-red-600 dark:text-red-400"
            >
              Gagal memuat ringkasan galeri: {galleriesError}
            </p>
          )}

          <div
            className="mt-5 rounded-xl p-4"
            style={{ backgroundColor: "var(--bg-page)" }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Total foto dokumentasi
            </p>
            <p className="mt-1 text-xl font-bold text-primary">
              {galleriesLoading ? "—" : galleries.length}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
