# Stephen King Universe

An English-language scholarly and editorial guide to Stephen King's works,
characters, screen adaptations, places, timeline, and source evidence.

## Requirements

- Node.js `>=22.13.0`
- pnpm `11.12.0`

## Local development

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

Open `http://localhost:3000`.

## Release checks

```bash
pnpm run lint
pnpm test
```

`pnpm test` creates the same standard Next.js production build used by Vercel
and runs release checks against the generated browser assets.

## Vercel

Import the GitHub repository into Vercel. The framework preset should be
detected as Next.js. Use these settings if manual configuration is necessary:

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm run build`
- Output directory: leave empty (Next.js default)
- Node.js: 22.x or newer

No database is used by the application. Site records live in versioned JSON
under `data/` and are rendered as public website content.

## Local enrichment credentials

Copy `.env.example` to `.env.local` and set only the credentials you use:

```env
TMDB_READ_ACCESS_TOKEN=
GOOGLE_BOOKS_API_KEY=
```

Environment files are ignored by Git. Do not add `NEXT_PUBLIC_` or `VITE_`
prefixes to either credential.

Google Books requests are made only by the local enrichment script. Every
request requires and includes `GOOGLE_BOOKS_API_KEY`; the key is never written
to generated JSON or included in browser assets.

```bash
pnpm run enrich:google-books
pnpm run enrich:tmdb
```
