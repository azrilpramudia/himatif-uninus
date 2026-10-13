"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  adminFormFieldClass,
  eventStatusLabels,
  MAX_UPLOAD_SIZE,
} from "@/constants/adminContent";
import { useModalUX } from "@/hooks/useModalUX";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { adminEventFormSchema } from "@/schemas/adminEventFormSchema";
import type { EventFormProps, EventFormValues } from "@/types/adminEvent";
import type { EventStatus } from "@/types/event";

function toLocalDateTime(value?: string): string {
  const date = value ? new Date(value) : new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function EventForm({
  event,
  saving,
  onCancel,
  onSave,
}: EventFormProps) {
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
  const thumbnailPreview = useObjectUrl(thumbnail);
  const reduceMotion = useReducedMotion();
  const dialogRef = useModalUX(onCancel, saving);

  function update<K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setFormError(null);

    const parsed = adminEventFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Periksa kembali formulir.");
      return;
    }
    if (thumbnail && thumbnail.size > MAX_UPLOAD_SIZE) {
      setFormError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    try {
      await onSave(parsed.data, thumbnail);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal menyimpan kegiatan.",
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
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 sm:p-4"
      >
        <motion.section
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-form-title"
          aria-describedby="event-form-description"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: "easeOut" }}
          className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-primary/10 shadow-xl outline-none sm:max-h-[calc(100dvh-2rem)]"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-primary/10 px-5 py-4 sm:px-6">
          <div>
          <h2
            id="event-form-title"
            className="text-lg font-bold"
            style={{ color: "var(--text-body)" }}
          >
            {event ? "Edit kegiatan" : "Tambah kegiatan"}
          </h2>
          <p id="event-form-description" className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {event
              ? "Perbarui detail kegiatan. Kosongkan gambar untuk tetap memakai gambar saat ini."
              : "Isi detail kegiatan agar pengunjung mendapatkan informasi yang lengkap."}
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

        <form
          id="event-form"
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 sm:px-6"
          onSubmit={submit}
        >
          <label className="block text-sm font-medium">
            <span>Nama kegiatan *</span>
            <input
              autoFocus
              required
              maxLength={200}
              value={values.title}
              onChange={(inputEvent) => update("title", inputEvent.target.value)}
              className={`mt-1 h-10 w-full rounded-lg px-3 ${adminFormFieldClass}`}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              <span>Tanggal mulai *</span>
              <input
                required
                type="datetime-local"
                value={values.start_date}
                onChange={(inputEvent) =>
                  update("start_date", inputEvent.target.value)
                }
                className={`mt-1 h-10 w-full rounded-lg px-3 ${adminFormFieldClass}`}
              />
            </label>
            <label className="block text-sm font-medium">
              <span>Tanggal selesai *</span>
              <input
                required
                type="datetime-local"
                value={values.end_date}
                onChange={(inputEvent) =>
                  update("end_date", inputEvent.target.value)
                }
                className={`mt-1 h-10 w-full rounded-lg px-3 ${adminFormFieldClass}`}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              <span>Lokasi</span>
              <input
                maxLength={200}
                value={values.location}
                onChange={(inputEvent) =>
                  update("location", inputEvent.target.value)
                }
                className={`mt-1 h-10 w-full rounded-lg px-3 ${adminFormFieldClass}`}
              />
            </label>
            <label className="block text-sm font-medium">
              <span>Status</span>
              <select
                value={values.status}
                onChange={(inputEvent) =>
                  update("status", inputEvent.target.value as EventStatus)
                }
                className={`mt-1 h-10 w-full rounded-lg px-3 ${adminFormFieldClass}`}
              >
                {Object.entries(eventStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              <span>Deskripsi singkat</span>
              <textarea
                rows={5}
                value={values.description}
                onChange={(inputEvent) =>
                  update("description", inputEvent.target.value)
                }
                className={`mt-1 min-h-36 w-full resize-y rounded-lg px-3 py-2 ${adminFormFieldClass}`}
              />
            </label>
            <label className="block text-sm font-medium">
              <span>Konten lengkap</span>
              <textarea
                rows={5}
                value={values.content}
                onChange={(inputEvent) =>
                  update("content", inputEvent.target.value)
                }
                className={`mt-1 min-h-36 w-full resize-y rounded-lg px-3 py-2 ${adminFormFieldClass}`}
              />
            </label>
          </div>

          <ImageUploadField
            id="event-thumbnail"
            label="Gambar thumbnail"
            selectedFile={thumbnail}
            previewUrl={thumbnailPreview}
            existingImageUrl={
              event?.thumbnail
                ? `${process.env.NEXT_PUBLIC_API_URL}${event.thumbnail}`
                : undefined
            }
            existingImageAlt="Thumbnail kegiatan saat ini"
            onSelect={setThumbnail}
          />

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
        </motion.section>
      </motion.div>
  );
}
