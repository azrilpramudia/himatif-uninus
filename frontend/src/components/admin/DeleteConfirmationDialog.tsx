"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useModalUX } from "@/hooks/useModalUX";

type DeleteConfirmationDialogProps = {
  itemName: string;
  description: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmationDialog({
  itemName,
  description,
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useModalUX(onCancel, deleting);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.18 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) onCancel();
      }}
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/45 p-4"
    >
      <motion.section
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        initial={
          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }
        }
        transition={{ duration: reduceMotion ? 0.12 : 0.2, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-primary/10 p-6 shadow-2xl outline-none"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-300">
            <svg
              aria-hidden="true"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4m0 4h.01" />
              <path d="M10.3 3.9 1.9 18.2A2 2 0 0 0 3.6 21h16.8a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2
              id="delete-confirmation-title"
              className="text-lg font-semibold"
              style={{ color: "var(--text-body)" }}
            >
              Hapus {itemName}?
            </h2>
            <p
              id="delete-confirmation-description"
              className="mt-1 text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-primary/20 px-4 py-2.5 text-sm font-medium transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {deleting ? "Menghapus..." : "Ya, hapus"}
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
