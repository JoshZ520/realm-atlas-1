import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRegionsByWorldId, createRegion } from "@/lib/db/regions";
import { regionSchema } from "@/lib/validations/region";

type Params = { params: Promise<{ worldId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId } = await params;
  const regions = await getRegionsByWorldId(worldId, session.user.id);
  if (regions === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(regions);
}

export async function POST(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { worldId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = regionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const region = await createRegion(worldId, session.user.id, parsed.data);
  if (!region) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(region, { status: 201 });
}
