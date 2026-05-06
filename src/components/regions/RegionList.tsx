import { RegionCard } from "@/components/regions/RegionCard";
import type { RegionWithCount } from "@/types";

interface RegionListProps {
  regions: RegionWithCount[];
  worldId: string;
}

export function RegionList({ regions, worldId }: RegionListProps) {
  if (regions.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No regions yet. Add your first region to start organizing this world.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {regions.map((region) => (
        <RegionCard key={region.id} region={region} worldId={worldId} />
      ))}
    </div>
  );
}
