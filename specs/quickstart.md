# Quickstart: The Realm Atlas

**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-05  
**Plan**: [plan.md](./plan.md)

This guide covers setting up a local development environment for an implementation repo
that follows the Realm Atlas spec (`realm-atlas-specs`).

---

## Prerequisites

- Node.js 18+ (LTS)
- PostgreSQL 15+ running locally (or a connection string to a hosted instance)
- npm or pnpm

---

## 1. Initialize the Project

```bash
npx create-next-app@latest realm-atlas-[variant] \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd realm-atlas-[variant]
```

---

## 2. Install Dependencies

```bash
# Core
npm install prisma @prisma/client next-auth@beta bcryptjs
npm install react-hook-form @hookform/resolvers zod
npm install class-variance-authority clsx tailwind-merge

# shadcn/ui CLI
npx shadcn@latest init

# Dev
npm install -D @types/bcryptjs jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

---

## 3. Configure Environment Variables

Create `.env.local` (never commit this file):

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/realm_atlas"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
```

---

## 4. Set Up Prisma

```bash
npx prisma init
```

Replace `prisma/schema.prisma` with the schema from `specs/data-model.md`, then:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 5. Configure NextAuth

Create `src/lib/auth.ts` with the Credentials Provider:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        return valid ? { id: user.id, name: user.username } : null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 60 }, // 30 min
});
```

---

## 6. Configure Prisma Client Singleton

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 7. Add Route Protection Middleware

Create `src/middleware.ts`:

```typescript
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
```

---

## 8. Add shadcn/ui Components

```bash
npx shadcn@latest add button input label card dialog badge skeleton
```

---

## 9. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` — should redirect to `/login`.

---

## 10. Run Tests

```bash
# Unit + integration
npm test

# E2e (requires dev server running)
npx playwright test
```

---

## Reference

- Spec: `specs/spec.md`
- Plan: `specs/plan.md`
- Data model + Prisma schema: `specs/data-model.md`
- API contracts: `specs/contracts/api.md`
- Constitution: `.specify/memory/constitution.md`
