import { WorldCard } from "@/components/worlds/WorldCard";
import type { WorldWithCounts } from "@/types";

interface WorldListProps {
  worlds: WorldWithCounts[];
}

export function WorldList({ worlds }: WorldListProps) {
  if (worlds.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No worlds yet. Create your first world to get started.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {worlds.map((world) => (
        <WorldCard key={world.id} world={world} />
      ))}
    </div>
  );
}
