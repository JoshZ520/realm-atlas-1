# API Contracts: The Realm Atlas

**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-05  
**Plan**: [../plan.md](../plan.md)

All endpoints require an authenticated session (NextAuth JWT cookie) unless noted.
All request/response bodies are JSON. All routes return `401 Unauthorized` if unauthenticated
and `403 Forbidden` if the resource does not belong to the authenticated user.

---

## Authentication

### POST /api/auth/register

Register a new user account.

**Request body**
```json
{
  "username": "dungeon_master_42",
  "password": "SecurePass1"
}
```

**Responses**

| Status | Body | Description |
|--------|------|-------------|
| 201 | `{ "id": "...", "username": "..." }` | Account created |
| 400 | `{ "errors": { "username": "...", "password": "..." } }` | Validation failed |
| 409 | `{ "error": "Username already exists" }` | Duplicate username |

---

### POST /api/auth/[...nextauth]

Handled by NextAuth.js. Credentials sign-in and sign-out.

**Sign in**: POST `/api/auth/callback/credentials` with `{ username, password }`  
**Sign out**: POST `/api/auth/signout`

| Status | Description |
|--------|-------------|
| 200 | Session cookie set (sign-in success) |
| 401 | `{ "error": "Invalid credentials" }` |

---

## Worlds

### GET /api/worlds

List all worlds for the authenticated user with event counts.

**Response 200**
```json
[
  {
    "id": "clx...",
    "name": "Forgotten Realms Campaign",
    "description": "Standard D&D setting",
    "createdAt": "2026-05-01T10:00:00Z",
    "totalEventCount": 15,
    "activeEventCount": 8
  }
]
```

### POST /api/worlds

**Request body**: `{ "name": "string (required)", "description": "string (optional)" }`

**Responses**: 201 (world object) | 400 (validation errors) | 401

---

### GET /api/worlds/:worldId

World object with nested regions (each with `eventCount`).

### PUT /api/worlds/:worldId

**Request body** *(partial)*: `{ "name"?, "description"? }`

**Responses**: 200 | 400 | 403 | 404

### DELETE /api/worlds/:worldId

Cascade-deletes all regions, events, and outcomes.

**Responses**: 204 | 403 | 404

---

## Regions

### GET /api/worlds/:worldId/regions

Regions array, each with `eventCount`.

### POST /api/worlds/:worldId/regions

**Request body**: `{ "name": "required", "description"? }`

**Responses**: 201 | 400 | 403

### GET /api/worlds/:worldId/regions/:regionId

Region object with nested `events[]`.

### PUT /api/worlds/:worldId/regions/:regionId

**Request body** *(partial)*: `{ "name"?, "description"? }`

**Responses**: 200 | 400 | 403 | 404

### DELETE /api/worlds/:worldId/regions/:regionId

Cascade-deletes events and outcomes.

**Responses**: 204 | 403 | 404

---

## Events

### GET /api/worlds/:worldId/events

Cross-region event list for a world.

**Query params**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `active` \| `resolved` \| `ignored` | Filter by status |
| `regionId` | string | Filter to one region |

**Response 200**
```json
[
  {
    "id": "clx...",
    "title": "Goblin raids",
    "description": "Trade routes under attack",
    "status": "active",
    "createdAt": "2026-05-01T10:00:00Z",
    "statusUpdatedAt": "2026-05-03T14:00:00Z",
    "region": { "id": "clx...", "name": "Waterdeep" }
  }
]
```

### GET /api/worlds/:worldId/regions/:regionId/events

Events in one region. Supports `?status=` filter.

### POST /api/worlds/:worldId/regions/:regionId/events

**Request body**: `{ "title": "required", "description": "required", "status"?: "active" }`

**Responses**: 201 | 400 | 403

### GET /api/worlds/:worldId/regions/:regionId/events/:eventId

Event object with nested `outcomes[]`.

**Response 200**
```json
{
  "id": "clx...",
  "title": "Goblin raids",
  "description": "Trade routes under attack",
  "status": "active",
  "createdAt": "2026-05-01T10:00:00Z",
  "statusUpdatedAt": "2026-05-03T14:00:00Z",
  "outcomes": [
    { "id": "clx...", "description": "Players negotiate peace", "occurred": false }
  ]
}
```

### PUT /api/worlds/:worldId/regions/:regionId/events/:eventId

When `status` changes, server updates `statusUpdatedAt` to `now()`.

**Request body** *(partial)*: `{ "title"?, "description"?, "status"? }`

**Responses**: 200 | 400 | 403 | 404

### DELETE /api/worlds/:worldId/regions/:regionId/events/:eventId

**Responses**: 204 | 403 | 404

---

## Outcomes

### GET /api/worlds/:worldId/regions/:regionId/events/:eventId/outcomes

Outcomes array for an event.

### POST /api/worlds/:worldId/regions/:regionId/events/:eventId/outcomes

**Request body**: `{ "description": "required" }`

**Responses**: 201 | 400 | 403

### PUT /api/worlds/:worldId/regions/:regionId/events/:eventId/outcomes/:outcomeId

Toggle `occurred` or update description. Does NOT affect parent event status.

**Request body** *(partial)*: `{ "occurred"?, "description"? }`

**Responses**: 200 | 400 | 403 | 404

### DELETE /api/worlds/:worldId/regions/:regionId/events/:eventId/outcomes/:outcomeId

**Responses**: 204 | 403 | 404

---

## Account

### DELETE /api/account

Permanently deletes the user and all their data (cascade).

**Request body**: `{ "confirm": "DELETE" }` *(required to prevent accidental deletion)*

| Status | Description |
|--------|-------------|
| 204 | Account permanently deleted |
| 400 | `{ "error": "Confirmation required" }` |
| 401 | Not authenticated |
