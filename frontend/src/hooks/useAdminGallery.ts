"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { Event, EventsResponse } from "@/types/event";
import type { Gallery, GalleriesResponse } from "@/types/gallery";
import type { GalleryFormValues } from "@/types/adminGallery";

export function useAdminGallery() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingID, setDeletingID] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [galleryResponse, eventResponse] = await Promise.all([
        fetchAPI<GalleriesResponse>("/api/admin/galleries"),
        fetchAPI<EventsResponse>("/api/admin/events"),
      ]);
      setGalleries(galleryResponse.data ?? []);
      setEvents(eventResponse.data ?? []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Gagal memuat galeri.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const saveGallery = useCallback(
    async (
      current: Gallery | null,
      values: GalleryFormValues,
      image: File | null,
    ) => {
      setSaving(true);
      try {
        let imageURL = current?.image_url ?? "";
        if (image) {
          const formData = new FormData();
          formData.append("image", image);
          const upload = await fetchAPI<{ image_url: string }>(
            "/api/admin/upload",
            { method: "POST", body: formData },
          );
          imageURL = upload.image_url;
        }

        const payload = { ...values, image_url: imageURL };
        if (current) {
          await fetchAPI(`/api/admin/galleries/${current.id}`, {
            method: "PUT",
            body: payload,
          });
        } else {
          await fetchAPI("/api/admin/galleries", {
            method: "POST",
            body: payload,
          });
        }
        await loadContent();
      } finally {
        setSaving(false);
      }
    },
    [loadContent],
  );

  const deleteGallery = useCallback(
    async (gallery: Gallery) => {
      setDeletingID(gallery.id);
      try {
        await fetchAPI(`/api/admin/galleries/${gallery.id}`, {
          method: "DELETE",
        });
        await loadContent();
      } finally {
        setDeletingID(null);
      }
    },
    [loadContent],
  );

  return {
    galleries,
    events,
    loading,
    loadError,
    saving,
    deletingID,
    loadContent,
    saveGallery,
    deleteGallery,
  };
}
