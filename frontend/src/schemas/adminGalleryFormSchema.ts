import { z } from "zod";

export const adminGalleryFormSchema = z.object({
  title: z.string().trim().min(1, "Judul foto wajib diisi").max(200),
  category: z.enum(["kegiatan", "prestasi", "organisasi", "lainnya"]),
  event_id: z.string(),
});
