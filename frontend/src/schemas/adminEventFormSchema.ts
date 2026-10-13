import { z } from "zod";

export const adminEventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Nama kegiatan wajib diisi").max(200),
    description: z.string(),
    content: z.string(),
    location: z.string().max(200),
    status: z.enum(["upcoming", "ongoing", "completed"]),
    start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
    end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
  })
  .superRefine((values, context) => {
    const startDate = new Date(values.start_date);
    const endDate = new Date(values.end_date);
    if (Number.isNaN(startDate.getTime())) {
      context.addIssue({
        code: "custom",
        path: ["start_date"],
        message: "Tanggal mulai tidak valid.",
      });
    }
    if (Number.isNaN(endDate.getTime())) {
      context.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Tanggal selesai tidak valid.",
      });
    } else if (
      !Number.isNaN(startDate.getTime()) &&
      endDate < startDate
    ) {
      context.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Tanggal selesai harus sama atau setelah tanggal mulai.",
      });
    }
  });

export type AdminEventFormInput = z.input<typeof adminEventFormSchema>;
