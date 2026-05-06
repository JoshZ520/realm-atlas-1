import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWorldsWithCounts, createWorld } from "@/lib/db/worlds";
import { worldSchema } from "@/lib/validations/world";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const worlds = await getWorldsWithCounts(session.user.id);
  return NextResponse.json(worlds);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = worldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const world = await createWorld(session.user.id, parsed.data);
  return NextResponse.json(world, { status: 201 });
}
