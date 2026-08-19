# IP as Logo Skill website

Free, searchable mascot-logo library deployed at <https://ips-logo-skill.vercel.app>.

## Architecture

- Vite, React 19, and TypeScript
- Tailwind CSS v4
- Shadcn UI `nova` preset with Base UI primitives
- Supabase Postgres for public metadata, RLS, search, filtering, sorting, and seeded random pagination
- Cloudflare R2 for original PNG delivery and downloads
- Vercel for the static production deployment

The initial request returns 80 logos (8 columns × 10 rows at the desktop breakpoint). The bottom sentinel appends 40-logo batches. Returning to the top after scrolling away changes the random seed and replaces the feed with a fresh batch. Search, Tabs, and sorting also start a new seeded query.

## Local development

Copy `.env.example` to `.env.local`, fill in the public Supabase values, then run:

```bash
npm install
npm run dev
```

The browser receives only the Supabase publishable key. Public access is constrained by the `logos` table RLS policy and the two read-only RPC functions in `supabase/migrations`.

## Data operations

Generate a content-hash-deduplicated manifest from the repository's `output/` and `outputs/` directories:

```bash
R2_PUBLIC_URL=https://example.r2.dev npm run manifest
```

After uploading the files listed in `data/upload-list.json` to R2, import metadata with a service-role key kept outside the repository:

```bash
SUPABASE_URL=https://project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=... \
npm run import:logos
```

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```
