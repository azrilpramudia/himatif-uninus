import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { Event, EventsResponse } from "@/types/event";

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
