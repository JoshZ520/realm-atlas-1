import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRegionById, updateRegion, deleteRegion } from "@/lib/db/regions";
import { updateRegionSchema } from "@/lib/validations/region";

type Params = { params: Promise<{ worldId: string; regionId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId, regionId } = await params;
  const region = await getRegionById(regionId, worldId, session.user.id);
  if (!region) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(region);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId, regionId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateRegionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const region = await updateRegion(regionId, worldId, session.user.id, parsed.data);
  if (!region) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(region);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId, regionId } = await params;
  const deleted = await deleteRegion(regionId, worldId, session.user.id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
