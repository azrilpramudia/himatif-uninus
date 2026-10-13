"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { Event, EventStatus, EventsResponse } from "@/types/event";

type EventFormValues = {
  title: string;
  description: string;
  content: string;
  location: string;
  status: EventStatus;
  start_date: string;
  end_date: string;
};

type EventFormProps = {
  event: Event | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (values: EventFormValues, thumbnail: File | null) => Promise<void>;
};

const statusLabels: Record<EventStatus, string> = {
  upcoming: "Akan datang",
  ongoing: "Berlangsung",
  completed: "Selesai",
};

function toLocalDateTime(value?: string): string {
  if (!value) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  }

  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function EventForm({ event, saving, onCancel, onSave }: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>({
    title: event?.title ?? "",
    description: event?.description ?? "",
    content: event?.content ?? "",
    location: event?.location ?? "",
    status: event?.status ?? "upcoming",
    start_date: toLocalDateTime(event?.start_date),
    end_date: toLocalDateTime(event?.end_date),
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(formData: React.FormEvent<HTMLFormElement>) {
    formData.preventDefault();
    setFormError(null);

    if (
      !values.start_date ||
      !values.end_date ||
      new Date(values.end_date) < new Date(values.start_date)
    ) {
      setFormError("Tanggal selesai harus sama atau setelah tanggal mulai.");
      return;
    }

    try {
      await onSave(values, thumbnail);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal menyimpan kegiatan.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-primary/10 shadow-xl sm:max-h-[calc(100dvh-2rem)]"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="shrink-0 border-b border-primary/10 px-5 py-4 sm:px-6">
          <h2
            id="event-form-title"
            className="text-lg font-bold"
            style={{ color: "var(--text-body)" }}
          >
            {event ? "Edit kegiatan" : "Tambah kegiatan"}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Lengkapi informasi kegiatan.
          </p>
        </div>

        <form
          id="event-form"
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 sm:px-6"
          onSubmit={submit}
        >
          <label className="block text-sm font-medium">
            <span>Nama kegiatan *</span>
            <input
              required
              maxLength={200}
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              <span>Tanggal mulai *</span>
              <input
                required
                type="datetime-local"
                value={values.start_date}
                onChange={(event) => update("start_date", event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3"
              />
            </label>
            <label className="block text-sm font-medium">
              <span>Tanggal selesai *</span>
              <input
                required
                type="datetime-local"
                value={values.end_date}
                onChange={(event) => update("end_date", event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              <span>Lokasi</span>
              <input
                maxLength={200}
                value={values.location}
                onChange={(event) => update("location", event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3"
              />
            </label>
            <label className="block text-sm font-medium">
              <span>Status</span>
              <select
                value={values.status}
                onChange={(event) =>
                  update("status", event.target.value as EventStatus)
                }
                className="mt-1 h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              <span>Deskripsi singkat</span>
              <textarea
                rows={3}
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                className="mt-1 w-full rounded-lg border border-primary/15 bg-transparent px-3 py-2"
              />
            </label>

            <label className="block text-sm font-medium">
              <span>Konten lengkap</span>
              <textarea
                rows={3}
                value={values.content}
                onChange={(event) => update("content", event.target.value)}
                className="mt-1 w-full rounded-lg border border-primary/15 bg-transparent px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm font-medium">
            <span>Gambar thumbnail</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setThumbnail(event.target.files?.[0] ?? null)
              }
              className="mt-1.5 block w-full text-sm"
            />
            <span
              className="mt-1 block text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              JPG, PNG, atau WEBP; maksimal 5 MB.
              {event?.thumbnail && !thumbnail
                ? " Gambar saat ini akan tetap digunakan."
                : ""}
            </span>
          </label>

          {formError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}

        </form>
        <div className="flex shrink-0 justify-end gap-3 border-t border-primary/10 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-primary/20 px-4 py-2 text-sm font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            form="event-form"
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan kegiatan"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function EventsDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingID, setDeletingID] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetchAPI<EventsResponse>("/api/admin/events");
      setEvents(response.data ?? []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Gagal memuat kegiatan.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  async function saveEvent(values: EventFormValues, thumbnail: File | null) {
    setSaving(true);
    setActionError(null);
    try {
      let thumbnailURL = editingEvent?.thumbnail ?? "";
      if (thumbnail) {
        if (thumbnail.size > 5 * 1024 * 1024) {
          throw new Error("Ukuran gambar maksimal 5 MB.");
        }
        const formData = new FormData();
        formData.append("image", thumbnail);
        const upload = await fetchAPI<{ image_url: string }>(
          "/api/admin/upload",
          { method: "POST", body: formData },
        );
        thumbnailURL = upload.image_url;
      }

      const payload = {
        ...values,
        thumbnail: thumbnailURL,
        start_date: new Date(values.start_date).toISOString(),
        end_date: new Date(values.end_date).toISOString(),
      };
      if (editingEvent) {
        await fetchAPI(`/api/admin/events/${editingEvent.id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await fetchAPI("/api/admin/events", { method: "POST", body: payload });
      }

      setShowForm(false);
      setEditingEvent(null);
      await loadEvents();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan kegiatan.";
      setActionError(message);
      throw error;
    } finally {
      setSaving(false);
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

    setDeletingID(event.id);
    setActionError(null);
    try {
      await fetchAPI(`/api/admin/events/${event.id}`, { method: "DELETE" });
      await loadEvents();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Gagal menghapus kegiatan.",
      );
    } finally {
      setDeletingID(null);
    }
  }

  return (
    <div className="space-y-6">
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
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Tambah kegiatan
        </button>
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
          {actionError}
        </p>
      )}

      <section
        className="overflow-hidden rounded-xl border border-primary/10 shadow-sm"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {loading ? (
          <p className="p-6 text-sm" style={{ color: "var(--text-muted)" }}>
            Memuat kegiatan...
          </p>
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
        ) : (
          <div className="divide-y divide-primary/10">
            {events.map((event) => (
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
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatDate(event.start_date)} – {formatDate(event.end_date)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--text-muted)" }}>
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {statusLabels[event.status] ?? event.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(event);
                      setShowForm(true);
                    }}
                    className="rounded-lg border border-primary/20 px-3 py-2 text-xs font-semibold text-primary"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingID === event.id}
                    onClick={() => void deleteEvent(event)}
                    className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                  >
                    {deletingID === event.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <EventForm
          key={editingEvent?.id ?? "new"}
          event={editingEvent}
          saving={saving}
          onCancel={() => {
            if (!saving) {
              setShowForm(false);
              setEditingEvent(null);
            }
          }}
          onSave={saveEvent}
        />
      )}
    </div>
  );
}
