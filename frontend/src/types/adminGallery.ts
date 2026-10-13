import type { Event } from "@/types/event";
import type { Gallery, GalleryCategory } from "@/types/gallery";

export type GalleryFormValues = {
  title: string;
  category: GalleryCategory;
  event_id: string;
};

export type GalleryFormProps = {
  gallery: Gallery | null;
  events: Event[];
  saving: boolean;
  onCancel: () => void;
  onSave: (values: GalleryFormValues, image: File | null) => Promise<void>;
};
