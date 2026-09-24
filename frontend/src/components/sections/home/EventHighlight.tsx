"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { eventHighlights } from "@/constants/eventHighlights";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";
import type { EventHighlight } from "@/types/eventHighlight";

// ===== Event Card =====
function EventCard({ item }: { item: EventHighlight }) {
  return (
    <motion.div
      variants={fadeUpItem}
      className="flex flex-col rounded-2xl overflow-hidden border border-primary/10 hover:shadow-md transition-shadow duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-4/3 overflow-hidden">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {/* Category + Date */}
        <div className="flex items-center gap-3">
          <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white bg-primary">
            {item.category}
          </span>
          <span className="text-xs text-var(--text-muted)">{item.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold leading-snug text-var(--text-body) line-clamp-2">
          {item.title}
        </h3>

        {/* CTA Button */}
        <Link
          href={`/events/${item.slug}`}
          className="inline-flex items-center justify-center self-start px-4 py-2 rounded-md text-xs font-semibold text-white bg-primary transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
        >
          Lihat Event
        </Link>
      </div>
    </motion.div>
  );
}

// ===== Main Section =====
export default function EventHighlightSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: "var(--bg-section-alt)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-10"
        >
          {/* Section Title */}
          <motion.h2
            variants={fadeUpItem}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
          >
            Events
          </motion.h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventHighlights.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
