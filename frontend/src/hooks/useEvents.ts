import { useEffect, useState } from "react";
import { eventHighlights } from "@/constants/eventHighlights";
import { fetchAPI } from "@/lib/api";
import type { Event, EventsResponse, EventResponse } from "@/types/event";

function getMockEventBySlug(slug: string): Event | null {
  const highlight = eventHighlights.find((item) => item.slug === slug);
  if (!highlight) return null;

  return {
    id: highlight.id,
    title: highlight.title,
    slug: highlight.slug,
    description: highlight.description,
    content: highlight.content,
    thumbnail: highlight.thumbnail,
    location: highlight.location,
    status: "completed",
    start_date: highlight.startDate,
    end_date: highlight.endDate,
    created_at: highlight.startDate,
    updated_at: highlight.startDate,
  };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAPI<EventsResponse>("/api/v1/events")
      .then((res) => setEvents(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading, error };
}

export function useEventBySlug(slug: string) {
  const mockEvent = getMockEventBySlug(slug);
  const [result, setResult] = useState<{
    slug: string;
    event: Event | null;
    loading: boolean;
    error: string | null;
  }>({ slug: "", event: null, loading: true, error: null });

  useEffect(() => {
    if (!slug || getMockEventBySlug(slug)) return;
    let active = true;
    fetchAPI<EventResponse>(`/api/v1/events/${slug}`)
      .then((res) => {
        if (active) {
          setResult({ slug, event: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setResult({
            slug,
            event: null,
            loading: false,
            error:
              err instanceof Error ? err.message : "Gagal memuat kegiatan.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (mockEvent) return { event: mockEvent, loading: false, error: null };
  if (result.slug !== slug) return { event: null, loading: true, error: null };
  return { event: result.event, loading: result.loading, error: result.error };
}
