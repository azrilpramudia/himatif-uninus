"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ToastMessage } from "@/hooks/useToast";

type ToastProps = {
  toast: ToastMessage | null;
  onClose: () => void;
};

export default function Toast({ toast, onClose }: ToastProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={`${toast.type}-${toast.message}`}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: 24, y: -8, scale: 0.96 }
          }
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.96 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: "easeOut" }}
          className="pointer-events-none fixed right-4 top-20 z-70 w-[calc(100%-2rem)] max-w-sm sm:right-6"
        >
          <div
            role={toast.type === "success" ? "status" : "alert"}
            aria-live={toast.type === "success" ? "polite" : "assertive"}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-l-4 p-4 shadow-lg ${
              toast.type === "success"
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
                toast.type === "success"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "bg-red-500/10 text-red-700 dark:text-red-300"
              }`}
            >
              {toast.type === "success" ? "✓" : "!"}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
