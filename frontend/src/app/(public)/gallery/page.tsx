"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryCategoryLabels } from "@/constants/adminContent";
import { useGallery } from "@/hooks/useGallery";
import type { Gallery, GalleryCategory } from "@/types/gallery";

type FilterCategory = "All" | GalleryCategory;

const categories: FilterCategory[] = [
  "All",
  "kegiatan",
  "prestasi",
  "organisasi",
  "lainnya",
];

const categoryLabel: Record<FilterCategory, string> = {
  All: "All",
  ...galleryCategoryLabels,
};

const badgeColor: Record<FilterCategory, string> = {
  All: "#124076",
  kegiatan: "#124076",
  prestasi: "#7c3aed",
  organisasi: "#0891b2",
  lainnya: "#374151",
};

// ===== Lightbox =====
function Lightbox({ item, onClose }: { item: Gallery; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full aspect-video">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url}`}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 768px"
          />
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-2">
          <span
            className="text-[10px] font-semibold text-white px-2.5 py-1 rounded-md w-fit capitalize"
            style={{ backgroundColor: badgeColor[item.category] }}
          >
            {item.category}
          </span>
          <h3
            className="text-base font-semibold"
            style={{ color: "var(--text-body)" }}
          >
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

// ===== Gallery Card =====
function GalleryCard({
  item,
  onClick,
}: {
  item: Gallery;
  onClick: () => void;
}) {
  return (
    <div
      className="group flex flex-col rounded-xl overflow-hidden border border-primary/10 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: "var(--bg-card)" }}
      onClick={onClick}
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url}`}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex items-center justify-center">
          <svg
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </div>
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold text-white capitalize"
          style={{ backgroundColor: badgeColor[item.category] }}
        >
          {item.category}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--text-body)" }}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
}

// ===== Skeleton =====
function SkeletonCard() {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-primary/10 animate-pulse"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <div className="w-full aspect-square bg-primary/10" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-full rounded bg-primary/10" />
        <div className="h-4 w-2/3 rounded bg-primary/10" />
      </div>
    </div>
  );
}

// ===== Page =====
export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);

  const category = activeCategory === "All" ? undefined : activeCategory;
  const { galleries, loading, error } = useGallery(category);

  const filtered = galleries.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col min-h-screen pt-16"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* ===== Header ===== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-6">
          <h1
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ color: "var(--text-body)" }}
          >
            Galeri
          </h1>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Cari foto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-4 pr-10 rounded-full border text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-body)",
                borderColor: "rgba(18, 64, 118, 0.2)",
              }}
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <span
              className="text-xs mr-1"
              style={{ color: "var(--text-muted)" }}
            >
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor:
                    activeCategory === cat ? "#124076" : "transparent",
                  color:
                    activeCategory === cat ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {categoryLabel[cat]}
              </button>
            ))}
          </div>

          {/* Counter */}
          {!loading && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Menampilkan{" "}
              <span className="font-semibold text-primary">
                {filtered.length}
              </span>{" "}
              foto
            </p>
          )}
        </div>
      </section>

      {/* ===== Grid ===== */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {error && (
            <div className="flex justify-center py-20">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-20 gap-3"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-sm">Tidak ada foto ditemukan</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
