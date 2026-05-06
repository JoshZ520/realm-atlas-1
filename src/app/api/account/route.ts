import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body?.confirm !== "DELETE") {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: session.user.id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
