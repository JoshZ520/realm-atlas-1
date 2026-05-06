import { auth } from "@/lib/auth";
import { getWorldsWithCounts } from "@/lib/db/worlds";
import { WorldList } from "@/components/worlds/WorldList";
import { CreateWorldButton } from "@/components/worlds/CreateWorldButton";

export default async function DashboardPage() {
  const session = await auth();
  const worlds = await getWorldsWithCounts(session!.user!.id as string);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Worlds</h1>
        <CreateWorldButton />
      </div>
      <WorldList worlds={worlds} />
    </div>
  );
}
