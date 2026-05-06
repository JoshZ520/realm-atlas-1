import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getWorldById } from "@/lib/db/worlds";
import { RegionList } from "@/components/regions/RegionList";
import { AddRegionButton } from "@/components/regions/AddRegionButton";

type Props = { params: Promise<{ worldId: string }> };

export default async function WorldDetailPage({ params }: Props) {
  const { worldId } = await params;
  const session = await auth();
  const world = await getWorldById(worldId, session!.user!.id as string);

  if (!world) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:underline">
          My Worlds
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{world.name}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{world.name}</h1>
          {world.description && (
            <p className="mt-1 text-muted-foreground">{world.description}</p>
          )}
        </div>
        <AddRegionButton worldId={worldId} />
      </div>

      <RegionList regions={world.regions} worldId={worldId} />
    </div>
  );
}
