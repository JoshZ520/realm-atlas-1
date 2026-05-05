<!--
Sync Impact Report - Constitution v1.1.0
========================================
Version Change: 1.0.0 → 1.1.0
Amended: 2026-05-05
Ratification: 2026-04-28

Version Bump Rationale: MINOR — materially expanded guidance across all four existing
principles. No principles added or removed; no backward-incompatible governance changes.

Modified Principles (title unchanged, content expanded):
- I.  Code Quality Excellence    → Added cyclomatic complexity cap (≤10) and max
                                   function length (40 lines) as explicit enforceable rules.
- II. Testing Standards (TDD)    → Added explicit definition of "critical paths",
                                   mutation testing guidance (score ≥70%), and
                                   test-naming convention requirement.
- III. User Experience Consistency → Added contrast ratio minimums (4.5:1 / 3:1),
                                     touch target minimum (44×44 px), and
                                     prefers-reduced-motion compliance rule.
- IV. Performance Requirements   → Added Core Web Vitals targets (LCP, INP, CLS),
                                   Lighthouse score floor (≥90), and mandatory
                                   production performance monitoring requirement.

Added Sections: None
Removed Sections: None

Templates Updated:
✅ .specify/memory/constitution.md       — This file (v1.1.0)
✅ .specify/templates/plan-template.md  — Constitution Check gates expanded to reflect
                                          new sub-bullets in all four principles
⚠  .specify/templates/spec-template.md — No structural change required; SC-002 pattern
                                          already aligns with perf targets
⚠  .specify/templates/tasks-template.md — No structural change required; TDD mandate and
                                           story-based organization unchanged
⚠  .specify/templates/checklist-template.md — Generic template; no constitution refs
⚠  .specify/templates/agent-file-template.md — Generic template; no constitution refs

Deferred TODOs: None — all fields resolved.
-->

# ShopList Constitution

## Core Principles

### I. Code Quality Excellence

**NON-NEGOTIABLE**: All code MUST meet the following quality standards:

- **Readability First**: Code is written for humans, not just machines. Use clear,
  intention-revealing names, logical structure, and comments that explain *why*,
  never *what*.
- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution,
  Interface Segregation, and Dependency Inversion principles MUST be followed.
- **Complexity Cap**: Cyclomatic complexity MUST NOT exceed **10** per function or
  method. Functions MUST NOT exceed **40 lines** of executable code. Extract helpers
  when either limit would be breached.
