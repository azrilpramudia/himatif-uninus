// src/app/(public)/contact/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/schemas/contactSchema";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log(data);
    alert("Pesan berhasil dikirim!");
    reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== Form & Map ===== */}
      <section
        className="py-20 flex-1"
        style={{ backgroundColor: "var(--bg-section-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* ===== Form ===== */}
            <div
              className="flex flex-col gap-5 p-8 rounded-2xl border border-primary/10"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <h2 className="text-2xl font-bold text-primary">Kirim Pesan</h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Name Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="firstName"
                      className="text-xs font-medium"
                      style={{ color: "var(--text-body)" }}
                    >
                      Nama Depan
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Budi"
                      {...register("firstName")}
                      className="h-9 w-full rounded-md border px-3 text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
                      style={{
                        backgroundColor: "var(--bg-page)",
                        color: "var(--text-body)",
                        borderColor: errors.firstName
                          ? "#ef4444"
                          : "rgba(18, 64, 118, 0.15)",
                      }}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="lastName"
                      className="text-xs font-medium"
                      style={{ color: "var(--text-body)" }}
                    >
                      Nama Belakang
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Santoso"
                      {...register("lastName")}
                      className="h-9 w-full rounded-md border px-3 text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
                      style={{
                        backgroundColor: "var(--bg-page)",
                        color: "var(--text-body)",
                        borderColor: errors.lastName
                          ? "#ef4444"
                          : "rgba(18, 64, 118, 0.15)",
                      }}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium"
                    style={{ color: "var(--text-body)" }}
                  >
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="budi@example.com"
                    {...register("email")}
                    className="h-9 w-full rounded-md border px-3 text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
                    style={{
                      backgroundColor: "var(--bg-page)",
                      color: "var(--text-body)",
                      borderColor: errors.email
                        ? "#ef4444"
                        : "rgba(18, 64, 118, 0.15)",
                    }}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-medium"
                    style={{ color: "var(--text-body)" }}
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tulis pertanyaan atau pesanmu di sini..."
                    {...register("message")}
                    className="w-full resize-none rounded-md border px-3 py-2 text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
                    style={{
                      backgroundColor: "var(--bg-page)",
                      color: "var(--text-body)",
                      borderColor: errors.message
                        ? "#ef4444"
                        : "rgba(18, 64, 118, 0.15)",
                    }}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 w-full rounded-md bg-primary px-4 text-xs font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>
            </div>

            {/* ===== Map ===== */}
            <div
              className="flex flex-col gap-5 p-8 rounded-2xl border border-primary/10 overflow-hidden"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <h2 className="text-2xl font-bold text-primary">Lokasi Kami</h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Universitas Islam Nusantara, Bandung, Jawa Barat
              </p>
              <div className="flex-1 min-h-64 rounded-xl overflow-hidden">
                <iframe
                  title="Lokasi HIMATIF UNINUS"
                  src="https://www.google.com/maps?q=Universitas%20Islam%20Nusantara%20Bandung&output=embed"
                  className="h-full w-full border-0 min-h-64"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
