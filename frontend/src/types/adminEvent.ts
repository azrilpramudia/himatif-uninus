import type { Event, EventStatus } from "@/types/event";

export type EventFormValues = {
  title: string;
  description: string;
  content: string;
  location: string;
  status: EventStatus;
  start_date: string;
  end_date: string;
};

export type EventFormProps = {
  event: Event | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (values: EventFormValues, thumbnail: File | null) => Promise<void>;
};
