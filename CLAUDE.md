# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pixn is an AI-powered image gallery with semantic search. Users upload images; Google Gemini generates a text description for each, which is embedded as a vector. Natural-language queries are embedded and matched against those vectors, so users find photos by meaning ("sunset at the beach") rather than filename.

## Commands

This project uses **Bun** as the package manager and test runner.

- `bun install` — install dependencies (from `bun.lock`)
- `bun dev` — dev server with Turbopack at http://localhost:3000
- `bun run build` — production build
- `bun run start` — serve the production build
- `bun run lint` — ESLint (`next/core-web-vitals` + TypeScript)
- `bun test` — run the test suite (uses `bun:test`, tests live in `tests/`)
- `bun test tests/shareToken.test.ts` — run a single test file

There is no separate type-check script; `bun run build` is the authoritative type check (TS runs in `strict` mode). Treat `bun run lint` + `bun run build` as the minimum verification for any change.

## Environment

Required env vars (see `.env.example`; secrets go in `.env`, which is gitignored):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase
- `GEMINI_API_KEY` — Google Gemini (descriptions + embeddings)
- `SHARE_TOKEN_SECRET` — HMAC secret for share tokens (**required in production**; falls back to a dev constant otherwise)
- `NEXT_PUBLIC_SITE_URL` — canonical origin used for auth redirects and share URLs

`.npmrc` configures a private GitHub Packages registry for the `@braveram` scope (gitignored).

## Architecture

Next.js **16** App Router (the README still says 15) + Supabase (Postgres, pgvector, Storage, Auth) + Vercel AI SDK with Google Gemini. Client state is split: **Zustand** (`lib/store/images.ts`) for gallery UI state and **TanStack Query** (`providers/QueryProvider.tsx`, `lib/api/queries.ts`) for server data. UI is Tailwind 4 + shadcn/ui (new-york style) + Framer Motion. Path alias `@/*` maps to the repo root.

### Auth and route protection (two layers — read both before changing either)

Next.js 16 renames the middleware entrypoint: the file is **`proxy.ts`** at the root and it exports a `proxy()` function (not `middleware.ts`/`middleware()`).

1. `utils/supabase/middleware.ts` → `updateSession()` refreshes the Supabase session cookies. **Do not insert code between `createServerClient` and `auth.getUser()`**, and always return its response object — otherwise sessions desync. It *also* contains its own public-path/redirect logic.
2. `proxy.ts` calls `updateSession()`, then independently redirects: signed-in users away from `/auth/sign-in`, and signed-out users away from protected routes (`/fav`, `/gallery`, `/profile`, `/upload`).

Note both layers implement redirect logic; keep their notions of "protected" vs "public" in sync when editing.

There are three Supabase client factories — pick by context:
- `utils/supabase/server.ts` — server components and route handlers (uses `next/headers` cookies)
- `utils/supabase/client.ts` — browser/client components
- `utils/supabase/middleware.ts` — session refresh only

### Image pipeline: upload → AI → search

- **Upload** (`app/api/upload/route.ts`): auth check → validate (image MIME, <5MB, ≤20 images/user) → store in the private `images` bucket → generate description (Gemini) → generate embedding → insert rows into `gallery` and `embeddings`. AI failures are caught and logged so the upload still succeeds (the image just won't be searchable until backfilled). The 20-image limit is re-checked after upload and rolls back storage on a race.
- **Storage path = ownership boundary**: every object key is `{userId}/{uuid}-{safeName}`, built by `createImageStoragePath` in `lib/gallerySecurity.ts`. Authorization for share/delete checks the `{userId}/` prefix (`isUserOwnedPath`) in addition to Supabase RLS — preserve this prefix convention.
- **Search** (`app/api/gallery/search/route.ts`): embed the query → call the Postgres RPC `match_embeddings` (cosine threshold 0.75, top 20, filtered by user) → join matched paths back to `gallery` → return 30-day signed URLs, preserving similarity order.
- **Backfill** (`app/api/gallery/process-embeddings/route.ts`): finds gallery rows lacking embeddings and generates them.

AI config lives entirely in `lib/ai.ts`: descriptions use `gemini-2.0-flash` (10–300 chars, structured via `generateObject`); embeddings use `gemini-embedding-001` at **1536 dimensions**, `SEMANTIC_SIMILARITY` task type. Changing the dimension requires a matching change to the `embeddings` table/index and the `match_embeddings` RPC.

### Stateless share tokens

Sharing creates **no database row**. `lib/shareToken.ts` builds a self-contained token: payload (signed URLs + metadata + expiry) → deflate-compress → base64url, with an HMAC-SHA256 signature appended and verified in constant time. `/share/[token]` decodes and validates it. Tokens are signed with `SHARE_TOKEN_SECRET` and expire after 7 days; `app/api/share/create/route.ts` verifies ownership and generates the embedded signed URLs (≤20 images).

### Data model (Supabase)

Tables: `users`, `gallery` (path, name, size, favorite, user_id, created_at), `embeddings` (path, user_id, content, embedding vector), plus `groups` and `group_images`. The `match_embeddings` RPC and the `images` storage bucket must exist. The groups schema (with RLS policies) is in `docs/groups-schema.sql` and must be applied manually in the Supabase SQL editor. Images are never public — all access is via time-limited signed URLs.

### Client data layer

`lib/api/*` (`gallery.ts`, `upload.ts`, `queries.ts`, `groups.ts`, `share.ts`) wrap the fetch/Supabase calls; `lib/api/queries.ts` defines the TanStack Query keys and fetchers. The Zustand store backs optimistic favorite/delete updates in the gallery UI. The 20-image limit is enforced both client-side (`lib/utils/imageLimit.ts`) and server-side (upload route) — keep `MAX_IMAGES_PER_USER` consistent across both.

## Conventions

- TypeScript `strict`; 2-space indent, semicolons, double quotes. Components `PascalCase`, functions/store actions `camelCase`, route folders lowercase.
- Keep data access in `lib/` or `utils/`, not inline in UI components.
- Tests use `bun:test` (not Jest/Vitest), live in `tests/`, named `*.test.ts`. Current coverage is the pure security/token helpers (`shareToken`, `security`, `gallerySecurity`).
- Commits use conventional-style prefixes (`feat:`, `fix:`, `refactor:`, `migrate:`). Keep commits focused; don't mix refactors with behavior changes.
