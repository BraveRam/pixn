# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js 15 App Router app. Route segments and page-level layouts live in `app/`, including grouped areas such as `app/(dashboard)` and `app/(upload)`. Reusable UI lives in `components/`, with shared primitives under `components/ui/` and navigation pieces under `components/navbar/`. Business logic and client helpers live in `lib/`, including API wrappers in `lib/api/` and Zustand state in `lib/store/`. Providers are isolated in `providers/`, Supabase server/client utilities are in `utils/supabase/`, and static assets are in `public/`.

## Build, Test, and Development Commands
Use Bun for local workflows.

- `bun install`: install dependencies from `bun.lock`.
- `bun dev`: start the local dev server with Turbopack at `http://localhost:3000`.
- `bun run build`: create a production build with Next.js.
- `bun run start`: serve the production build locally.
- `bun run lint`: run the Next.js ESLint ruleset (`next/core-web-vitals` and TypeScript checks).

## Coding Style & Naming Conventions
TypeScript runs in `strict` mode and imports use the `@/*` alias from the repository root. Follow the existing style: 2-space indentation, semicolons, and mostly double quotes in TS/TSX files. Use `PascalCase` for React components (`Navbar.tsx`), `camelCase` for functions and store actions (`toggleFavorite`), and lowercase route folder names in `app/`. Keep server-facing helpers in `lib/` or `utils/` rather than embedding data access directly in UI components.

## Testing Guidelines
There is no dedicated automated test suite yet. Until one is added, treat `bun run lint` and `bun run build` as the minimum verification for every change. When adding tests, place them next to the feature or in a small `__tests__/` folder, and name files `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent history uses short prefixes such as `fix:` and `modify:`. Prefer concise, imperative commit subjects like `fix: align upload validation`. Keep commits focused and avoid mixing refactors with behavior changes. PRs should include a short summary, linked issue if applicable, screenshots or screen recordings for UI changes, and the verification commands you ran.

## Security & Configuration Tips
Secrets belong in `.env` and must never be committed. At minimum, local development expects `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `AI_GATEWAY_API_KEY`.
