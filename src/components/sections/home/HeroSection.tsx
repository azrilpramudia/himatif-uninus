"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/constants/siteConfig";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";

export default function HeroSection() {
  const [isOutlineHovered, setIsOutlineHovered] = useState(false);

  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex items-center"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-16 md:py-20">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-8">
          {/* ===== Kiri — Text Content ===== */}
          <motion.div
            variants={fadeUpContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col gap-5 text-center md:text-left"
          >
            {/* Heading */}
            <motion.h1
              variants={fadeUpItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: "var(--hero-text-heading)" }}
            >
              GLORY HIMATIF!
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUpItem}
              className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto md:mx-0"
              style={{ color: "var(--hero-text-heading)" }}
            >
              Welcome to {siteConfig.fullName}
              <br />
              {siteConfig.university}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpItem}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mt-2"
            >
              {/* Primary Button */}
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
                style={{
                  backgroundColor: "#124076",
                  color: "#fbfbfb",
                }}
              >
                Lihat Kegiatan
              </Link>

              {/* Outline Button */}
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  color: isOutlineHovered
                    ? "#fbfbfb"
                    : "var(--hero-btn-outline-text)",
                  borderColor: isOutlineHovered
                    ? "#124076"
                    : "var(--hero-btn-outline-border)",
                  backgroundColor: isOutlineHovered ? "#124076" : "transparent",
                  transition:
                    "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                }}
                onMouseEnter={() => setIsOutlineHovered(true)}
                onMouseLeave={() => setIsOutlineHovered(false)}
              >
                Tentang Kami
              </Link>
            </motion.div>
          </motion.div>

          {/* ===== Kanan — Logo ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="shrink-0 flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-110" />
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.logoAlt}
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
