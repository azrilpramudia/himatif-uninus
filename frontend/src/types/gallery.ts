export type GalleryCategory =
  | "kegiatan"
  | "prestasi"
  | "organisasi"
  | "lainnya";

export type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  eventId?: string;
  createdAt: string;
};
