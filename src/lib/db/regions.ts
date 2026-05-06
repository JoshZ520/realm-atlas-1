import { prisma } from "@/lib/prisma";
import type { RegionWithCount } from "@/types";

/** Verify the world exists and belongs to userId before any region op. */
async function verifyWorldOwnership(worldId: string, userId: string) {
  return prisma.world.findFirst({ where: { id: worldId, userId } });
}

export async function getRegionsByWorldId(
  worldId: string,
  userId: string
): Promise<RegionWithCount[] | null> {
  const world = await verifyWorldOwnership(worldId, userId);
  if (!world) return null;

  type RegionRow = {
    id: string;
    name: string;
    description: string | null;
    worldId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: { events: number };
  };

  const regions: RegionRow[] = await prisma.region.findMany({
    where: { worldId },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { events: true } } },
  });

  return regions.map((r): RegionWithCount => ({
    id: r.id,
    name: r.name,
    description: r.description,
    worldId: r.worldId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    eventCount: r._count.events,
  }));
}

export async function getRegionById(
  regionId: string,
  worldId: string,
  userId: string
): Promise<(RegionWithCount & { events: { id: string; title: string; status: string; createdAt: Date }[] }) | null> {
  const world = await verifyWorldOwnership(worldId, userId);
  if (!world) return null;

  const region = await prisma.region.findFirst({
    where: { id: regionId, worldId },
    include: {
      _count: { select: { events: true } },
      events: {
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, status: true, createdAt: true },
      },
    },
  });
  if (!region) return null;

  return {
    id: region.id,
    name: region.name,
    description: region.description,
    worldId: region.worldId,
    createdAt: region.createdAt,
    updatedAt: region.updatedAt,
    eventCount: region._count.events,
    events: region.events,
  };
}

export async function createRegion(
  worldId: string,
  userId: string,
  data: { name: string; description?: string }
) {
  const world = await verifyWorldOwnership(worldId, userId);
  if (!world) return null;
  return prisma.region.create({ data: { ...data, worldId } });
}

export async function updateRegion(
  regionId: string,
  worldId: string,
  userId: string,
  data: { name?: string; description?: string | null }
) {
  const world = await verifyWorldOwnership(worldId, userId);
  if (!world) return null;
  const region = await prisma.region.findFirst({ where: { id: regionId, worldId } });
  if (!region) return null;
  return prisma.region.update({ where: { id: regionId }, data });
}

export async function deleteRegion(
  regionId: string,
  worldId: string,
  userId: string
) {
  const world = await verifyWorldOwnership(worldId, userId);
  if (!world) return false;
  const region = await prisma.region.findFirst({ where: { id: regionId, worldId } });
  if (!region) return false;
  await prisma.region.delete({ where: { id: regionId } });
  return true;
}
