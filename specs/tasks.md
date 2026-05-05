# Tasks: The Realm Atlas

**Branch**: `001-realm-atlas` | **Date**: 2026-05-05
**Input**: Design documents from `specs/`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md) | **API**: [contracts/api.md](./contracts/api.md)

**Tests**: Per Constitution Principle II, TDD is MANDATORY. Write tests FIRST, verify they FAIL, then implement (Red-Green-Refactor).

**Organization**: Tasks grouped by user story. Each story is an independently testable and deployable increment.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js project, install all dependencies, configure tooling.

- [ ] T001 Initialize Next.js 15 App Router project with TypeScript, Tailwind CSS, ESLint, and `src/` directory structure per `specs/quickstart.md`
- [ ] T002 Install all production dependencies: `prisma @prisma/client next-auth@beta bcryptjs react-hook-form @hookform/resolvers zod class-variance-authority clsx tailwind-merge`
- [ ] T003 [P] Install dev dependencies: `@types/bcryptjs jest @testing-library/react @testing-library/jest-dom @playwright/test`
- [ ] T004 [P] Configure ESLint with TypeScript strict mode and zero-warnings policy in `eslint.config.mjs`
- [ ] T005 [P] Initialize shadcn/ui and add base components: `button input label card dialog badge skeleton` per `specs/quickstart.md`
- [ ] T006 [P] Configure Jest with `jest.config.ts` and `jest.setup.ts` (`@testing-library/jest-dom` setup); add `npm test` script
- [ ] T007 [P] Configure Playwright with `playwright.config.ts`; add `npm run test:e2e` script
- [ ] T008 Create `.env.local` template (`.env.local.example`) with `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` placeholders

**Checkpoint**: Project boots (`npm run dev`) with zero lint warnings, test runner executes, Playwright config valid.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure all user stories depend on. MUST complete before any user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T009 Copy Prisma schema from `specs/data-model.md` into `prisma/schema.prisma` (User, World, Region, Event/EventStatus, Outcome models with all indexes and cascade relations)
- [ ] T010 Run `npx prisma migrate dev --name init` to create initial migration and run `npx prisma generate` to generate the client
- [ ] T011 Create Prisma client singleton in `src/lib/prisma.ts` (global instance pattern for dev hot-reload safety)
- [ ] T012 [P] Create zod validation schemas in `src/lib/validations/auth.ts` (register: username 3–50 chars alphanumeric+underscore, password ≥8 chars with ≥1 letter and ≥1 number)
- [ ] T013 [P] Create zod validation schemas in `src/lib/validations/world.ts`, `src/lib/validations/region.ts`, `src/lib/validations/event.ts`, `src/lib/validations/outcome.ts` (all field constraints from data-model.md)
- [ ] T014 Create utility helpers in `src/lib/utils.ts` (`cn()` for Tailwind class merging, `formatDate()`)
- [ ] T015 [P] Create shared TypeScript types in `src/types/index.ts` (WorldWithCounts, RegionWithCount, EventWithOutcomes, etc.)
- [ ] T016 Create root layout in `src/app/layout.tsx` (fonts, SessionProvider wrapper, Tailwind base styles)
- [ ] T017 Create shared UI components: `src/components/shared/ErrorMessage.tsx`, `src/components/shared/LoadingSkeleton.tsx`, `src/components/shared/DeleteConfirmDialog.tsx`

**Checkpoint**: Database migrated and Prisma client works; all zod schemas importable; shared components render without errors.

---

## Phase 3: User Story 1 — User Authentication (Priority: P1) 🎯 MVP

**Goal**: DMs can register, log in, log out, and have their data isolated per account. Unauthenticated users are redirected to login.

**Independent Test**: Register a new account → log out → log back in → verify dashboard loads → verify cannot access another user's routes.

### Tests for User Story 1 (TDD — Write First) ✓

> **CONSTITUTION REQUIREMENT**: Write these tests FIRST, verify they FAIL, then implement.

