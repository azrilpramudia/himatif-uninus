// src/schemas/contactSchema.ts
import { z } from "zod";

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, "Nama depan minimal 2 karakter")
    .max(50, "Nama depan maksimal 50 karakter"),
  lastName: z
    .string()
    .min(2, "Nama belakang minimal 2 karakter")
    .max(50, "Nama belakang maksimal 50 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  message: z
    .string()
    .min(10, "Pesan minimal 10 karakter")
    .max(500, "Pesan maksimal 500 karakter"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
