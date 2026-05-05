# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Code Quality Excellence**
- [ ] SOLID principles will be followed in service and model design
- [ ] Cyclomatic complexity limit (≤ 10 per function) enforced via linter config
- [ ] Function length limit (≤ 40 lines) agreed upon and enforced
- [ ] Code will be peer-reviewed before merge
- [ ] Linting and static analysis configured and passing with zero warnings
- [ ] No duplicate logic identified in initial design

**II. Testing Standards (TDD)**
- [ ] Test strategy defined (unit 70% / integration 20% / e2e 10% breakdown)
- [ ] Test framework selected and configured
- [ ] Critical paths explicitly identified (auth, authorization, data persistence,
      payments, any failure-causes-data-loss path)
- [ ] Acceptance criteria written as testable Given/When/Then specifications
- [ ] Minimum 80% coverage target established for business logic;
      100% for identified critical paths
- [ ] Mutation testing tooling planned for critical-path modules (target score ≥ 70%)
- [ ] Test naming convention chosen and documented

**III. User Experience Consistency**
- [ ] Design system/component library identified or planned
- [ ] Accessibility requirements (WCAG 2.1 AA) documented:
      contrast 4.5:1 normal text, 3:1 large text
- [ ] Touch target minimums (44 × 44 px) confirmed for all interactive elements
- [ ] Responsive breakpoints defined (mobile 320 px / tablet 768 px / desktop 1024 px)
- [ ] `prefers-reduced-motion` handling strategy planned
- [ ] Error messaging patterns established (no technical jargon to end users)
- [ ] Loading states and feedback mechanisms planned (≤ 100 ms perceived response)

**IV. Performance Requirements**
- [ ] API response time target confirmed (p95 < 200 ms)
- [ ] Page load performance budget established (< 2 s on 3G)
- [ ] Core Web Vitals targets set: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1
- [ ] Lighthouse CI gate configured (≥ 90 Performance, Accessibility, Best Practices)
- [ ] Database query optimization strategy planned (indexing, N+1 prevention)
- [ ] Bundle size limits defined and enforced (< 200 KB gzipped per route)
- [ ] Scalability considerations documented (10× load handling)
- [ ] Production RUM (real-user monitoring) and alerting strategy defined

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
