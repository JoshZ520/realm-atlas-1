export type EventStatus = "active" | "resolved" | "ignored";

export interface WorldBase {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface RegionBase {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  worldId: string;
}

export interface EventBase {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  createdAt: Date;
  statusUpdatedAt: Date;
  regionId: string;
}

export type WorldWithCounts = WorldBase & {
  totalEventCount: number;
  activeEventCount: number;
};

export type RegionWithCount = RegionBase & {
  eventCount: number;
};

export type EventWithRegion = EventBase & {
  region?: { id: string; name: string };
};

export type WorldWithRegions = WorldBase & {
  regions: (RegionBase & { eventCount: number })[];
};
