// src/app/(public)/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";
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
    <main
      className="min-h-screen pt-16"
      style={{ backgroundColor: "var(--bg-section-alt)" }}
    >
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* ===== Header ===== */}
          <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
            <h1
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: "var(--text-body)" }}
            >
              Hubungi Kami
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Kirimkan pesan atau pertanyaan kamu kepada kami
            </p>
          </motion.div>

          {/* ===== Content Grid ===== */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {/* ===== Form ===== */}
            <motion.div variants={fadeUpItem}>
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
                        backgroundColor: "var(--bg-card)",
                        color: "var(--text-body)",
                        borderColor: errors.firstName
                          ? "#ef4444"
                          : "rgba(0,0,0,0.1)",
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
                        backgroundColor: "var(--bg-card)",
                        color: "var(--text-body)",
                        borderColor: errors.lastName
                          ? "#ef4444"
                          : "rgba(0,0,0,0.1)",
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
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-body)",
                      borderColor: errors.email ? "#ef4444" : "rgba(0,0,0,0.1)",
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
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-body)",
                      borderColor: errors.message
                        ? "#ef4444"
                        : "rgba(0,0,0,0.1)",
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
            </motion.div>

            {/* ===== Map ===== */}
            <motion.div
              variants={fadeUpItem}
              className="h-72 overflow-hidden rounded-md lg:h-full lg:min-h-72"
            >
              <iframe
                title="Lokasi HIMATIF UNINUS"
                src="https://www.google.com/maps?q=Universitas%20Islam%20Nusantara%20Bandung&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
