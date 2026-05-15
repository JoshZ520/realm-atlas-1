import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getRegionById } from "@/lib/db/regions";
import { getEventsByRegion } from "@/lib/db/events";
import { EventList } from "@/components/events/EventList";
import { EventFilters } from "@/components/events/EventFilters";
import { AddEventButton } from "@/components/events/AddEventButton";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { eventStatusSchema } from "@/lib/validations/event";

type Props = {
  params: Promise<{ worldId: string; regionId: string }>;
  searchParams: Promise<{ status?: string; regionId?: string }>;
};

export default async function RegionDetailPage({ params, searchParams }: Props) {
  const { worldId, regionId } = await params;
  const { status: rawStatus } = await searchParams;
  const session = await auth();
  const userId = session!.user!.id as string;

  const statusParsed = rawStatus ? eventStatusSchema.safeParse(rawStatus) : null;
  const statusFilter = statusParsed?.success ? statusParsed.data : undefined;

  const [region, events] = await Promise.all([
    getRegionById(regionId, worldId, userId),
    getEventsByRegion(regionId, worldId, userId, statusFilter),
  ]);

  if (!region) notFound();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:underline">
          My Worlds
        </Link>
        <span>/</span>
        <Link href={`/worlds/${worldId}`} className="hover:underline">
          World
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{region.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{region.name}</h1>
          {region.description && (
            <p className="mt-1 text-muted-foreground">{region.description}</p>
          )}
        </div>
        <AddEventButton worldId={worldId} regionId={regionId} />
      </div>

      {/* Filters */}
      <Suspense fallback={<LoadingSkeleton rows={1} />}>
        <EventFilters regions={[]} />
      </Suspense>

      {/* Events */}
      <EventList
        events={events ?? []}
        worldId={worldId}
        regionId={regionId}
        activeFilters={{ status: rawStatus }}
      />
    </div>
  );
}
