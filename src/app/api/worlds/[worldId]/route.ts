import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWorldById, updateWorld, deleteWorld } from "@/lib/db/worlds";
import { updateWorldSchema } from "@/lib/validations/world";

type Params = { params: Promise<{ worldId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId } = await params;
  const world = await getWorldById(worldId, session.user.id);
  if (!world) {
    // Could be not found or not owned — return 404 to avoid leaking existence
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(world);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateWorldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const world = await updateWorld(worldId, session.user.id, parsed.data);
  if (!world) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(world);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId } = await params;
  const deleted = await deleteWorld(worldId, session.user.id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
