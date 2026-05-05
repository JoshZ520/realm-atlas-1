# Data Model: The Realm Atlas

**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-05  
**Plan**: [plan.md](./plan.md)

---

## Entity Relationship Overview

```
User
 └── World (many)
      └── Region (many)
           └── Event (many)
                └── Outcome (many)
```

All relationships cascade on delete. A user owns all their data exclusively (FR-003).

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique @db.VarChar(50)
  password  String   // bcryptjs hash, cost factor ≥ 12
  createdAt DateTime @default(now())

  worlds World[]

  @@index([username])
}

model World {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(100)
  description String?  @db.VarChar(2000)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId  String
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  regions Region[]

  @@index([userId])
}

model Region {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(100)
  description String?  @db.VarChar(2000)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  worldId String
  world   World   @relation(fields: [worldId], references: [id], onDelete: Cascade)
  events  Event[]

  @@index([worldId])
}

enum EventStatus {
  active
  resolved
  ignored
}

model Event {
  id              String      @id @default(cuid())
  title           String      @db.VarChar(100)
  description     String      @db.VarChar(2000)
  status          EventStatus @default(active)
  createdAt       DateTime    @default(now())
  statusUpdatedAt DateTime    @default(now())

  regionId String
  region   Region    @relation(fields: [regionId], references: [id], onDelete: Cascade)
  outcomes Outcome[]

  @@index([regionId])
  @@index([regionId, status])   // supports filter-by-status within a region
}

model Outcome {
  id          String   @id @default(cuid())
  description String   @db.VarChar(2000)
  occurred    Boolean  @default(false)
  createdAt   DateTime @default(now())

  eventId String
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@index([eventId])
}
```

---

## Validation Rules (zod — shared client + server)

### User

| Field    | Constraint                                      | Error Message                                                           |
| -------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| username | Required, 3–50 chars, alphanumeric + underscore | "Username must be 3–50 characters (letters, numbers, underscores)"      |
| password | Required, ≥ 8 chars, ≥ 1 letter, ≥ 1 number     | "Password must be at least 8 characters with one letter and one number" |

### World

| Field       | Constraint             | Error Message            |
| ----------- | ---------------------- | ------------------------ |
| name        | Required, 1–100 chars  | "World name is required" |
| description | Optional, ≤ 2000 chars | —                        |

### Region

| Field       | Constraint             | Error Message             |
| ----------- | ---------------------- | ------------------------- |
| name        | Required, 1–100 chars  | "Region name is required" |
| description | Optional, ≤ 2000 chars | —                         |

### Event

| Field       | Constraint                          | Error Message                   |
| ----------- | ----------------------------------- | ------------------------------- |
| title       | Required, 1–100 chars               | "Event title is required"       |
| description | Required, 1–2000 chars              | "Event description is required" |
| status      | Enum: active \| resolved \| ignored | —                               |

### Outcome

| Field       | Constraint             | Error Message                     |
| ----------- | ---------------------- | --------------------------------- |
| description | Required, 1–2000 chars | "Outcome description is required" |
| occurred    | Boolean, default false | —                                 |

---

## State Transitions

### Event Status

Any status can transition freely to any other status (FR-008):

```
active ↔ resolved ↔ ignored ↔ active
```

On every status change, `statusUpdatedAt` is updated to `now()`.

### Outcome Occurrence

`occurred` is a boolean toggle. Multiple outcomes on the same event can be marked `occurred: true`
simultaneously. Marking an outcome does NOT affect the parent event's status (FR-013, clarification
2026-04-28).

---

## Dashboard Aggregate Queries

### World list with total event count and active event count

```typescript
// lib/db/worlds.ts
const worlds = await prisma.world.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" },
  include: {
    _count: { select: { regions: true } },
    regions: {
      select: {
        _count: { select: { events: true } },
        events: {
          where: { status: "active" },
          select: { id: true },
        },
      },
    },
  },
});
```

Post-process in application layer: sum `regions[].events.length` for active count,
sum `regions[]._count.events` for total count. This avoids raw SQL while remaining
a single database round-trip.

### Cross-region event filtering (FR-010, FR-011)

```typescript
// GET /api/worlds/:worldId/events?status=active&regionId=xxx
const events = await prisma.event.findMany({
  where: {
    region: { worldId },
    ...(status ? { status } : {}),
    ...(regionId ? { regionId } : {}),
  },
  include: { region: { select: { name: true } } },
  orderBy: { createdAt: "desc" },
});
```
