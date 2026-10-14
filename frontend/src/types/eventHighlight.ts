export type EventCategory = "Teknologi" | "Desain" | "Sosial" | "Pendidikan" | "Kompetisi" | "Organisasi";

export type EventHighlight = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  thumbnail: string;
  slug: string;
  description: string;
  content: string;
  location: string;
  startDate: string;
  endDate: string;
};