- **DRY (Don't Repeat Yourself)**: Duplicate logic MUST be refactored into reusable
  functions, components, or services. A second occurrence of identical logic triggers
  an immediate refactor before the PR is approved.
- **Code Review Required**: No code reaches production without peer review. Reviewers
  MUST verify logic correctness, edge-case handling, security implications, complexity
  limits, and adherence to this constitution.
- **Static Analysis**: All code MUST pass linting and static type checking (where the
  language supports it) with **zero warnings** before commit.

**Rationale**: Quality code reduces bugs, improves maintainability, and accelerates
feature development by building on a solid, understandable foundation.

### II. Testing Standards (TDD)

**NON-NEGOTIABLE**: Test-Driven Development is mandatory for all features:

- **Red-Green-Refactor Cycle**: Tests MUST be written first, verified to fail, then
  implementation written to pass, followed by refactoring. No implementation commit
  is accepted without a preceding failing-test commit.
- **Test Coverage**: Minimum **80%** code coverage for business logic;
  **100%** for critical paths.
  - *Critical paths are defined as*: authentication, authorization, data persistence,
    payment processing, and any execution path where failure causes data loss,
    financial error, or a security breach.
- **Mutation Testing**: Mutation testing SHOULD be applied to critical-path modules.
  Mutation score MUST be **≥ 70%** for any module classified as a critical path.
- **Test Pyramid**: Unit tests (70%), integration tests (20%), end-to-end tests (10%)
  distribution MUST be maintained.
- **Independent Test Verification**: Each user story MUST have acceptance tests that
  validate functionality independently, without requiring other stories to be deployed.
- **Test Naming Convention**: Tests MUST follow a `Given_<state>_When_<action>_Then_<outcome>`
  or `should_<outcome>_when_<condition>` naming convention — whichever the project
  standard specifies — consistently across the entire test suite.
- **Test Quality**: Tests MUST be focused on one behavior, free from implementation
  details, and include both happy-path and error/edge-case scenarios.
- **No Skipped Tests**: Disabled or skipped tests are technical debt. They MUST be
  resolved within one sprint cycle or permanently removed with documented justification.

**Rationale**: TDD ensures features work as designed, prevents regressions, and
produces living documentation of system behavior that survives refactors.

### III. User Experience Consistency

**NON-NEGOTIABLE**: All user-facing features MUST maintain a consistent experience:

- **Design System Compliance**: UI components MUST use approved design tokens
  (colors, typography, spacing, animation durations). Ad-hoc overrides are
  FORBIDDEN outside the design system's documented extension points.
- **Accessibility Standards**: WCAG 2.1 Level AA compliance MUST be achieved.
  This includes: semantic HTML, ARIA labels where needed, full keyboard navigation,
  and screen-reader compatibility.
  - Normal text MUST have a color contrast ratio of at least **4.5:1**.
  - Large text (≥18 pt regular or ≥14 pt bold) MUST have a contrast ratio
    of at least **3:1**.
- **Touch Targets**: Interactive elements on touch interfaces MUST have a minimum
  tap target size of **44 × 44 px** to meet accessibility and usability standards.
- **Responsive Design**: All interfaces MUST be fully functional on mobile (320 px+),
  tablet (768 px+), and desktop (1024 px+) viewports.
- **Motion & Animation**: All animations and transitions MUST respect the
  `prefers-reduced-motion` CSS media query. Decorative motion MUST be disabled
  or reduced when the user has opted for reduced motion.
- **Performance Perception**: User interactions MUST provide immediate feedback —
  loading states, optimistic updates, or progress indicators — within **100 ms**
  of the triggering action.
- **Error Communication**: All error states MUST provide clear, actionable messages
  in user-friendly language. Technical identifiers (stack traces, error codes) MUST
  NOT be exposed to end users.
- **Consistency Checks**: Navigation patterns, terminology, and interaction idioms
  MUST be identical across all features. Divergence requires design-system team sign-off.

**Rationale**: Consistent UX builds user trust, lowers the learning curve, satisfies
legal accessibility obligations, and creates a professional product experience.

### IV. Performance Requirements

**NON-NEGOTIABLE**: All features MUST meet these performance benchmarks:

- **API Response Time**: API endpoints MUST respond within **200 ms** (p95 latency)
  for 95% of requests under normal load.
- **Page Load**: Initial page load MUST complete within **2 seconds** on 3G networks
  (1.6 Mbps down / 750 Kbps up).
- **Core Web Vitals** (measured at p75 in the field):
  - **LCP** (Largest Contentful Paint): MUST be ≤ **2.5 s** on mobile.
  - **INP** (Interaction to Next Paint): MUST be ≤ **200 ms**.
  - **CLS** (Cumulative Layout Shift): MUST be ≤ **0.1**.
- **Lighthouse Score**: All production pages MUST score ≥ **90** for Performance,
  Accessibility, and Best Practices on desktop (measured in Lighthouse CI).
- **Time to Interactive**: Pages MUST be interactive within **3.5 seconds** on mobile
  devices.
- **Bundle Size**: JavaScript bundles MUST NOT exceed **200 KB** gzipped per route.
  Code splitting is REQUIRED for any route-level chunk that would exceed this limit.
- **Database Queries**: N+1 query patterns are FORBIDDEN. All data loading MUST be
  optimized with proper indexing and batching before reaching code review.
- **Memory Management**: Mobile app memory usage MUST NOT exceed **150 MB** under
  normal operation.
- **Scalability**: Features MUST be designed to handle **10× current user load**
  without requiring architectural changes.
- **Production Monitoring**: All production deployments MUST include real-user
  performance monitoring (RUM) instrumented before release. Alerts MUST be configured
  for any Core Web Vital exceeding "Needs Improvement" thresholds.

**Rationale**: Performance directly impacts user satisfaction, retention, and
accessibility for users on slower devices or networks. Monitoring ensures regressions
are caught in production before they affect a significant user population.

## Security & Data Protection

**Authentication**: Phone/password authentication MUST use bcrypt (cost factor ≥12) for password hashing. JWT tokens MUST expire within 24 hours with refresh token rotation.

**Data Validation**: All user inputs MUST be validated on both client and server. Use parameterized queries to prevent SQL injection. Sanitize all outputs to prevent XSS attacks.

**Authorization**: Role-based access control (RBAC) MUST be enforced at API level. Users MUST only access their own shopping lists and financial data.

**Data Privacy**: Personal data (phone numbers, financial information) MUST be encrypted at rest using AES-256. PII MUST NOT be logged.

**Audit Trail**: All sensitive operations (authentication, financial transactions, data modifications) MUST be logged with timestamp, user ID, and action for compliance auditing.

## Development Workflow

**Version Control**: Git flow MUST be followed. Feature branches named `###-feature-name`. All commits MUST have descriptive messages following conventional commits format.

**Code Reviews**: Minimum one approval required. Reviewers MUST verify: constitution compliance, test coverage, security implications, performance impact.

**CI/CD Pipeline**: Automated checks MUST pass before merge: linting, type checking, unit tests, integration tests, build verification.

**Documentation**: All public APIs, complex algorithms, and architectural decisions MUST be documented. README files MUST be updated with new dependencies or setup requirements.

**Deployment**: Production deployments require passing all tests, security scan, and manual QA verification. Rollback plan MUST be defined for each deployment.

## Governance

This constitution supersedes all other development practices and conventions. It represents the non-negotiable standards for the ShopList project.

**Amendment Process**:
1. Proposed changes MUST be documented with rationale and impact analysis
2. Changes require approval from project lead and architecture review
3. Major changes (principle additions/removals) require team vote
4. Migration plan MUST be provided for changes affecting existing code

**Compliance Verification**:
- All PRs MUST be reviewed against constitution principles
- Quarterly constitution compliance audits MUST be conducted
- Violations MUST be tracked and addressed within one sprint

**Version Management**:
- MAJOR version: Backward-incompatible governance changes or principle removals
- MINOR version: New principles added or substantial expansions
- PATCH version: Clarifications, wording improvements, non-semantic fixes

**Runtime Guidance**: For detailed development workflows and command usage, refer to `.specify/templates/` and `.github/prompts/` documentation.

**Version**: 1.1.0 | **Ratified**: 2026-04-28 | **Last Amended**: 2026-05-05
