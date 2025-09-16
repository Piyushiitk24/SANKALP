# SANKALP Agent Guide

## Quick Orientation
- Next.js App Router (v15) with TypeScript, Tailwind, and shadcn-ui lives in `app/`; shared UI widgets sit under `components/` (split into domain pieces + `components/ui/*`).
- Business logic is server-heavy: Drizzle ORM in `db/*`, server actions in `actions/*`, and Next API routes in `app/api/*`. Client state glue (Zustand stores, hooks) is in `store/*` and `hooks/*`.
- Use the project-wide path alias `@/*` (set in `tsconfig.json`) when importing.

## Runbooks & Tooling
- Install deps with `npm install --legacy-peer-deps` (avoids peer conflicts from react-admin).
- Local dev: `npm run dev` (or `npm run dev:turbo` if Turbo is configured). Production build/start: `npm run build && npm start`.
- Database: `npm run db:push` for schema sync, `npm run db:prod` to seed the canonical demo data (`scripts/prod.ts` wipes & repopulates courses/units/lessons/challenges). `npm run db:studio` opens Drizzle Studio against `DATABASE_URL`.
- Quality: `npm run lint` (Next + eslint), `npm run format:fix` (Prettier + Tailwind plugin). No automated tests exist—manual verification is the norm.
- Node 22.x is required (`package.json` engines). Load env from `.env.local` when possible; `scripts/prod.ts` mirrors Next’s precedence.

## Environment & External Services
- Core env vars (`.env.example` + README): Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_ADMIN_IDS`), Neon Postgres (`DATABASE_URL`), Stripe (`STRIPE_API_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`), `NEXT_PUBLIC_APP_URL`. Optional: Upstash Redis for rate limiting, logging tweaks via `LOG_LEVEL`.
- Database uses Neon HTTP driver (`db/drizzle.ts`). Schema (`db/schema.ts`) models courses → units → lessons → challenges (+ options, progress, subscriptions). Keep referential integrity in mind when modifying seeds or API payloads.
- Stripe integration handled in `lib/stripe.ts` with webhook at `app/api/webhooks/stripe/route.ts` (remember to update signing secrets if you touch it).
- Clerk auth is globally required via `middleware.ts`; admin checks also rely on env-configured IDs (`lib/admin.ts`).

## Architecture Highlights
- **Route groups**: `(marketing)` is the unauthenticated landing flow, `(main)` hosts the learning experience behind `GuestUserHandler`, `admin/` embeds `react-admin` for CRUD, and `lesson/` hosts the interactive lesson runner.
- **Server Actions** (`actions/*`): mutate progress/hearts/subscriptions and call `revalidatePath` against `/learn`, `/lesson/[id]`, `/quests`, `/leaderboard`, etc. Guest users short-circuit here and rely on client updates.
- **APIs**: `/api/*` implements REST resources for the admin UI (secured via `getIsAdmin()`); `/api/public/*` exposes read-only course data to guests; Stripe webhook under `/api/webhooks/stripe` updates `user_subscription`.
- **State & Client Flow**: Zustand stores in `store/*` manage UI modals (exit/hearts/practice). Hooks like `hooks/use-guest-user.ts` bridge localStorage-backed guest data with React state.
- **Guest Mode**: `components/guest-user-handler.tsx` ensures anonymous visitors get a `guest_*` profile saved in `localStorage` (`lib/guest-user.ts`), progress cached via `lib/guest-progress.ts`, and course selection through `components/guest-course-selection.tsx`. Changes are broadcast with the `guest-user-updated` custom event.
- **Lesson Runner**: `app/lesson/[lessonId]/page.tsx` fetches lesson, progress, subscription in parallel (note the async `params` per Next 15). The client component (`app/lesson/page-client.tsx`) handles challenge flow, hearts, and guest fallbacks.
- **Content Seeds**: `scripts/prod.ts` now seeds Semaphore with three fully built units (4–5 lessons × 5 flashcard-style questions each) using descriptive option text; extend or tweak content through the structured `semaphoreUnitsDefinition` object.

## Security & Operations
- Middleware (`middleware.ts`) blocks suspicious user agents, guards `/admin`, and prevents path traversal. For hardened deployments, there’s an empty `middleware.secure.ts` stub if you need to extend.
- HTTP headers/CSP configured in `next.config.mjs`. Update `script-src`, `connect-src`, etc. when adding third-party assets.
- Logging via Winston (`lib/logger.ts`) writes to `logs/{combined,error,security}.log`; security helpers (`lib/session-manager.ts`, `lib/rate-limit.ts`, `lib/database-security.ts`) centralize session validation and rate limiting (Upstash-backed if env is set).
- Feature flags/constants live in `constants.ts` (e.g., `DEMO_MODE.HIDE_PAID_HEART_OPTIONS`, `POINTS_TO_REFILL`, `MAX_HEARTS`). Update docs (`DEMO_MODE.md`, `DARK_MODE.md`, etc.) when toggling behavior.

## Conventions & Gotchas
- Shadcn components generated via `components.json`; prefer existing primitives under `components/ui`. Tailwind styles lean on the neon purple brand (`#a259ff`)—match it when adding accents.
- `app/admin` uses `react-admin` with `ra-data-simple-rest`; maintain API shape (`id` field names, `Content-Range` headers in `next.config.mjs`) when altering resources.
- Guest + auth flows must remain in sync: whenever a server action early-returns for guests, ensure the corresponding client handler updates `localStorage` & emits events.
- Revalidation is manual; if you add new pages that depend on mutable data, add `revalidatePath` calls alongside the existing ones.
- Keep an eye on seed script cascading deletes—`scripts/prod.ts` truncates several tables. Run against a disposable DB in development.
- Non-standard events: UI listens for `guest-user-updated`, `guestUserChanged`; dispatch both when mutating guest state to keep legacy listeners working.

## Reference Docs
- README.md covers onboarding + screenshots.
- SECURITY_IMPLEMENTATION_GUIDE.md, DARK_MODE.md, DEMO_MODE.md, GUEST_USER_IMPLEMENTATION.md explain feature specifics.
- Logs directory is git-tracked for structure only—actual log files rotate at runtime.

Update this guide whenever architecture, workflows, or integrations change so future agents remain productive.
