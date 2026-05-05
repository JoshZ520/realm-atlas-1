# Research: The Realm Atlas

**Phase**: 0 — Outline & Research  
**Date**: 2026-05-05  
**Plan**: [plan.md](./plan.md)

All technology decisions for this project were resolved during `/speckit.clarify` sessions
(2026-04-28 and 2026-04-30). No open unknowns remain. This document records the rationale
for each decision.

---

## Decision Log

### Authentication Strategy

**Decision**: NextAuth.js v5 (beta) with Credentials Provider  
**Rationale**: Native Next.js integration; handles session management, CSRF protection, and
secure cookie handling out of the box. Credentials Provider supports username/password without
requiring OAuth. The beta (v5) aligns with Next.js App Router patterns.  
**Alternatives considered**:

- Custom JWT implementation — rejected: more attack surface, no built-in session management
- Auth.js with OAuth only — rejected: spec requires username/password, no social login required

### Password Hashing

**Decision**: bcryptjs, cost factor ≥ 12  
**Rationale**: Industry-standard adaptive hashing algorithm. Cost factor 12 provides ~300 ms
hashing time, sufficient to deter brute-force attacks while remaining acceptable for UX.
Constitution mandates cost factor ≥ 12.  
**Alternatives considered**:

- argon2 — viable, but bcryptjs is simpler to configure in Node.js and widely audited

### Database

**Decision**: PostgreSQL  
**Rationale**: Relational data model with well-defined foreign key relationships
(User → World → Region → Event → Outcome). Cascade deletes are native SQL. Strong ACID
guarantees ensure data integrity for the account deletion requirement.  
**Alternatives considered**:

- MongoDB — rejected: document model adds complexity for relational hierarchy with cascade deletes
- SQLite — rejected: insufficient for 50 concurrent users and production hosting

### ORM

**Decision**: Prisma ORM  
**Rationale**: Type-safe query builder eliminates runtime type errors. Schema-first migrations
are version-controlled. `_count` aggregations satisfy the dashboard event-count requirement
without raw SQL. `include` with `select` projections prevent N+1 queries.  
**Alternatives considered**:

- Drizzle ORM — viable modern alternative; rejected in favour of Prisma's mature ecosystem
- Raw SQL (pg) — rejected: no type safety, more boilerplate for CRUD operations

### Frontend Framework

**Decision**: Next.js 15 with App Router  
**Rationale**: SSR reduces initial load time (LCP target). React Server Components (RSC) keep
JavaScript bundle small. API routes co-located in the same repository simplifies deployment.
Built-in code splitting satisfies the < 200 KB gzipped per route target.  
**Alternatives considered**:

- Remix — viable, rejected to maintain consistency with existing team familiarity
- SPA (Vite + React) — rejected: SSR required for performance targets on 3G

### UI Components

**Decision**: Tailwind CSS 4 + shadcn/ui  
**Rationale**: shadcn/ui provides accessible, keyboard-navigable components out of the box
(WCAG 2.1 AA). Components are copied into the project for full customization without
vendor lock-in. Tailwind enforces design token consistency and provides `motion-safe:`/
`motion-reduce:` utilities for animation compliance.  
**Alternatives considered**:

- Chakra UI — rejected: heavier bundle, less Tailwind synergy
- MUI — rejected: design language conflicts with custom DM-themed aesthetic

### Form Validation

**Decision**: react-hook-form + zod  
**Rationale**: react-hook-form minimizes re-renders; zod schemas are shared between
client-side validation and server-side API validation, ensuring a single source of truth
for all field constraints (character limits, password rules).  
**Alternatives considered**:

- Formik — rejected: more verbose, more re-renders than react-hook-form

### Testing Stack

**Decision**: Jest + React Testing Library (unit/integration) + Playwright (e2e)  
**Rationale**: Jest is the standard Next.js test runner with `@testing-library/react`
for component tests. Playwright provides reliable cross-browser e2e testing and supports
the Given/When/Then acceptance scenarios directly.  
**Alternatives considered**:

- Vitest — viable; Jest chosen for broader Next.js ecosystem support
- Cypress — rejected: Playwright has better performance and parallel test execution

---

## N+1 Prevention Strategy

Dashboard query pattern (worlds list with counts):

```
prisma.world.findMany({
  where: { userId },
  include: { _count: { select: { regions: true } } },
  // event counts: separate aggregate or nested _count through regions
})
```

For active event counts per world, a single aggregation query groups by `region.worldId`
filtered by `status = active`. This is resolved in `data-model.md`.

## Cascade Delete Strategy

All foreign key relationships use `onDelete: Cascade` in Prisma schema:

- Deleting a User → cascades to all Worlds, Regions, Events, Outcomes
- Deleting a World → cascades to Regions, Events, Outcomes
- Deleting a Region → cascades to Events, Outcomes
- Deleting an Event → cascades to Outcomes

Confirmation dialogs in the UI show item counts before destructive operations (FR-015).

## Session Management

- NextAuth session stored in JWT (stateless) with 30-minute inactivity timeout
- `middleware.ts` at repo root protects all `(protected)` routes
- Unauthenticated requests redirect to `/login` (FR-019)
- Session expiry during edit: changes lost, redirect to login with "Session expired" message
