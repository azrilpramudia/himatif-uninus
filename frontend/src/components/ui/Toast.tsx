"use client";

import type { ToastMessage } from "@/hooks/useToast";

type ToastProps = {
  toast: ToastMessage | null;
  onClose: () => void;
};

export default function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-70 w-[calc(100%-2rem)] max-w-sm sm:right-6">
      <div
        role={isSuccess ? "status" : "alert"}
        aria-live={isSuccess ? "polite" : "assertive"}
        className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-l-4 p-4 shadow-lg ${
          isSuccess
            ? "border-emerald-500/25 border-l-emerald-500"
            : "border-red-500/25 border-l-red-500"
        }`}
        style={{
          backgroundColor: "var(--bg-card)",
          color: "var(--text-body)",
        }}
      >
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            isSuccess
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 text-red-700 dark:text-red-300"
          }`}
        >
          {isSuccess ? "✓" : "!"}
        </span>
        <p className="flex-1 pt-0.5 text-sm font-medium">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="rounded-md px-1 text-lg leading-5 opacity-60 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          ×
        </button>
      </div>
    </div>
  );
}
