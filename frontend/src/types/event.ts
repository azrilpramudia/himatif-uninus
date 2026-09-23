export type EventStatus = "upcoming" | "ongoing" | "completed";

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  status: EventStatus;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};
