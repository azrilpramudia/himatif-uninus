"use client";

import { useState } from "react";
import Image from "next/image";

// ===== Types =====
type GalleryCategory =
  | "All"
  | "Kegiatan"
  | "Prestasi"
  | "Organisasi"
  | "Lainnya";

type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  date: string;
  image: string;
};

// ===== Dummy Data =====
const dummyGallery: GalleryItem[] = [
  {
    id: "1",
    title: "ICC 2024 - Opening Ceremony",
    category: "Kegiatan",
    date: "25 Jul 2024",
    image: "/images/gallery/gallery-1.jpg",
  },
  {
    id: "2",
    title: "Juara 1 Kompetisi Pemrograman",
    category: "Prestasi",
    date: "20 Jun 2024",
    image: "/images/gallery/gallery-2.jpg",
  },
  {
    id: "3",
    title: "Foto Bersama Pengurus 2024",
    category: "Organisasi",
    date: "15 Jan 2024",
    image: "/images/gallery/gallery-3.jpg",
  },
  {
    id: "4",
    title: "Workshop UI/UX Design",
    category: "Kegiatan",
    date: "10 Feb 2024",
    image: "/images/gallery/gallery-4.jpg",
  },
  {
    id: "5",
    title: "Medali Emas Lomba Web",
    category: "Prestasi",
    date: "5 Mar 2024",
    image: "/images/gallery/gallery-5.jpg",
  },
  {
    id: "6",
    title: "Kunjungan Industri ke Bandung Tech",
    category: "Kegiatan",
    date: "1 Apr 2024",
    image: "/images/gallery/gallery-6.jpg",
  },
  {
    id: "7",
    title: "Rapat Koordinasi Pengurus",
    category: "Organisasi",
    date: "12 Apr 2024",
    image: "/images/gallery/gallery-7.jpg",
  },
  {
    id: "8",
    title: "Seminar Teknologi AI",
    category: "Kegiatan",
    date: "20 May 2024",
    image: "/images/gallery/gallery-8.jpg",
  },
  {
    id: "9",
    title: "Pengabdian Masyarakat",
    category: "Lainnya",
    date: "8 Jun 2024",
    image: "/images/gallery/gallery-9.jpg",
  },
];

const categories: GalleryCategory[] = [
  "All",
  "Kegiatan",
  "Prestasi",
  "Organisasi",
  "Lainnya",
];

// ===== Badge Color =====
const badgeColor: Record<GalleryCategory, string> = {
  All: "#124076",
  Kegiatan: "#124076",
  Prestasi: "#7c3aed",
  Organisasi: "#0891b2",
  Lainnya: "#374151",
};

// ===== Lightbox =====
function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
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
        {/* Close Button */}
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
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-2">
          <span
            className="text-[10px] font-semibold text-white px-2.5 py-1 rounded-md w-fit"
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
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {item.date}
          </p>
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
  item: GalleryItem;
  onClick: () => void;
}) {
  return (
    <div
      className="group flex flex-col rounded-xl overflow-hidden border border-primary/10 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: "var(--bg-card)" }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay saat hover */}
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

        {/* Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold text-white"
          style={{ backgroundColor: badgeColor[item.category] }}
        >
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {item.date}
        </p>
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

// ===== Page =====
export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered = dummyGallery.filter((item) => {
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div
      className="flex flex-col min-h-screen pt-16"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* ===== Header ===== */}
      <section className="py-12" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-6">
          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ color: "var(--text-body)" }}
          >
            Galeri
          </h1>

          {/* Search Bar */}
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

          {/* Filter Tabs */}
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
                {cat}
              </button>
            ))}
          </div>

          {/* Total foto */}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Menampilkan{" "}
            <span className="font-semibold text-primary">
              {filtered.length}
            </span>{" "}
            foto
          </p>
        </div>
      </section>

      {/* ===== Gallery Grid ===== */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ) : (
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
              <p className="text-sm">
                Tidak ada foto ditemukan untuk{" "}
                <span className="font-semibold">"{search}"</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== Lightbox ===== */}
      {selectedItem && (
        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
