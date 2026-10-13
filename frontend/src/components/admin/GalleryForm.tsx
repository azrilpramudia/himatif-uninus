"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { galleryCategoryLabels, MAX_UPLOAD_SIZE } from "@/constants/adminContent";
import { useModalUX } from "@/hooks/useModalUX";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { adminGalleryFormSchema } from "@/schemas/adminGalleryFormSchema";
import type { GalleryFormProps } from "@/types/adminGallery";
import type { GalleryCategory } from "@/types/gallery";

export default function GalleryForm({
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
  const imagePreview = useObjectUrl(image);
  const reduceMotion = useReducedMotion();
  const dialogRef = useModalUX(onCancel, saving);

  async function submit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setFormError(null);
    const parsed = adminGalleryFormSchema.safeParse({
      title,
      category,
      event_id: eventID,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Periksa kembali formulir.");
      return;
    }
    if (!gallery && !image) {
      setFormError("Pilih gambar untuk item galeri.");
      return;
    }
    if (image && image.size > MAX_UPLOAD_SIZE) {
      setFormError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    try {
      await onSave(parsed.data, image);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal menyimpan foto.",
      );
    }
  }

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.18 }}
        onMouseDown={(mouseEvent) => {
          if (mouseEvent.target === mouseEvent.currentTarget && !saving) onCancel();
        }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:items-center"
      >
      <motion.section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-form-title"
        aria-describedby="gallery-form-description"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: "easeOut" }}
        className="my-6 w-full max-w-xl rounded-2xl border border-primary/10 p-6 shadow-xl outline-none sm:p-8"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
        <h2
          id="gallery-form-title"
          className="text-xl font-bold"
          style={{ color: "var(--text-body)" }}
        >
          {gallery ? "Edit foto galeri" : "Tambah foto galeri"}
        </h2>
        <p
          id="gallery-form-description"
          className="mt-1 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          {gallery
            ? "Perbarui informasi foto atau pilih gambar pengganti."
            : "Unggah dokumentasi dan lengkapi informasi galeri."}
        </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="Tutup formulir"
            className="rounded-lg p-2 text-lg leading-none text-primary/70 transition hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            ×
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium">
            <span>Judul foto *</span>
            <input
              required
              maxLength={200}
              value={title}
              onChange={(inputEvent) => setTitle(inputEvent.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-primary/15 bg-transparent px-3"
            />
          </label>

          <label className="block text-sm font-medium">
            <span>Kategori *</span>
            <select
              required
              value={category}
              onChange={(inputEvent) =>
                setCategory(inputEvent.target.value as GalleryCategory)
              }
              className="mt-1.5 h-11 w-full rounded-lg border border-primary/15 bg-transparent px-3"
            >
              {Object.entries(galleryCategoryLabels).map(([value, label]) => (
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
              onChange={(inputEvent) => setEventID(inputEvent.target.value)}
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
              onChange={(inputEvent) =>
                setImage(inputEvent.target.files?.[0] ?? null)
              }
              className="mt-1.5 block w-full text-sm"
            />
            <span
              className="mt-1 block text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              JPG, PNG, atau WEBP; maksimal 5 MB.
              {gallery && !image
                ? " Gambar saat ini akan tetap digunakan."
                : ""}
            </span>
            {(imagePreview || gallery) && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-primary/10 p-2">
                <Image
                  src={
                    imagePreview ??
                    `${process.env.NEXT_PUBLIC_API_URL}${gallery?.image_url}`
                  }
                  alt={
                    image
                      ? `Pratinjau gambar ${image.name}`
                      : gallery?.title ?? "Gambar galeri saat ini"
                  }
                  width={96}
                  height={72}
                  unoptimized={Boolean(imagePreview)}
                  className="h-18 w-24 rounded-md bg-primary/5 object-cover"
                />
                <span className="min-w-0 text-xs" style={{ color: "var(--text-muted)" }}>
                  {image ? image.name : "Gambar saat ini"}
                </span>
              </div>
            )}
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
      </motion.section>
      </motion.div>
  );
}
