"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { Event, EventsResponse } from "@/types/event";
import type { EventFormValues } from "@/types/adminEvent";

export function useAdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingID, setDeletingID] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetchAPI<EventsResponse>("/api/admin/events");
      setEvents(response.data ?? []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Gagal memuat kegiatan.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const saveEvent = useCallback(
    async (current: Event | null, values: EventFormValues, thumbnail: File | null) => {
      setSaving(true);
      try {
        let thumbnailURL = current?.thumbnail ?? "";
        if (thumbnail) {
          const formData = new FormData();
          formData.append("image", thumbnail);
          const upload = await fetchAPI<{ image_url: string }>(
            "/api/admin/upload",
            { method: "POST", body: formData },
          );
          thumbnailURL = upload.image_url;
        }

        const payload = {
          ...values,
          thumbnail: thumbnailURL,
          start_date: new Date(values.start_date).toISOString(),
          end_date: new Date(values.end_date).toISOString(),
        };
        if (current) {
          await fetchAPI(`/api/admin/events/${current.id}`, {
            method: "PUT",
            body: payload,
          });
        } else {
          await fetchAPI("/api/admin/events", { method: "POST", body: payload });
        }
        await loadEvents();
      } finally {
        setSaving(false);
      }
    },
    [loadEvents],
  );

  const deleteEvent = useCallback(
    async (event: Event) => {
      setDeletingID(event.id);
      try {
        await fetchAPI(`/api/admin/events/${event.id}`, { method: "DELETE" });
        await loadEvents();
      } finally {
        setDeletingID(null);
      }
    },
    [loadEvents],
  );

  return {
    events,
    loading,
    loadError,
    saving,
    deletingID,
    loadEvents,
    saveEvent,
    deleteEvent,
  };
}
