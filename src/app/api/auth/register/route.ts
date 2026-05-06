import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { username: parsed.username },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(parsed.password, 12);
    const user = await prisma.user.create({
      data: { username: parsed.username, password: hashed },
      select: { id: true, username: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      return NextResponse.json({ errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
