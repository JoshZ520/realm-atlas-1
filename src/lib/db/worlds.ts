import { prisma } from "@/lib/prisma";
import type { WorldWithCounts, WorldWithRegions } from "@/types";

export async function getWorldsWithCounts(userId: string): Promise<WorldWithCounts[]> {
  const worlds = await prisma.world.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { regions: true },
      },
      regions: {
        include: {
          _count: {
            select: { events: true },
          },
          events: {
            select: { status: true },
          },
        },
      },
    },
  });

  return worlds.map((world) => {
    const totalEventCount = world.regions.reduce(
      (sum, region) => sum + region._count.events,
      0
    );
    const activeEventCount = world.regions.reduce(
      (sum, region) =>
        sum + region.events.filter((e) => e.status === "active").length,
      0
    );
    return {
      id: world.id,
      name: world.name,
      description: world.description,
      userId: world.userId,
      createdAt: world.createdAt,
      updatedAt: world.updatedAt,
      totalEventCount,
      activeEventCount,
    };
  });
}

export async function getWorldById(
  worldId: string,
  userId: string
): Promise<WorldWithRegions | null> {
  const world = await prisma.world.findFirst({
    where: { id: worldId, userId },
    include: {
      regions: {
        orderBy: { createdAt: "asc" },
        include: {
          _count: { select: { events: true } },
        },
      },
    },
  });
  if (!world) return null;
  return {
    id: world.id,
    name: world.name,
    description: world.description,
    userId: world.userId,
    createdAt: world.createdAt,
    updatedAt: world.updatedAt,
    regions: world.regions.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      worldId: r.worldId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      eventCount: r._count.events,
    })),
  };
}

export async function createWorld(
  userId: string,
  data: { name: string; description?: string }
) {
  return prisma.world.create({
    data: { ...data, userId },
  });
}

export async function updateWorld(
  worldId: string,
  userId: string,
  data: { name?: string; description?: string | null }
) {
  const existing = await prisma.world.findFirst({ where: { id: worldId, userId } });
  if (!existing) return null;
  return prisma.world.update({ where: { id: worldId }, data });
}

export async function deleteWorld(worldId: string, userId: string) {
  const existing = await prisma.world.findFirst({ where: { id: worldId, userId } });
  if (!existing) return false;
  await prisma.world.delete({ where: { id: worldId } });
  return true;
}
