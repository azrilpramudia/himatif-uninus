"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { Event, EventsResponse } from "@/types/event";
import type {
  GalleriesResponse,
  Gallery,
  GalleryCategory,
} from "@/types/gallery";

type GalleryFormProps = {
  gallery: Gallery | null;
  events: Event[];
  saving: boolean;
  onCancel: () => void;
  onSave: (
    values: { title: string; category: GalleryCategory; event_id: string },
    image: File | null,
  ) => Promise<void>;
};

const categoryLabels: Record<GalleryCategory, string> = {
  kegiatan: "Kegiatan",
  prestasi: "Prestasi",
  organisasi: "Organisasi",
  lainnya: "Lainnya",
};

function GalleryForm({
  gallery,
  events,
  saving,
  onCancel,
  onSave,
}: GalleryFormProps) {
  const [title, setTitle] = useState(gallery?.title ?? "");
  const [category, setCategory] = useState<GalleryCategory>(
    gallery?.category ?? "lainnya",
  );
  const [eventID, setEventID] = useState(gallery?.event_id ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setFormError(null);
    if (!gallery && !image) {
      setFormError("Pilih gambar untuk item galeri.");
      return;
    }

    try {
      await onSave({ title: title.trim(), category, event_id: eventID }, image);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal menyimpan foto.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:items-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-form-title"
        className="my-6 w-full max-w-xl rounded-2xl border border-primary/10 p-6 shadow-xl sm:p-8"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <h2
          id="gallery-form-title"
          className="text-xl font-bold"
          style={{ color: "var(--text-body)" }}
        >
          {gallery ? "Edit foto galeri" : "Tambah foto galeri"}
        </h2>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium">
            <span>Judul foto *</span>
            <input
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-primary/15 bg-transparent px-3"
            />
          </label>

          <label className="block text-sm font-medium">
            <span>Kategori *</span>
            <select
              required
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as GalleryCategory)
              }
              className="mt-1.5 h-11 w-full rounded-lg border border-primary/15 bg-transparent px-3"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            <span>Kaitkan dengan kegiatan</span>
            <select
              value={eventID}
              onChange={(event) => setEventID(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-primary/15 bg-transparent px-3"
            >
              <option value="">Tidak dikaitkan</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            <span>Gambar {gallery ? "(opsional)" : "*"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={!gallery}
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              className="mt-1.5 block w-full text-sm"
            />
            <span className="mt-1 block text-xs" style={{ color: "var(--text-muted)" }}>
              JPG, PNG, atau WEBP; maksimal 5 MB.
              {gallery && !image ? " Gambar saat ini akan tetap digunakan." : ""}
            </span>
          </label>

          {formError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border border-primary/20 px-4 py-2.5 text-sm font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan foto"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function GalleryDashboardPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingID, setDeletingID] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [galleryResponse, eventResponse] = await Promise.all([
        fetchAPI<GalleriesResponse>("/api/admin/galleries"),
        fetchAPI<EventsResponse>("/api/admin/events"),
      ]);
      setGalleries(galleryResponse.data ?? []);
      setEvents(eventResponse.data ?? []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Gagal memuat galeri.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  async function saveGallery(
    values: { title: string; category: GalleryCategory; event_id: string },
    image: File | null,
  ) {
    setSaving(true);
    setActionError(null);
    try {
      let imageURL = editingGallery?.image_url ?? "";
      if (image) {
        if (image.size > 5 * 1024 * 1024) {
          throw new Error("Ukuran gambar maksimal 5 MB.");
        }
        const formData = new FormData();
        formData.append("image", image);
        const upload = await fetchAPI<{ image_url: string }>(
          "/api/admin/upload",
          { method: "POST", body: formData },
        );
        imageURL = upload.image_url;
      }

      const payload = { ...values, image_url: imageURL };
      if (editingGallery) {
        await fetchAPI(`/api/admin/galleries/${editingGallery.id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await fetchAPI("/api/admin/galleries", {
          method: "POST",
          body: payload,
        });
      }

      setShowForm(false);
      setEditingGallery(null);
      await loadContent();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan foto.";
      setActionError(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function deleteGallery(gallery: Gallery) {
    if (!window.confirm(`Hapus foto "${gallery.title}" dari galeri?`)) return;

    setDeletingID(gallery.id);
    setActionError(null);
    try {
      await fetchAPI(`/api/admin/galleries/${gallery.id}`, {
        method: "DELETE",
      });
      await loadContent();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Gagal menghapus foto.",
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
            Kelola galeri
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Unggah dokumentasi, pilih kategori, dan kaitkan dengan kegiatan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingGallery(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Tambah foto
        </button>
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
          {actionError}
        </p>
      )}

      {loading ? (
        <section
          className="rounded-xl border border-primary/10 p-6 text-sm"
          style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}
        >
          Memuat galeri...
        </section>
      ) : loadError ? (
        <section
          className="rounded-xl border border-primary/10 p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            Gagal memuat galeri: {loadError}
          </p>
          <button
            type="button"
            onClick={() => void loadContent()}
            className="mt-3 text-sm font-semibold text-primary"
          >
            Coba lagi
          </button>
        </section>
      ) : galleries.length === 0 ? (
        <section
          className="rounded-xl border border-primary/10 p-12 text-center"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <p className="font-semibold" style={{ color: "var(--text-body)" }}>
            Galeri masih kosong
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Tambahkan foto dokumentasi pertama.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleries.map((gallery) => (
            <article
              key={gallery.id}
              className="overflow-hidden rounded-xl border border-primary/10 shadow-sm"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${gallery.image_url}`}
                alt={gallery.title}
                className="h-52 w-full bg-primary/5 object-cover"
              />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className="line-clamp-2 font-semibold"
                    style={{ color: "var(--text-body)" }}
                  >
                    {gallery.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                    {categoryLabels[gallery.category] ?? gallery.category}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {gallery.event?.title ??
                    events.find((event) => event.id === gallery.event_id)
                      ?.title ??
                    "Tidak terkait kegiatan"}
                </p>
                <div className="flex gap-2 border-t border-primary/10 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGallery(gallery);
                      setShowForm(true);
                    }}
                    className="flex-1 rounded-lg border border-primary/20 px-3 py-2 text-xs font-semibold text-primary"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingID === gallery.id}
                    onClick={() => void deleteGallery(gallery)}
                    className="flex-1 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                  >
                    {deletingID === gallery.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {showForm && (
        <GalleryForm
          key={editingGallery?.id ?? "new"}
          gallery={editingGallery}
          events={events}
          saving={saving}
          onCancel={() => {
            if (!saving) {
              setShowForm(false);
              setEditingGallery(null);
            }
          }}
          onSave={saveGallery}
        />
      )}
    </div>
  );
}
