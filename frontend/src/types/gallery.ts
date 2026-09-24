export type GalleryCategory =
  | "kegiatan"
  | "prestasi"
  | "organisasi"
  | "lainnya";

export type Gallery = {
  id: string;
  title: string;
  image_url: string;
  category: GalleryCategory;
  event_id?: string;
  event?: import("./event").Event;
  created_at: string;
  updated_at: string;
};

export type GalleriesResponse = {
  data: Gallery[];
};

export type GalleryResponse = {
  data: Gallery;
};
