# realm-atlas-specs Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-05-05

## Active Technologies

- TypeScript 5.x + Next.js 15 App Router (001-realm-atlas)
- PostgreSQL + Prisma ORM (001-realm-atlas)
- NextAuth.js v5 (Credentials Provider) (001-realm-atlas)
- Tailwind CSS 4 + shadcn/ui (001-realm-atlas)
- react-hook-form + zod (001-realm-atlas)
- bcryptjs (cost factor ≥ 12) (001-realm-atlas)

## Project Structure

```text
src/
├── app/          (Next.js App Router: pages + API routes)
├── components/   (shadcn/ui + feature components)
├── lib/          (auth.ts, prisma.ts, validations/, utils.ts)
└── types/
prisma/            (schema.prisma + migrations)
tests/             (unit/, integration/, e2e/)
```

## Commands

npm run dev # start dev server
npm test # Jest unit + integration tests
npx playwright test # e2e tests
npm run lint # ESLint + TypeScript strict check
npx prisma migrate dev # apply DB migrations
npx prisma generate # regenerate Prisma client

## Code Style

TypeScript 5.x: strict mode enabled; zero ESLint warnings policy.
Follow SOLID principles; max cyclomatic complexity 10; max function length 40 lines.
Test naming: given*<state>\_when*<action>_then_<outcome>

## Recent Changes

- 001-realm-atlas: Added TypeScript 5.x + Next.js 15 + PostgreSQL + Prisma + NextAuth.js

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
