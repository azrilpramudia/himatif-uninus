export type EventStatus = "upcoming" | "ongoing" | "completed";

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  location: string;
  status: EventStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

export type EventsResponse = {
  data: Event[];
};

export type EventResponse = {
  data: Event;
};