- [ ] T018 [P] [US1] Write unit tests for `src/lib/validations/auth.ts` in `tests/unit/lib/validations/auth.test.ts` (valid/invalid username formats, password rules, edge cases)
- [ ] T019 [P] [US1] Write integration tests for `POST /api/auth/register` in `tests/integration/api/auth.test.ts` (success 201, duplicate username 409, validation errors 400)
- [ ] T020 [P] [US1] Write integration tests for NextAuth sign-in/sign-out in `tests/integration/api/auth.test.ts` (valid credentials 200, invalid credentials 401)
- [ ] T021 [P] [US1] Write e2e test for registration flow in `tests/e2e/flows/auth.spec.ts` (Given new user, When registers with valid credentials, Then redirected to dashboard)
- [ ] T022 [P] [US1] Write e2e test for login flow in `tests/e2e/flows/auth.spec.ts` (Given existing user, When logs in, Then sees world list)
- [ ] T023 [P] [US1] Write e2e test for auth guard in `tests/e2e/flows/auth.spec.ts` (Given unauthenticated user, When accesses /dashboard, Then redirected to /login)

### Implementation for User Story 1

- [ ] T024 [US1] Configure NextAuth.js in `src/lib/auth.ts` (Credentials Provider with Prisma user lookup and bcryptjs.compare; JWT strategy; 30-min maxAge)
- [ ] T025 [US1] Create NextAuth route handler in `src/app/api/auth/[...nextauth]/route.ts` (export handlers from `src/lib/auth.ts`)
- [ ] T026 [US1] Create registration API route in `src/app/api/auth/register/route.ts` (validate with zod, check username uniqueness, hash password with bcryptjs cost=12, create User via Prisma, return 201/400/409)
- [ ] T027 [US1] Create middleware in `src/middleware.ts` (protect all routes except `/login`, `/register`, `/api/auth/**`; redirect unauthenticated to `/login`)
- [ ] T028 [P] [US1] Create `RegisterForm` component in `src/components/auth/RegisterForm.tsx` (react-hook-form + zod resolver; username, password fields; inline validation errors)
- [ ] T029 [P] [US1] Create `LoginForm` component in `src/components/auth/LoginForm.tsx` (react-hook-form; username, password fields; "Invalid credentials" error handling)
- [ ] T030 [US1] Create register page in `src/app/(auth)/register/page.tsx` (renders RegisterForm; redirects to dashboard if already authenticated)
- [ ] T031 [US1] Create login page in `src/app/(auth)/login/page.tsx` (renders LoginForm; redirects to dashboard if already authenticated)
- [ ] T032 [US1] Create protected layout in `src/app/(protected)/layout.tsx` (auth session check; logout button; basic nav shell)
- [ ] T033 [US1] Create root redirect in `src/app/page.tsx` (redirect authenticated → `/dashboard`, unauthenticated → `/login`)
- [ ] T034 [US1] Create account deletion API route in `src/app/api/account/route.ts` (DELETE; require `{ confirm: "DELETE" }` body; cascade delete user via Prisma; sign out session; return 204/400/401)

**Checkpoint**: US1 fully functional — register, login, logout, auth guard, account deletion all work. All US1 tests pass.

---

## Phase 4: User Story 2 — Create and Manage Campaign Worlds (Priority: P1)

**Goal**: Authenticated DMs can create, view, edit, and delete worlds. Dashboard shows world list with event counts.

**Independent Test**: Create a world → view it on dashboard with 0 counts → edit its name → delete it → verify it's gone.

### Tests for User Story 2 (TDD — Write First) ✓

