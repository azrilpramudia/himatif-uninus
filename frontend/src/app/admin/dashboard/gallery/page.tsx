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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingID, setDeletingID] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<GalleryCategory | "all">(
    "all",
  );

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

  const filteredGalleries = galleries.filter((gallery) => {
    const query = searchQuery.trim().toLocaleLowerCase("id");
    const linkedEvent =
      gallery.event?.title ??
      events.find((event) => event.id === gallery.event_id)?.title ??
      "";
    const matchesQuery =
      !query ||
      [gallery.title, linkedEvent, categoryLabels[gallery.category]]
        .join(" ")
        .toLocaleLowerCase("id")
        .includes(query);
    return (
      matchesQuery &&
      (categoryFilter === "all" || gallery.category === categoryFilter)
    );
  });

  async function saveGallery(
    values: { title: string; category: GalleryCategory; event_id: string },
    image: File | null,
  ) {
    setSaving(true);
    setActionError(null);
    setActionMessage(null);
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
      setActionMessage(
        editingGallery
          ? "Perubahan foto berhasil disimpan."
          : "Foto berhasil ditambahkan ke galeri.",
      );
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
    setActionMessage(null);
    try {
      await fetchAPI(`/api/admin/galleries/${gallery.id}`, {
        method: "DELETE",
      });
      setActionMessage("Foto berhasil dihapus dari galeri.");
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
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          + Tambah foto
        </button>
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
          {actionError}
        </p>
      )}
      {actionMessage && (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300"
        >
          {actionMessage}
        </p>
      )}

      {loading ? (
        <section
          aria-label="Memuat galeri"
          className="grid gap-4 rounded-xl border border-primary/10 p-4 sm:grid-cols-2 xl:grid-cols-3"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-3">
              <div className="h-52 animate-pulse rounded-lg bg-primary/5" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-primary/5" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-primary/5" />
            </div>
          ))}
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
        <>
          <section
            className="mb-4 flex flex-col gap-3 rounded-xl border border-primary/10 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Menampilkan{" "}
              <span className="font-semibold" style={{ color: "var(--text-body)" }}>
                {filteredGalleries.length}
              </span>{" "}
              dari {galleries.length} foto
            </p>
            <div className="grid gap-2 sm:flex">
              <label className="sr-only" htmlFor="gallery-search">
                Cari foto galeri
              </label>
              <input
                id="gallery-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari judul atau kegiatan..."
                className="h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:w-64"
              />
              <label className="sr-only" htmlFor="gallery-category-filter">
                Filter kategori galeri
              </label>
              <select
                id="gallery-category-filter"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value as GalleryCategory | "all",
                  )
                }
                className="h-10 rounded-lg border border-primary/15 bg-transparent px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="all">Semua kategori</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </section>
          {filteredGalleries.length === 0 ? (
            <section
              className="rounded-xl border border-dashed border-primary/20 p-12 text-center"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <p className="font-semibold" style={{ color: "var(--text-body)" }}>
                Tidak ada foto yang cocok
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                Coba ubah kata kunci atau kategori.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
                className="mt-4 rounded-lg border border-primary/20 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Hapus filter
              </button>
            </section>
          ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredGalleries.map((gallery) => (
            <article
              key={gallery.id}
              className="overflow-hidden rounded-xl border border-primary/10 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
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
                    className="flex-1 rounded-lg border border-primary/20 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingID === gallery.id}
                    onClick={() => void deleteGallery(gallery)}
                    className="flex-1 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                  >
                    {deletingID === gallery.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
          )}
        </>
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
