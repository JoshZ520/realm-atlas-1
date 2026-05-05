# Implementation Plan: The Realm Atlas

**Branch**: `001-realm-atlas` | **Date**: 2026-05-05 | **Spec**: [specs/spec.md](./spec.md)
**Input**: Feature specification from `specs/spec.md`

## Summary

The Realm Atlas is a full-stack web application for Dungeon Masters to create and track living
campaign worlds. Users manage a hierarchy of Worlds → Regions → Events → Outcomes, with event
status tracking and filtering. Built with Next.js (App Router), PostgreSQL via Prisma ORM,
NextAuth.js Credentials Provider, and Tailwind CSS + shadcn/ui. The P1 deliverable covers auth
and the full CRUD hierarchy; P2 adds event filtering and status history; P3 adds branching outcomes.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 15, Prisma 6, NextAuth.js 5 (beta), Tailwind CSS 4, shadcn/ui, react-hook-form 7, zod 4, bcryptjs 3  
**Storage**: PostgreSQL  
**Testing**: Jest + React Testing Library (unit/integration), Playwright (e2e)  
**Target Platform**: Web — desktop-first (320 px+ responsive)  
**Project Type**: Web application (Next.js full-stack, App Router)  
**Performance Goals**: API p95 < 200 ms; LCP ≤ 2.5 s; INP ≤ 200 ms; CLS ≤ 0.1  
**Constraints**: Desktop-first v1; 50 concurrent users; 3-click navigation; session timeout 30 min  
**Scale/Scope**: ~50 concurrent users; 1–5 worlds/DM; 5–20 regions/world; 10–50 events/region

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**I. Code Quality Excellence**

- [x] SOLID principles will be followed in service and model design
- [x] Cyclomatic complexity limit (≤ 10 per function) enforced via ESLint config
- [x] Function length limit (≤ 40 lines) agreed upon and enforced
- [x] Code will be peer-reviewed before merge
- [x] ESLint + TypeScript strict mode configured; zero warnings policy enforced
- [x] No duplicate logic — shared Prisma queries extracted to `lib/db/` helpers

**II. Testing Standards (TDD)**

- [x] Test strategy defined: unit 70% / integration 20% / e2e 10%
- [x] Jest + React Testing Library for unit/integration; Playwright for e2e
- [x] Critical paths: auth (register/login/session), data persistence (CRUD cascade deletes),
      authorization (user data isolation)
- [x] Acceptance criteria from spec written as Given/When/Then tests
- [x] 80% coverage target for business logic; 100% for auth and authorization paths
- [x] Mutation testing planned for auth and authorization modules (target ≥ 70%)
- [x] Test naming: `given_<state>_when_<action>_then_<outcome>` convention

**III. User Experience Consistency**

- [x] shadcn/ui design system — all components sourced from it; no ad-hoc overrides
- [x] WCAG 2.1 AA: semantic HTML, ARIA labels, keyboard navigation, screen-reader support;
      contrast 4.5:1 normal text, 3:1 large text enforced via Tailwind palette
- [x] Touch targets 44 × 44 px minimum for all interactive elements
- [x] Responsive breakpoints: 320 px (mobile) / 768 px (tablet) / 1024 px (desktop)
- [x] `prefers-reduced-motion` handled via Tailwind `motion-safe:` / `motion-reduce:` utilities
- [x] Error messages in plain English; no stack traces or technical codes exposed to users
- [x] Loading states: skeleton loaders and optimistic updates within 100 ms of action

**IV. Performance Requirements**

- [x] API p95 < 200 ms — Prisma indexes on foreign keys and filter fields
- [x] Page load < 2 s on 3G — Next.js SSR + RSC streaming; static shell served instantly
- [x] Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1
- [x] Lighthouse CI gate: ≥ 90 Performance, Accessibility, Best Practices
- [x] N+1 prevention: Prisma `include` with select projections; dashboard counts via `_count`
- [x] Bundle size < 200 KB gzipped per route — Next.js route-level code splitting
- [x] Scalability: connection pooling via PgBouncer-compatible Prisma Accelerate (or direct pool)
- [x] RUM via Vercel Speed Insights (or equivalent) before production release

## Project Structure

### Documentation (this feature)

