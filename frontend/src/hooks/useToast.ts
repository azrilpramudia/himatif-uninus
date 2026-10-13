"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastMessage = {
  type: "success" | "error";
  message: string;
};

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setToast(null);
  }, []);

  const showToast = useCallback((nextToast: ToastMessage) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(nextToast);
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, 5000);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { toast, showToast, dismissToast };
}