- [ ] T035 [P] [US2] Write integration tests for `GET /api/worlds` in `tests/integration/api/worlds.test.ts` (returns only authenticated user's worlds with counts; empty array for new user)
- [ ] T036 [P] [US2] Write integration tests for `POST /api/worlds` in `tests/integration/api/worlds.test.ts` (201 success, 400 missing name, 401 unauthenticated)
- [ ] T037 [P] [US2] Write integration tests for `PUT /api/worlds/:id` and `DELETE /api/worlds/:id` in `tests/integration/api/worlds.test.ts` (403 on another user's world, 404 not found)
- [ ] T038 [P] [US2] Write e2e test for world management in `tests/e2e/flows/world-management.spec.ts` (create world → appears on dashboard with counts → edit → delete with confirmation)

### Implementation for User Story 2

- [ ] T039 [P] [US2] Create Prisma query helper `src/lib/db/worlds.ts` (getWorldsWithCounts, getWorldById, createWorld, updateWorld, deleteWorld — all scoped to userId)
- [ ] T040 [US2] Create worlds API routes in `src/app/api/worlds/route.ts` (GET: list with `_count` aggregation for totalEventCount + activeEventCount; POST: validate with zod, create, return 201)
- [ ] T041 [US2] Create world detail/update/delete routes in `src/app/api/worlds/[worldId]/route.ts` (GET with regions; PUT partial update; DELETE cascade; all verify ownership)
- [ ] T042 [P] [US2] Create `WorldForm` component in `src/components/worlds/WorldForm.tsx` (react-hook-form; name required, description optional; used for create and edit)
- [ ] T043 [P] [US2] Create `WorldCard` component in `src/components/worlds/WorldCard.tsx` (shows name, description, total event count, active event count; edit/delete actions)
- [ ] T044 [P] [US2] Create `WorldList` component in `src/components/worlds/WorldList.tsx` (renders WorldCard list; empty state "No worlds yet")
- [ ] T045 [US2] Create dashboard page in `src/app/(protected)/dashboard/page.tsx` (server component; fetch worlds with counts; render WorldList; "Create World" button opens WorldForm dialog)

**Checkpoint**: US2 fully functional — dashboard shows worlds with counts, CRUD all work, data isolated per user. All US2 tests pass.

---

## Phase 5: User Story 3 — Organize Worlds into Regions (Priority: P1)

**Goal**: DMs can create, view, edit, and delete regions within a world. Each region shows its event count.

**Independent Test**: Select a world → create 2 regions → view both with 0 event counts → delete one with confirmation → verify cascade warning shown.

### Tests for User Story 3 (TDD — Write First) ✓

- [ ] T046 [P] [US3] Write integration tests for `GET/POST /api/worlds/:worldId/regions` in `tests/integration/api/regions.test.ts` (ownership check; 201 with valid body; 400 missing name)
- [ ] T047 [P] [US3] Write integration tests for `PUT/DELETE /api/worlds/:worldId/regions/:regionId` in `tests/integration/api/regions.test.ts` (403 on foreign world; cascade delete confirmed)
- [ ] T048 [P] [US3] Write e2e test for region management in `tests/e2e/flows/world-management.spec.ts` (open world → create region → edit → delete with confirmation dialog)

### Implementation for User Story 3

- [ ] T049 [P] [US3] Create Prisma query helper `src/lib/db/regions.ts` (getRegionsByWorldId, getRegionById, createRegion, updateRegion, deleteRegion — scoped to verified worldId/userId)
- [ ] T050 [US3] Create regions list/create routes in `src/app/api/worlds/[worldId]/regions/route.ts` (GET with event counts via `_count`; POST validate + create)
- [ ] T051 [US3] Create region detail/update/delete routes in `src/app/api/worlds/[worldId]/regions/[regionId]/route.ts` (GET with events; PUT; DELETE cascade — all verify world ownership)
- [ ] T052 [P] [US3] Create `RegionForm` component in `src/components/regions/RegionForm.tsx` (react-hook-form; name required, description optional)
- [ ] T053 [P] [US3] Create `RegionCard` component in `src/components/regions/RegionCard.tsx` (name, description, event count; edit/delete actions)
- [ ] T054 [P] [US3] Create `RegionList` component in `src/components/regions/RegionList.tsx` (list with empty state)
- [ ] T055 [US3] Create world detail page in `src/app/(protected)/worlds/[worldId]/page.tsx` (server component; fetch world with regions + counts; render RegionList; "Add Region" action)

**Checkpoint**: US1+US2+US3 all functional — full P1 MVP complete. All P1 tests pass.

---

## Phase 6: User Story 4 — Create and View Events (Priority: P2)

**Goal**: DMs can create events in regions with title, description, and status. View events per region and filter across all regions by status or region.

**Independent Test**: Create 3 events in a region with different statuses → filter by "active" → verify only active events shown → filter by region → verify correct events shown.

### Tests for User Story 4 (TDD — Write First) ✓

- [ ] T056 [P] [US4] Write integration tests for `POST /api/worlds/:id/regions/:id/events` in `tests/integration/api/events.test.ts` (201 success; 400 missing title/description; ownership enforcement)
- [ ] T057 [P] [US4] Write integration tests for `GET /api/worlds/:id/events?status=active` in `tests/integration/api/events.test.ts` (cross-region filter returns correct events; empty result when none match)
- [ ] T058 [P] [US4] Write e2e test for event creation and filtering in `tests/e2e/flows/event-tracking.spec.ts` (create events → filter by status → verify results → filter by region)

### Implementation for User Story 4

- [ ] T059 [P] [US4] Create Prisma query helper `src/lib/db/events.ts` (getEventsByRegion, getEventsByWorld with optional status/regionId filters, getEventById, createEvent, updateEvent, deleteEvent)
- [ ] T060 [US4] Create cross-region events list route in `src/app/api/worlds/[worldId]/events/route.ts` (GET with `?status` and `?regionId` query param filters; include region name)
- [ ] T061 [US4] Create region events list/create routes in `src/app/api/worlds/[worldId]/regions/[regionId]/events/route.ts` (GET with optional status filter; POST validate + create; verify ownership)
- [ ] T062 [US4] Create event detail/update/delete routes in `src/app/api/worlds/[worldId]/regions/[regionId]/events/[eventId]/route.ts` (GET with outcomes; PUT; DELETE)
- [ ] T063 [P] [US4] Create `EventStatusBadge` component in `src/components/events/EventStatusBadge.tsx` (color-coded badge: active=green, resolved=gray, ignored=yellow; WCAG 4.5:1 contrast)
- [ ] T064 [P] [US4] Create `EventFilters` component in `src/components/events/EventFilters.tsx` (status dropdown + region select; accessible labels; fires filter callback)
- [ ] T065 [P] [US4] Create `EventForm` component in `src/components/events/EventForm.tsx` (react-hook-form; title required 1–100 chars, description required 1–2000 chars, status select)
- [ ] T066 [P] [US4] Create `EventCard` component in `src/components/events/EventCard.tsx` (title, description truncated, status badge, createdAt; edit/delete actions)
- [ ] T067 [P] [US4] Create `EventList` component in `src/components/events/EventList.tsx` (renders EventCard list; "No events found" empty state with filter context)
- [ ] T068 [US4] Create region detail page in `src/app/(protected)/worlds/[worldId]/regions/[regionId]/page.tsx` (server component; fetch region with events; render EventList + EventFilters; "Add Event" action)

**Checkpoint**: US4 functional — events CRUD works, cross-region filtering works. All US4 tests pass.

---

## Phase 7: User Story 5 — Update Event Status and Track Progression (Priority: P2)

**Goal**: DMs can freely change event status. Each status change is timestamped. Status history is visible on the event detail view.

**Independent Test**: Create active event → change to resolved → verify `statusUpdatedAt` timestamp updated → change back to active → verify timestamp updates again → filter by status shows correct results.

### Tests for User Story 5 (TDD — Write First) ✓

- [ ] T069 [P] [US5] Write unit tests for status update logic in `tests/unit/lib/db/events.test.ts` (PUT with status change sets `statusUpdatedAt = now()`; PUT without status change does NOT update `statusUpdatedAt`)
- [ ] T070 [P] [US5] Write integration tests for `PUT /api/.../events/:id` status changes in `tests/integration/api/events.test.ts` (active→resolved→ignored→active all valid; statusUpdatedAt changes on each transition)
- [ ] T071 [P] [US5] Write e2e test for status tracking in `tests/e2e/flows/event-tracking.spec.ts` (change status → verify badge updates → verify timestamp shown → filter reflects new status)

### Implementation for User Story 5

- [ ] T072 [US5] Update `updateEvent` in `src/lib/db/events.ts` to set `statusUpdatedAt: new Date()` only when `status` field changes (compare incoming status vs current before update)
- [ ] T073 [US5] Create event detail page in `src/app/(protected)/worlds/[worldId]/regions/[regionId]/events/[eventId]/page.tsx` (server component; shows title, description, status badge, createdAt, statusUpdatedAt; inline status change control; outcomes section placeholder)
- [ ] T074 [US5] Add status change control to event detail page (client component with optimistic update; status select triggers PUT; updates badge within 100 ms per constitution UX requirement)

**Checkpoint**: US5 functional — status changes persist with timestamps, history visible, filters reflect changes. All US5 tests pass.

---

## Phase 8: User Story 6 — Branching Outcomes for Events (Priority: P3)

**Goal**: DMs can add multiple potential outcomes per event and mark any as "occurred". Marking an outcome does NOT affect event status.

**Independent Test**: Create event → add 3 outcomes → mark 2 as occurred → verify event status unchanged → verify both marked outcomes highlighted.

### Tests for User Story 6 (TDD — Write First) ✓

- [ ] T075 [P] [US6] Write integration tests for `POST /api/.../outcomes` in `tests/integration/api/outcomes.test.ts` (201 with description; 400 missing description; 403 on foreign event)
- [ ] T076 [P] [US6] Write integration tests for `PUT /api/.../outcomes/:id` in `tests/integration/api/outcomes.test.ts` (toggle occurred true/false; does NOT change parent event status)
- [ ] T077 [P] [US6] Write e2e test for outcomes in `tests/e2e/flows/event-tracking.spec.ts` (add outcomes → mark occurred → verify event status unchanged → mark second → both highlighted)

### Implementation for User Story 6

- [ ] T078 [P] [US6] Create Prisma query helper `src/lib/db/outcomes.ts` (getOutcomesByEvent, createOutcome, updateOutcome, deleteOutcome)
- [ ] T079 [US6] Create outcomes list/create routes in `src/app/api/worlds/[worldId]/regions/[regionId]/events/[eventId]/outcomes/route.ts` (GET outcomes; POST validate + create)
- [ ] T080 [US6] Create outcome update/delete routes in `src/app/api/worlds/[worldId]/regions/[regionId]/events/[eventId]/outcomes/[outcomeId]/route.ts` (PUT toggle occurred or edit description; DELETE; verify ownership)
- [ ] T081 [P] [US6] Create `OutcomeItem` component in `src/components/outcomes/OutcomeItem.tsx` (description; "occurred" toggle checkbox/button; highlighted style when occurred; accessible label)
- [ ] T082 [P] [US6] Create `OutcomeForm` component in `src/components/outcomes/OutcomeForm.tsx` (react-hook-form; description required 1–2000 chars)
- [ ] T083 [US6] Update event detail page `src/app/(protected)/worlds/[worldId]/regions/[regionId]/events/[eventId]/page.tsx` to render outcomes section (OutcomeItem list; OutcomeForm for adding; delete per outcome)

**Checkpoint**: US6 functional — full P3 feature complete. All US6 tests pass. All user stories independently verified.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, performance, error handling, and quality gates across all stories.

- [ ] T084 [P] Audit all interactive elements for 44 × 44 px touch target minimum; fix any violations across all components
- [ ] T085 [P] Add `prefers-reduced-motion` handling via Tailwind `motion-reduce:` to all animated components (skeleton loaders, dialogs, transitions)
- [ ] T086 [P] Add loading skeleton states to all data-fetching pages (dashboard, world detail, region detail, event detail) using `src/components/shared/LoadingSkeleton.tsx`
- [ ] T087 [P] Implement optimistic updates for status badge change in event detail (update UI immediately on select, revert on API error)
- [ ] T088 Verify N+1 prevention across all Prisma queries — confirm dashboard uses single query with `_count` includes; add `@@index` annotations if any are missing
- [ ] T089 [P] Add deletion confirmation dialogs to all delete actions (worlds, regions, events, outcomes) using `src/components/shared/DeleteConfirmDialog.tsx` with item counts where applicable
- [ ] T090 [P] Add account deletion UI to a settings page `src/app/(protected)/settings/page.tsx` (requires typing "DELETE" to confirm per contracts/api.md)
- [ ] T091 Run `npm run lint` and resolve all ESLint warnings to zero
- [ ] T092 Run full test suite (`npm test` + `npx playwright test`); verify ≥ 80% coverage for business logic; 100% for auth/authorization critical paths
- [ ] T093 [P] Run Lighthouse CI on dashboard, world detail, and event detail pages; verify ≥ 90 Performance, Accessibility, Best Practices
- [ ] T094 [P] Audit all user-facing error messages — no stack traces, technical codes, or raw Prisma errors exposed; all use plain English per constitution
- [ ] T095 Update `specs/quickstart.md` if any setup steps changed during implementation
- [ ] T096 Validate full user journey per `specs/spec.md` acceptance scenarios: all 8 US1 scenarios, all 6 US2 scenarios, all 6 US3 scenarios, all 6 US4 scenarios, all 6 US5 scenarios, all 6 US6 scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1 Auth)**: Depends on Phase 2 — BLOCKS all subsequent stories (session required)
- **Phase 4 (US2 Worlds)**: Depends on Phase 3 (needs authenticated session)
- **Phase 5 (US3 Regions)**: Depends on Phase 4 (regions belong to worlds)
- **Phase 6 (US4 Events)**: Depends on Phase 5 (events belong to regions)
- **Phase 7 (US5 Status)**: Depends on Phase 6 (extends event functionality)
- **Phase 8 (US6 Outcomes)**: Depends on Phase 6 (outcomes belong to events; can parallel with US5)
- **Phase 9 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story        | Depends On | Can Parallel With |
| ------------ | ---------- | ----------------- |
| US1 Auth     | Foundation | —                 |
| US2 Worlds   | US1        | —                 |
| US3 Regions  | US2        | —                 |
| US4 Events   | US3        | —                 |
| US5 Status   | US4        | US6               |
| US6 Outcomes | US4        | US5               |

### Within Each Story

1. Write tests → verify they FAIL
2. Prisma helpers (`lib/db/`) → API routes → Components → Pages
3. Verify tests pass
4. Checkpoint: story independently testable

---

## Parallel Execution Examples

### Phase 2 Parallel Tasks (run together)

```
T012: zod auth schemas
T013: zod world/region/event/outcome schemas
T014: utils.ts
T015: shared TypeScript types
```

### Phase 3 (US1) Parallel Tasks

```
# Write these tests simultaneously:
T018: auth validation unit tests
T019: register integration tests
T020: signin integration tests
T021: register e2e test
T022: login e2e test
T023: auth guard e2e test

# Then implement in parallel:
T028: RegisterForm component
T029: LoginForm component
```

### Phase 8 (US6) can start while Phase 7 (US5) is in progress

```
T078: outcomes Prisma helper  ← parallel with T072 (status update logic)
T081: OutcomeItem component   ← parallel with T074 (status change control)
T082: OutcomeForm component   ← parallel with T073 (event detail page)
```

---

## Implementation Strategy

### MVP First (P1 Stories Only: US1 + US2 + US3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: US1 — Auth
4. Complete Phase 4: US2 — Worlds
5. Complete Phase 5: US3 — Regions
6. **STOP and VALIDATE**: Full P1 hierarchy works, data isolated, counts correct
7. Deploy/demo MVP

### Full Incremental Delivery

```
Phase 1 + 2 → Foundation ready
Phase 3 (US1) → Secure access ✓
Phase 4 (US2) → World management ✓
Phase 5 (US3) → Region organization ✓  ← MVP milestone
Phase 6 (US4) → Event tracking ✓
Phase 7 (US5) → Status progression ✓  ← Core tracking milestone
Phase 8 (US6) → Branching outcomes ✓  ← Full feature
Phase 9 → Production ready ✓
```

---

## Notes

- [P] tasks operate on different files — safe to run in parallel
- Each story phase ends with a named checkpoint — stop and validate before proceeding
- Constitution TDD requirement: tests must be written AND verified failing before any implementation task in the same story begins
- Commit at each checkpoint with conventional commit message (e.g., `feat(auth): complete US1 — registration and login`)
- The `specs/` directory in this repo is the source of truth — implementation repos reference it