```text
specs/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api.md           # REST API contracts
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root — Next.js App Router)

```text
src/
├── app/
│   ├── layout.tsx                          # Root layout (fonts, providers)
│   ├── page.tsx                            # Redirect → /login or /dashboard
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx                      # Auth guard layout
│   │   ├── dashboard/page.tsx              # World list with event counts
│   │   └── worlds/
│   │       └── [worldId]/
│   │           ├── page.tsx                # World detail: regions list
│   │           └── regions/
│   │               └── [regionId]/
│   │                   ├── page.tsx        # Region detail: events list
│   │                   └── events/
│   │                       └── [eventId]/
│   │                           └── page.tsx  # Event detail: status + outcomes
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts      # NextAuth handler
│       │   └── register/route.ts           # POST /api/auth/register
│       ├── worlds/
│       │   ├── route.ts                    # GET, POST /api/worlds
│       │   └── [worldId]/
│       │       ├── route.ts                # GET, PUT, DELETE /api/worlds/:id
│       │       ├── events/route.ts         # GET /api/worlds/:id/events (cross-region filter)
│       │       └── regions/
│       │           ├── route.ts            # GET, POST /api/worlds/:id/regions
│       │           └── [regionId]/
│       │               ├── route.ts        # GET, PUT, DELETE /api/worlds/:id/regions/:id
│       │               └── events/
│       │                   ├── route.ts    # GET, POST /api/.../events
│       │                   └── [eventId]/
│       │                       ├── route.ts    # GET, PUT, DELETE /api/.../events/:id
│       │                       └── outcomes/
│       │                           ├── route.ts           # GET, POST outcomes
│       │                           └── [outcomeId]/
│       │                               └── route.ts       # PUT, DELETE outcome
│       └── account/
│           └── route.ts                    # DELETE /api/account
├── components/
│   ├── ui/                                 # shadcn/ui generated components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── worlds/
│   │   ├── WorldCard.tsx
│   │   ├── WorldForm.tsx
│   │   └── WorldList.tsx
│   ├── regions/
│   │   ├── RegionCard.tsx
│   │   ├── RegionForm.tsx
│   │   └── RegionList.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── EventList.tsx
│   │   ├── EventStatusBadge.tsx
│   │   └── EventFilters.tsx
│   ├── outcomes/
│   │   ├── OutcomeItem.tsx
│   │   └── OutcomeForm.tsx
│   └── shared/
│       ├── DeleteConfirmDialog.tsx
│       ├── LoadingSkeleton.tsx
│       └── ErrorMessage.tsx
├── lib/
│   ├── auth.ts                             # NextAuth config (Credentials Provider)
│   ├── prisma.ts                           # Prisma client singleton
│   ├── validations/
│   │   ├── auth.ts                         # zod schemas: register, login
│   │   ├── world.ts
│   │   ├── region.ts
│   │   ├── event.ts
│   │   └── outcome.ts
│   └── utils.ts                            # cn(), formatDate(), etc.
└── types/
    └── index.ts                            # Shared TypeScript types

prisma/
├── schema.prisma
└── migrations/

tests/
├── unit/
│   ├── lib/validations/
│   └── components/
├── integration/
│   └── api/
└── e2e/
    └── flows/
        ├── auth.spec.ts
        ├── world-management.spec.ts
        └── event-tracking.spec.ts
```

**Structure Decision**: Next.js App Router with route groups `(auth)` and `(protected)` for layout
separation. API routes co-located under `app/api/` following RESTful hierarchy matching the entity
tree. All business logic in `lib/` and Prisma service helpers to keep route handlers thin (≤ 40 lines).

## Delivery Phases

### Phase 1 — MVP (P1 user stories: auth + worlds + regions)

- User registration and login (NextAuth.js Credentials Provider + bcryptjs)
- Session-protected routes via middleware
- CRUD: Worlds (with event counts on dashboard)
- CRUD: Regions (with event counts)
- Cascade deletes with confirmation dialogs
- PostgreSQL schema + Prisma migrations

### Phase 2 — Core Tracking (P2 user stories: events + status)

- CRUD: Events with status (active / resolved / ignored)
- Status change with timestamp recording
- Cross-region event filtering by status and region
- Event history view (created at + status updated at)

### Phase 3 — Advanced (P3 user story: outcomes)

- CRUD: Outcomes per event
- Mark outcome as occurred (independent of event status)
- Multi-outcome support per event

### Phase 4 — Quality & Polish

- Full test suite (unit + integration + e2e)
- Lighthouse CI gate configuration
- Accessibility audit (WCAG 2.1 AA pass)
- Performance profiling + N+1 query verification
- Account deletion flow

## Complexity Tracking

_No constitution violations requiring justification._
