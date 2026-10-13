"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import EventForm from "@/components/admin/EventForm";
import Toast from "@/components/ui/Toast";
import { eventStatusLabels } from "@/constants/adminContent";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { useToast } from "@/hooks/useToast";
import type { Event, EventStatus } from "@/types/event";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EventsDashboardPage() {
  const {
    events,
    loading,
    loadError,
    saving,
    deletingID,
    loadEvents,
    saveEvent: persistEvent,
    deleteEvent: removeEvent,
  } = useAdminEvents();
  const { toast, showToast, dismissToast } = useToast();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("id");
    return events.filter((event) => {
      const matchesQuery =
        !query ||
        [event.title, event.location, event.description]
          .join(" ")
          .toLocaleLowerCase("id")
          .includes(query);
      return (
        matchesQuery &&
        (statusFilter === "all" || event.status === statusFilter)
      );
    });
  }, [events, searchQuery, statusFilter]);

  async function saveEvent(
    values: Parameters<typeof persistEvent>[1],
    thumbnail: File | null,
  ) {
    try {
      await persistEvent(editingEvent, values, thumbnail);
      setShowForm(false);
      showToast({
        type: "success",
        message: editingEvent
          ? "Perubahan kegiatan berhasil disimpan."
          : "Kegiatan berhasil ditambahkan.",
      });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Gagal menyimpan kegiatan.",
      });
      throw error;
    }
  }

  async function deleteEvent(event: Event) {
    if (
      !window.confirm(
        `Hapus kegiatan "${event.title}"? Foto galeri yang terhubung juga akan terhapus.`,
      )
    ) {
      return;
    }

    try {
      await removeEvent(event);
      showToast({ type: "success", message: "Kegiatan berhasil dihapus." });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Gagal menghapus kegiatan.",
      });
    }
  }

  function closeForm() {
    if (!saving) {
      setShowForm(false);
      setEditingEvent(null);
    }
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={dismissToast} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Konten website
          </p>
          <h1
            className="mt-1 text-2xl font-bold"
            style={{ color: "var(--text-body)" }}
          >
            Kelola kegiatan
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Tambahkan, perbarui, dan hapus informasi kegiatan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          + Tambah kegiatan
        </button>
      </div>

      <section
        className="overflow-hidden rounded-xl border border-primary/10 shadow-sm"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {events.length > 0 && (
          <div className="flex flex-col gap-3 border-b border-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Menampilkan{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--text-body)" }}
              >
                {filteredEvents.length}
              </span>{" "}
              dari {events.length} kegiatan
            </p>
            <div className="grid gap-2 sm:flex">
              <label className="sr-only" htmlFor="event-search">
                Cari kegiatan
              </label>
              <input
                id="event-search"
                type="search"
                value={searchQuery}
                onChange={(inputEvent) => setSearchQuery(inputEvent.target.value)}
                placeholder="Cari nama, lokasi..."
                className="h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:w-64"
              />
              <label className="sr-only" htmlFor="event-status-filter">
                Filter status kegiatan
              </label>
              <select
                id="event-status-filter"
                value={statusFilter}
                onChange={(inputEvent) =>
                  setStatusFilter(inputEvent.target.value as EventStatus | "all")
                }
                className="h-10 rounded-lg border border-primary/15 bg-transparent px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="all">Semua status</option>
                {Object.entries(eventStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3 p-5" aria-label="Memuat kegiatan">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-primary/5"
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="p-6">
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              Gagal memuat kegiatan: {loadError}
            </p>
            <button
              type="button"
              onClick={() => void loadEvents()}
              className="mt-3 text-sm font-semibold text-primary"
            >
              Coba lagi
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-semibold" style={{ color: "var(--text-body)" }}>
              Belum ada kegiatan
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Tambahkan kegiatan pertama untuk ditampilkan di website.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-semibold" style={{ color: "var(--text-body)" }}>
              Tidak ada kegiatan yang cocok
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Coba ubah kata kunci atau filter status.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-4 rounded-lg border border-primary/20 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Hapus filter
            </button>
          </div>
        ) : (
          <div className="divide-y divide-primary/10">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
              >
                {event.thumbnail ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${event.thumbnail}`}
                    alt=""
                    className="h-20 w-full rounded-lg object-cover sm:w-32"
                  />
                ) : (
                  <div className="flex h-20 w-full items-center justify-center rounded-lg bg-primary/5 text-xs text-primary/70 sm:w-32">
                    Tanpa gambar
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2
                    className="truncate font-semibold"
                    style={{ color: "var(--text-body)" }}
                  >
                    {event.title}
                  </h2>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatDate(event.start_date)} – {formatDate(event.end_date)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  {event.description && (
                    <p
                      className="mt-2 line-clamp-2 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {eventStatusLabels[event.status] ?? event.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(event);
                      setShowForm(true);
                    }}
                    className="rounded-lg border border-primary/20 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingID === event.id}
                    onClick={() => void deleteEvent(event)}
                    className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                  >
                    {deletingID === event.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {showForm && (
          <EventForm
            key={editingEvent?.id ?? "new"}
            event={editingEvent}
            saving={saving}
            onCancel={closeForm}
            onSave={saveEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
