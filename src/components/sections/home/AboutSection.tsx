"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";

export default function AboutSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: "var(--bg-section-alt)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          {/* ===== Kiri — Text Content ===== */}
          <motion.div
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex-1 flex flex-col gap-5"
          >
            {/* Title */}
            <motion.h2
              variants={fadeUpItem}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
            >
              Tentang Kami
            </motion.h2>

            {/* Divider */}
            <motion.div
              variants={fadeUpItem}
              className="w-12 h-1 rounded-full bg-primary"
            />

            {/* Description */}
            <motion.p
              variants={fadeUpItem}
              className="text-sm sm:text-base leading-relaxed max-w-lg"
              style={{ color: "var(--text-body)" }}
            >
              Himatif Uninus atau Himpunan Mahasiswa Teknik Informatika
              Universitas Islam Nusantara merupakan sebuah organisasi dalam
              ruang lingkup program studi S1 Teknik Informatika yang memiliki
              fungsi sebagai wadah untuk menyalurkan aspirasi, kreativitas,
              minat dan bakat seluruh mahasiswa teknik informatika.
            </motion.p>

            {/* CTA */}
            <motion.div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-200 hover:gap-3"
              >
                Selengkapnya
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* ===== Kanan — Ilustrasi ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="shrink-0 flex items-center justify-center w-full md:w-auto"
          >
            <div className="relative w-72 h-64 sm:w-80 sm:h-72 lg:w-96 lg:h-80">
              <Image
                src="/images/computer.png"
                alt="Ilustrasi Tentang Himatif"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
