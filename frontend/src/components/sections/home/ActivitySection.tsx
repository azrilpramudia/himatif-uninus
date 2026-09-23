"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";

// ===== Types =====
type Activity = {
  id: number;
  src: string;
  alt: string;
  aspectClass: string;
  objectFit: "object-cover" | "object-contain";
};

// ===== Data =====
const activities: Activity[] = [
  {
    id: 1,
    src: "/images/activity-photo.jpg",
    alt: "Foto Kegiatan Himatif",
    aspectClass: "aspect-[4/3]",
    objectFit: "object-cover",
  },
  {
    id: 2,
    src: "/images/activity-maktab.png",
    alt: "Logo MAKTAB 2024",
    aspectClass: "aspect-[4/3]",
    objectFit: "object-contain",
  },
  {
    id: 3,
    src: "/images/activity-mentor.jpg",
    alt: "Mentor Reveal's Event",
    aspectClass: "aspect-[4/3]",
    objectFit: "object-cover",
  },
];

// ===== Badge =====
function SectionBadge() {
  return (
    <motion.div
      variants={fadeUpItem}
      className="flex justify-center"
    >
      <span
        className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary"
      >
        Aktivitas Himatif
      </span>
    </motion.div>
  );
}

// ===== Activity Image Card =====
function ActivityCard({
  src,
  alt,
  aspectClass,
  objectFit,
}: {
  src: string;
  alt: string;
  aspectClass: string;
  objectFit: "object-cover" | "object-contain";
}) {
  return (
    <motion.div
      variants={fadeUpItem}
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden shadow-sm border border-primary/10`}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`${objectFit} transition-transform duration-500 hover:scale-105`}
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </motion.div>
  );
}

// ===== Main Section =====
export default function ActivitySection() {
  return (
    <section
      className="py-20 bg-var(--bg-section-alt)"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-10"
        >
          {/* Badge Label */}
          <SectionBadge />

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {activities.map((item) => (
              <ActivityCard
                key={item.id}
                src={item.src}
                alt={item.alt}
                aspectClass={item.aspectClass}
                objectFit={item.objectFit}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
