import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility untuk merge Tailwind class — dipakai di semua komponen
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

// Format tanggal pakai date-fns
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "dd MMMM yyyy", { locale: id });
};

export const formatDateShort = (date: string | Date): string => {
  return format(new Date(date), "dd MMM yyyy", { locale: id });
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: id,
  });
};
