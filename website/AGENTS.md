# IP as Logo Skill website maintenance

This directory is the production logo-library application.

- Keep the frontend on TypeScript, Tailwind CSS v4, and Shadcn UI's Nova preset.
- Use original Shadcn components and variants. Limit application `className` values to layout and spacing; do not restyle component colors or typography.
- Store logo binaries in the `ips-logo-skill` Cloudflare R2 bucket. Supabase stores metadata only.
- Keep original downloadable PNGs in R2. Generate 24px placeholder and versioned 512px display WebP variants plus per-logo dimensions and startup background colors with `npm run images`; serve those immutable, content-hashed variants from `public/logos` for the gallery.
- Use licensed Nucleo UI outline icons for interface actions. GitHub may keep its dedicated brand mark.
- Treat `supabase/migrations` as the database source of truth. Keep public reads behind RLS and read-only RPC functions.
- Preserve seeded random pagination: a seed must produce stable, non-overlapping offset pages.
- Keep all visitor-facing copy in `src/i18n.ts` and maintain parity across English, Simplified Chinese, Japanese, Korean, French, and Spanish.
- Fail visibly on API and download errors and include query/object context in console logs.
- Use the Cloudflare, Supabase, and Vercel CLIs for infrastructure changes.
- The production Vercel project and alias are both named `ips-logo-skill`.
