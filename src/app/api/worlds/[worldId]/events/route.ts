import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEventsByWorld } from "@/lib/db/events";
import { eventStatusSchema } from "@/lib/validations/event";

type Params = { params: Promise<{ worldId: string }> };

export async function GET(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId } = await params;
  const url = new URL(request.url);
  const rawStatus = url.searchParams.get("status") ?? undefined;
  const regionId = url.searchParams.get("regionId") ?? undefined;

  const statusParsed = rawStatus ? eventStatusSchema.safeParse(rawStatus) : null;
  if (statusParsed && !statusParsed.success) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }
  const status = statusParsed?.data;

  const events = await getEventsByWorld(worldId, session.user.id, { status, regionId });
  if (events === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(events);
}
