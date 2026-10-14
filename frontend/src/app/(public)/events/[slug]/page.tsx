"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEventBySlug } from "@/hooks/useEvents";
import { formatDate } from "@/lib/utils";

const statusColor: Record<string, string> = {
  upcoming: "#124076",
  ongoing: "#0891b2",
  completed: "#374151",
};

// ===== Skeleton =====
function EventDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-4 w-32 rounded bg-primary/10 mb-8" />
      <div className="flex gap-3 mb-4">
        <div className="h-6 w-20 rounded bg-primary/10" />
        <div className="h-6 w-24 rounded bg-primary/10" />
      </div>
      <div className="h-10 w-full rounded bg-primary/10 mb-2" />
      <div className="h-10 w-3/4 rounded bg-primary/10 mb-8" />
      <div className="w-full aspect-video rounded-xl bg-primary/10 mb-10" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-primary/10" />
        ))}
      </div>
    </div>
  );
}

// ===== Page =====
export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { event, loading, error } = useEventBySlug(slug);

  return (
    <div
      className="min-h-screen pt-16"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Loading */}
      {loading && <EventDetailSkeleton />}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-sm text-red-500">{error}</p>
          <Link
            href="/events"
            className="text-xs text-primary font-medium hover:underline"
          >
            Kembali ke Events
          </Link>
        </div>
      )}

      {/* Content */}
      {!loading && !error && event && (
        <article className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
          {/* Back */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-medium mb-8 transition-all duration-200 hover:gap-3"
            style={{ color: "var(--text-muted)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali ke Kegiatan
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-white capitalize"
              style={{
                backgroundColor: statusColor[event.status] ?? "#124076",
              }}
            >
              {event.status}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {formatDate(event.start_date)}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4"
            style={{ color: "var(--text-body)" }}
          >
            {event.title}
          </h1>

          {/* Location */}
          {event.location && (
            <p
              className="flex items-center gap-1.5 text-sm mb-8"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </p>
          )}

          {/* Thumbnail */}
          {event.thumbnail && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10">
              <Image
                src={
                  event.thumbnail.startsWith("/images/")
                    ? event.thumbnail
                    : `${process.env.NEXT_PUBLIC_API_URL}${event.thumbnail}`
                }
                alt={event.title}
                fill
                className="object-cover"
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p
              className="text-sm sm:text-base leading-relaxed mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              {event.description}
            </p>
          )}

          {/* Content */}
          {event.content && (
            <div
              className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
              style={{ color: "var(--text-muted)" }}
            >
              {event.content}
            </div>
          )}

          {/* Divider */}
          <div
            className="my-10 h-px w-full"
            style={{ backgroundColor: "rgba(18,64,118,0.1)" }}
          />

          {/* Back Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali ke Kegiatan
          </Link>
        </article>
      )}
    </div>
  );
}
