"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// ===== Types =====
type EventDetail = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  image: string;
  content: string;
};

// ===== Dummy Data (nanti dari API) =====
const dummyEventDetail: EventDetail = {
  id: "1",
  title: "Creating Attractive and Functional Websites",
  slug: "creating-attractive-functional-websites",
  category: "Design",
  date: "25 Jul 2024",
  image: "/images/events/event-1.jpg",
  content: `
    Social media has woven itself into the fabric of our lives, offering a constant stream of connection, 
    information, and entertainment. But like any powerful tool, it comes with its own set of challenges, 
    particularly when it comes to our mental well-being. Today, we dive into the complex relationship 
    between social media and mental health, exploring both its positive and negative influences.

    On the Sunny Side:

    - Connection and belonging: Social media can bridge geographical distances, fostering connections 
      with loved ones and communities we might not otherwise have access to. This sense of belonging can 
      combat feelings of isolation and loneliness, offering valuable social support.
    - Creative expression: Platforms like Instagram and TikTok provide outlets for individuals to express 
      themselves creatively, share their voices, and explore their identities. This can be particularly 
      empowering for marginalized groups who may not have found their voice elsewhere.
    - Information and awareness: Social media can be a powerful tool for raising awareness about mental 
      health issues, destigmatizing them, and connecting people with resources and support networks.

    The Darker Side:

    - Social comparison and FOMO: Curated online feeds often showcase the best moments of others' lives, 
      leading to unhealthy comparisons and feelings of inadequacy, "fear of missing out", and low self-esteem.
    - Cyberbullying and negativity: Online harassment and negativity can have a detrimental impact on 
      mental health, leading to anxiety, depression, and even suicidal ideation, especially for vulnerable 
      individuals.
    - Sleep disruption and addiction: The constant notifications and blue light emitted from screens can 
      disrupt sleep patterns, leading to fatigue, irritability, and difficulty concentrating. Additionally, 
      excessive social media use can become addictive, taking away from real-world interactions and activities.

    Striking a Balance:

    So, how can we navigate the complex world of social media and protect our mental well-being? Here are 
    some tips:

    - Be mindful of your usage: Set limits on how much time you spend on social media and be intentional 
      about what content you consume.
    - Curate your feed: Unfollow accounts that make you feel bad about yourself or promote negativity.
    - Prioritize real-life connections: Prioritize face-to-face interactions with loved ones and engage in 
      activities you enjoy offline.
    - Seek help if needed: If you find yourself struggling with negative emotions related to social media, 
      don't hesitate to reach out to a mental health professional.
  `,
};

// ===== Badge Color =====
const categoryColor: Record<string, string> = {
  Design: "#124076",
  "UI/UX": "#7c3aed",
  "Social Media": "#0891b2",
  Tech: "#374151",
};

// ===== Page =====
export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Nanti ganti dengan fetch dari API by slug
  const event = dummyEventDetail;

  if (!event) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <p style={{ color: "var(--text-muted)" }}>Event tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-16"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        {/* ===== Back Button ===== */}
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
          Kembali ke Events
        </Link>

        {/* ===== Meta ===== */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-white"
            style={{
              backgroundColor: categoryColor[event.category] ?? "#124076",
            }}
          >
            {event.category}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {event.date}
          </span>
        </div>

        {/* ===== Title ===== */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-8"
          style={{ color: "var(--text-body)" }}
        >
          {event.title}
        </h1>

        {/* ===== Thumbnail ===== */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ===== Content ===== */}
        <div
          className="flex flex-col gap-5 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-body)" }}
        >
          {event.content
            .trim()
            .split("\n\n")
            .map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Heading — baris yang diakhiri titik dua
              if (trimmed.endsWith(":")) {
                return (
                  <h2
                    key={index}
                    className="text-base sm:text-lg font-bold mt-4"
                    style={{ color: "var(--text-body)" }}
                  >
                    {trimmed}
                  </h2>
                );
              }

              // List — baris yang dimulai dengan "- "
              if (trimmed.startsWith("- ")) {
                const items = trimmed
                  .split("\n")
                  .filter((line) => line.trim().startsWith("- "))
                  .map((line) => line.replace(/^- /, "").trim());

                return (
                  <ul
                    key={index}
                    className="flex flex-col gap-2 pl-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              // Paragraph biasa
              return (
                <p key={index} style={{ color: "var(--text-muted)" }}>
                  {trimmed}
                </p>
              );
            })}
        </div>

        {/* ===== Divider ===== */}
        <div
          className="my-10 h-px w-full"
          style={{ backgroundColor: "rgba(18,64,118,0.1)" }}
        />

        {/* ===== Back to Events ===== */}
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
          Kembali ke Events
        </Link>
      </article>
    </div>
  );
}
