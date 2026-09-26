"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ===== Types =====
type EventCategory = "All" | "Design" | "UI/UX" | "Social Media" | "Tech";

type Event = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  image: string;
  slug: string;
};

// ===== Dummy Data (nanti diganti dari API) =====
const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Creating Attractive and Functional Websites",
    category: "Design",
    date: "25 Jul 2024",
    image: "/images/events/event-1.jpg",
    slug: "creating-attractive-functional-websites",
  },
  {
    id: "2",
    title: "Modern Techniques and Tools Introduction",
    category: "Tech",
    date: "25 Jul 2024",
    image: "/images/events/event-2.jpg",
    slug: "modern-techniques-tools-introduction",
  },
  {
    id: "3",
    title: "Social Media Marketing Strategies for Business",
    category: "Social Media",
    date: "25 Jul 2024",
    image: "/images/events/event-3.jpg",
    slug: "social-media-marketing-strategies",
  },
  {
    id: "4",
    title: "From Concept to Implementation Introduction",
    category: "Design",
    date: "25 Jul 2024",
    image: "/images/events/event-4.jpg",
    slug: "concept-to-implementation",
  },
  {
    id: "5",
    title: "The Art of Choosing The Perfect Font Introduction",
    category: "UI/UX",
    date: "25 Jul 2024",
    image: "/images/events/event-5.jpg",
    slug: "choosing-perfect-font",
  },
  {
    id: "6",
    title: "Social Media Tiktok Trends 2024",
    category: "Social Media",
    date: "25 Jul 2024",
    image: "/images/events/event-6.jpg",
    slug: "social-media-tiktok-trends",
  },
  {
    id: "7",
    title: "Researchers use AI to analyse cosmic explosions",
    category: "Tech",
    date: "25 Jul 2024",
    image: "/images/events/event-7.jpg",
    slug: "ai-cosmic-explosions",
  },
  {
    id: "8",
    title: "Tech Decoded: Sign up to our newsletter",
    category: "Tech",
    date: "25 Jul 2024",
    image: "/images/events/event-8.jpg",
    slug: "tech-decoded-newsletter",
  },
  {
    id: "9",
    title: "New AI developed to detect heart failure earlier",
    category: "Tech",
    date: "25 Jul 2024",
    image: "/images/events/event-9.jpg",
    slug: "ai-heart-failure-detection",
  },
];

const categories: EventCategory[] = [
  "All",
  "Design",
  "UI/UX",
  "Social Media",
  "Tech",
];

// ===== Badge Color =====
const badgeColor: Record<EventCategory, string> = {
  All: "#124076",
  Design: "#124076",
  "UI/UX": "#7c3aed",
  "Social Media": "#0891b2",
  Tech: "#124076",
};

// ===== EventCard =====
function EventCard({ event }: { event: Event }) {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold text-white"
          style={{ backgroundColor: badgeColor[event.category] }}
        >
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Date */}
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {event.date}
        </p>

        {/* Title */}
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--text-body)" }}
        >
          {event.title}
        </h3>

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-md bg-primary text-white text-[11px] font-semibold transition-all duration-200 hover:opacity-90"
          >
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
}

// ===== Page =====
export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<EventCategory>("All");

  const filtered = dummyEvents.filter((event) => {
    const matchCategory =
      activeCategory === "All" || event.category === activeCategory;
    const matchSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
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
            Latest Events
          </h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search Resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-4 pr-10 rounded-full border text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-body)",
                borderColor: "rgba(18, 64, 118, 0.2)",
              }}
            />
            {/* Search Icon */}
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
              Top Suggestion:
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
        </div>
      </section>

      {/* ===== Event Grid ===== */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
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
                Tidak ada event ditemukan untuk{" "}
                <span className="font-semibold">"{search}"</span>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
