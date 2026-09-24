import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { Gallery, GalleriesResponse } from "@/types/gallery";

export function useGallery(category?: string) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const endpoint = category
      ? `/api/v1/galleries?category=${category}`
      : "/api/v1/galleries";

    fetchAPI<GalleriesResponse>(endpoint)
      .then((res) => setGalleries(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { galleries, loading, error };
}
