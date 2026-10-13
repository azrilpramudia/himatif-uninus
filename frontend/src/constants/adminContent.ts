import type { EventStatus } from "@/types/event";
import type { GalleryCategory } from "@/types/gallery";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export const adminFormFieldClass =
  "border border-primary/15 bg-[var(--bg-input)] text-[var(--text-body)] outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20";

export const eventStatusLabels: Record<EventStatus, string> = {
  upcoming: "Akan datang",
  ongoing: "Berlangsung",
  completed: "Selesai",
};

export const eventStatusStyles: Record<EventStatus, string> = {
  upcoming: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  ongoing: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  completed: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export const galleryCategoryLabels: Record<GalleryCategory, string> = {
  kegiatan: "Kegiatan",
  prestasi: "Prestasi",
  organisasi: "Organisasi",
  lainnya: "Lainnya",
};
