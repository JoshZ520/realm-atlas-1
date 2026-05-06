import { EventCard } from "@/components/events/EventCard";
import type { EventStatus } from "@/lib/validations/event";

interface EventItem {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  createdAt: Date;
}

interface EventListProps {
  events: EventItem[];
  worldId: string;
  regionId: string;
  activeFilters?: { status?: string; regionId?: string };
}

export function EventList({ events, worldId, regionId, activeFilters }: EventListProps) {
  if (events.length === 0) {
    const hasFilters = activeFilters?.status || activeFilters?.regionId;
    return (
      <p className="py-12 text-center text-muted-foreground">
        {hasFilters
          ? "No events match the current filters."
          : "No events yet. Add your first event to start tracking."}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          worldId={worldId}
          regionId={regionId}
        />
      ))}
    </div>
  );
}
