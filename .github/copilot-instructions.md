# Copilot Instructions for SANKALP®

## Project Overview
SANKALP® is a gamified learning platform built with Next.js, TypeScript, and Tailwind CSS. It features interactive lessons, quizzes, progress tracking, and a robust guest user experience. The app is structured for modularity and scalability, with clear separation between UI, business logic, and data access.

## Key Architectural Patterns
- **App Directory Structure**: Uses Next.js app directory routing. Main user flows are under `app/(main)/`, marketing pages under `app/(marketing)/`, and admin tools under `app/admin/`.
- **Actions Layer**: Business logic and server actions are in `actions/` (e.g., `challenge-progress.ts`, `user-progress.ts`).
- **Database Access**: Uses Drizzle ORM with schema and queries in `db/`. Database config is in `.env` and `drizzle.config.ts`.
- **Component Organization**: UI components are in `components/`, with subfolders for `modals/`, `ui/`, and feature-specific components. Shared logic is in `lib/` and `hooks/`.
- **State Management**: Uses Zustand for client state (see `store/`).
- **Authentication**: Integrates Clerk for user auth, with custom theming and guest user support (`components/guest-user-handler.tsx`, `hooks/use-guest-user.ts`).
- **Payments**: Stripe integration for shop and in-app purchases (`lib/stripe.ts`).

## Developer Workflows
- **Install dependencies**: `npm install --legacy-peer-deps`
- **Run development server**: `npm run dev`
- **Database setup**: `npm run db:push && npm run db:prod` (requires Neon connection string in `.env`)
- **Environment variables**: Copy `.env.example` to `.env` and fill in Clerk, Neon, and Stripe keys
- **Build for production**: `npm run build`
- **Linting**: `npm run lint`

## Project-Specific Conventions
- **Neon Purple Theme**: All UI elements use the #a259ff color for branding consistency
- **Guest User Flows**: Guest users have full feature access with local storage persistence; see `guest-user-handler.tsx` and `lib/guest-user.ts`
- **Hearts System**: Managed in `store/use-hearts-modal.ts` and related components; supports instant refill and real-time sync
- **Admin Access**: Controlled via Clerk admin IDs in `.env` (`CLERK_ADMIN_IDS`)
- **Logs**: Application logs are in `logs/` and auto-rotated

## Integration Points
- **Clerk**: Auth modals and flows, custom themed in `components/auth/`
- **Stripe**: Payment endpoints in `app/api/webhooks/stripe/` and logic in `lib/stripe.ts`
- **Neon**: Database connection via `DATABASE_URL` in `.env`

## Examples
- To add a new lesson: update `db/schema.ts`, add logic in `actions/`, and UI in `app/(main)/learn/`
- To customize theming: edit `tailwind.config.ts` and relevant CSS in `app/globals.css`
- To extend guest user logic: see `hooks/use-guest-user.ts` and `lib/guest-user.ts`

## References
- Main entry: `app/layout.tsx`
- Routing: `app/(main)/`, `app/(marketing)/`, `app/admin/`
- Business logic: `actions/`, `lib/`
- Database: `db/`
- UI: `components/`, `app/globals.css`

---
For more, see `READMENEW.markdown` in the project root.
