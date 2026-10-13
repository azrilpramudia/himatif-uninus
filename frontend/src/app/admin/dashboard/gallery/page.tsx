"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GalleryForm from "@/components/admin/GalleryForm";
import Toast from "@/components/ui/Toast";
import { galleryCategoryLabels } from "@/constants/adminContent";
import { useAdminGallery } from "@/hooks/useAdminGallery";
import { useToast } from "@/hooks/useToast";
import type { Gallery, GalleryCategory } from "@/types/gallery";
import type { GalleryFormValues } from "@/types/adminGallery";

export default function GalleryDashboardPage() {
  const {
    galleries,
    events,
    loading,
    loadError,
    saving,
    deletingID,
    loadContent,
    saveGallery: persistGallery,
    deleteGallery: removeGallery,
  } = useAdminGallery();
  const { toast, showToast, dismissToast } = useToast();
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<GalleryCategory | "all">(
    "all",
  );

  const filteredGalleries = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("id");
    return galleries.filter((gallery) => {
      const linkedEvent =
        gallery.event?.title ??
        events.find((event) => event.id === gallery.event_id)?.title ??
        "";
      const matchesQuery =
        !query ||
        [gallery.title, linkedEvent, galleryCategoryLabels[gallery.category]]
          .join(" ")
          .toLocaleLowerCase("id")
          .includes(query);
      return (
        matchesQuery &&
        (categoryFilter === "all" || gallery.category === categoryFilter)
      );
    });
  }, [categoryFilter, events, galleries, searchQuery]);

  async function saveGallery(values: GalleryFormValues, image: File | null) {
    try {
      await persistGallery(editingGallery, values, image);
      setShowForm(false);
      showToast({
        type: "success",
        message: editingGallery
          ? "Perubahan foto berhasil disimpan."
          : "Foto berhasil ditambahkan ke galeri.",
      });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Gagal menyimpan foto.",
      });
      throw error;
    }
  }

  async function deleteGallery(gallery: Gallery) {
    if (!window.confirm(`Hapus foto "${gallery.title}" dari galeri?`)) return;
    try {
      await removeGallery(gallery);
      showToast({
        type: "success",
        message: "Foto berhasil dihapus dari galeri.",
      });
    } catch (error) {
      showToast({
        type: "error",
        message: error instanceof Error ? error.message : "Gagal menghapus foto.",
      });
    }
  }

  function closeForm() {
    if (!saving) {
      setShowForm(false);
      setEditingGallery(null);
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
            className="flex flex-col gap-3 rounded-xl border border-primary/10 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Menampilkan{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--text-body)" }}
              >
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
                onChange={(inputEvent) => setSearchQuery(inputEvent.target.value)}
                placeholder="Cari judul atau kegiatan..."
                className="h-10 w-full rounded-lg border border-primary/15 bg-transparent px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:w-64"
              />
              <label className="sr-only" htmlFor="gallery-category-filter">
                Filter kategori galeri
              </label>
              <select
                id="gallery-category-filter"
                value={categoryFilter}
                onChange={(inputEvent) =>
                  setCategoryFilter(
                    inputEvent.target.value as GalleryCategory | "all",
                  )
                }
                className="h-10 rounded-lg border border-primary/15 bg-transparent px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="all">Semua kategori</option>
                {Object.entries(galleryCategoryLabels).map(([value, label]) => (
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
                        {galleryCategoryLabels[gallery.category] ??
                          gallery.category}
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
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

      <AnimatePresence>
        {showForm && (
          <GalleryForm
            key={editingGallery?.id ?? "new"}
            gallery={editingGallery}
            events={events}
            saving={saving}
            onCancel={closeForm}
            onSave={saveGallery}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
