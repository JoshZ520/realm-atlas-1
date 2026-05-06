import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEventsByRegion, createEvent } from "@/lib/db/events";
import { eventSchema, eventStatusSchema } from "@/lib/validations/event";

type Params = { params: Promise<{ worldId: string; regionId: string }> };

export async function GET(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId, regionId } = await params;
  const url = new URL(request.url);
  const rawStatus = url.searchParams.get("status") ?? undefined;

  const statusParsed = rawStatus ? eventStatusSchema.safeParse(rawStatus) : null;
  if (statusParsed && !statusParsed.success) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  const events = await getEventsByRegion(
    regionId,
    worldId,
    session.user.id,
    statusParsed?.data
  );
  if (events === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(events);
}

export async function POST(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId, regionId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const event = await createEvent(regionId, worldId, session.user.id, parsed.data);
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(event, { status: 201 });
}
