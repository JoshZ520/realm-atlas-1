import { prisma } from "@/lib/prisma";
import type { EventStatus } from "@/lib/validations/event";

/** Verify region belongs to worldId and world belongs to userId. */
async function verifyRegionOwnership(regionId: string, worldId: string, userId: string) {
  return prisma.region.findFirst({
    where: { id: regionId, worldId, world: { userId } },
  });
}

export async function getEventsByRegion(
  regionId: string,
  worldId: string,
  userId: string,
  statusFilter?: EventStatus
) {
  const region = await verifyRegionOwnership(regionId, worldId, userId);
  if (!region) return null;

  return prisma.event.findMany({
    where: {
      regionId,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEventsByWorld(
  worldId: string,
  userId: string,
  filters?: { status?: EventStatus; regionId?: string }
) {
  const world = await prisma.world.findFirst({ where: { id: worldId, userId } });
  if (!world) return null;

  return prisma.event.findMany({
    where: {
      region: { worldId },
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.regionId ? { regionId: filters.regionId } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { region: { select: { id: true, name: true } } },
  });
}

export async function getEventById(
  eventId: string,
  regionId: string,
  worldId: string,
  userId: string
) {
  const region = await verifyRegionOwnership(regionId, worldId, userId);
  if (!region) return null;

  return prisma.event.findFirst({
    where: { id: eventId, regionId },
  });
}

export async function createEvent(
  regionId: string,
  worldId: string,
  userId: string,
  data: { title: string; description: string; status?: EventStatus }
) {
  const region = await verifyRegionOwnership(regionId, worldId, userId);
  if (!region) return null;
  return prisma.event.create({ data: { ...data, regionId } });
}

export async function updateEvent(
  eventId: string,
  regionId: string,
  worldId: string,
  userId: string,
  data: { title?: string; description?: string; status?: EventStatus }
) {
  const region = await verifyRegionOwnership(regionId, worldId, userId);
  if (!region) return null;

  const existing = await prisma.event.findFirst({ where: { id: eventId, regionId } });
  if (!existing) return null;

  const statusChanged = data.status !== undefined && data.status !== existing.status;

  return prisma.event.update({
    where: { id: eventId },
    data: {
      ...data,
      ...(statusChanged ? { statusUpdatedAt: new Date() } : {}),
    },
  });
}

export async function deleteEvent(
  eventId: string,
  regionId: string,
  worldId: string,
  userId: string
) {
  const region = await verifyRegionOwnership(regionId, worldId, userId);
  if (!region) return false;

  const existing = await prisma.event.findFirst({ where: { id: eventId, regionId } });
  if (!existing) return false;

  await prisma.event.delete({ where: { id: eventId } });
  return true;
}
