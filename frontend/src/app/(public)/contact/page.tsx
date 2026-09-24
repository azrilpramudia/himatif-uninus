"use client";

import { motion } from "framer-motion";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";

export default function ContactPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-section-alt)" }}
    >
      {/* Top Accent */}
      <div className="h-1 w-full bg-primary" />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* Header */}
          <motion.div variants={fadeUpItem}>
            <h1
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: "var(--text-body)" }}
            >
              Contact us
            </h1>

            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Send us a note
            </p>
          </motion.div>

          {/* Contact Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
            {/* =========================
                Contact Form
            ========================== */}
            <motion.div variants={fadeUpItem}>
              <form className="flex flex-col gap-4">
                {/* Name */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="firstName"
                      className="text-[10px] font-medium"
                      style={{ color: "var(--text-body)" }}
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      className="h-9 w-full rounded-[3px] border border-black/10 bg-white px-3 text-xs text-black outline-none transition-colors placeholder:text-gray-500 focus:border-primary"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="lastName"
                      className="text-[10px] font-medium"
                      style={{ color: "var(--text-body)" }}
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Smitherton"
                      className="h-9 w-full rounded-[3px] border border-black/10 bg-white px-3 text-xs text-black outline-none transition-colors placeholder:text-gray-500 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-medium"
                    style={{ color: "var(--text-body)" }}
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@janesfakedomain.net"
                    className="h-9 w-full rounded-[3px] border border-black/10 bg-white px-3 text-xs text-black outline-none transition-colors placeholder:text-gray-500 focus:border-primary"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-[10px] font-medium"
                    style={{ color: "var(--text-body)" }}
                  >
                    Your message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Enter your question or message"
                    className="w-full resize-none rounded-[3px] border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none transition-colors placeholder:text-gray-500 focus:border-primary"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="h-9 w-full rounded-[3px] bg-primary px-4 text-xs font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                >
                  Submit
                </button>
              </form>
            </motion.div>

            {/* =========================
                Map
            ========================== */}
            <motion.div
              variants={fadeUpItem}
              className="h-70 overflow-hidden lg:h-full lg:min-h-70"
            >
              <iframe
                title="HIMATIF UNINUS Location"
                src="https://www.google.com/maps?q=Universitas%20Islam%20Nusantara%20Bandung&output=embed"
                className="h-full min-h-70 w-full border-0"
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
