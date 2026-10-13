"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { UploadIcon } from "@/components/icons";

type ImageUploadFieldProps = {
  id: string;
  label: string;
  selectedFile: File | null;
  previewUrl?: string | null;
  existingImageUrl?: string;
  existingImageAlt?: string;
  onSelect: (file: File | null) => void;
};

export default function ImageUploadField({
  id,
  label,
  selectedFile,
  previewUrl,
  existingImageUrl,
  existingImageAlt,
  onSelect,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const visibleImage = previewUrl ?? existingImageUrl;

  function selectFile(file?: File) {
    if (file) onSelect(file);
  }

  return (
    <div>
      <span className="block text-sm font-medium">{label}</span>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          selectFile(event.dataTransfer.files[0]);
        }}
        className={`mt-1.5 rounded-xl border-2 border-dashed p-4 transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-primary/20 bg-primary/[0.025] hover:border-primary/40 hover:bg-primary/5"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            selectFile(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />

        {visibleImage ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={visibleImage}
              alt={selectedFile ? `Pratinjau ${selectedFile.name}` : existingImageAlt ?? "Gambar saat ini"}
              className="h-28 w-full rounded-lg border border-primary/10 bg-primary/5 object-cover sm:w-40"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" style={{ color: "var(--text-body)" }}>
                {selectedFile?.name ?? "Gambar saat ini"}
              </p>
              {selectedFile && (
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg border border-primary/20 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Ganti gambar
                </button>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => onSelect(null)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Batalkan pilihan
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadIcon />
            </span>
            <p className="mt-3 text-sm font-semibold" style={{ color: "var(--text-body)" }}>
              Seret gambar ke sini
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              atau pilih file dari perangkat
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Pilih gambar
            </button>
          </div>
        )}
      </div>
      <p className="mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
        Format JPG, PNG, atau WEBP. Maksimal 5 MB.
      </p>
    </div>
  );
}
