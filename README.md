# Stephen King Universe 2.0

A responsive, CSS/SVG-first digital archive built with Next.js 15. The interface treats the light and dark modes as two narrative realities:

- **Public Archive** — orderly, official and incomplete.
- **Recovered Archive** — fragmented, relational and closer to the truth.

## Included

- Responsive navigation: full rail, compact laptop rail and mobile drawer
- Exhibition landing page
- Shared archive engine for books, short stories and villains
- Grid/list views, search, sorting, random records and pagination
- Desktop overlay inspectors and mobile full-screen case files
- Procedural CSS surfaces and custom SVG evidence glyphs
- Clean public routes: `/books`, `/short-stories`, `/villains`, `/about`
- Redirects from the previous `/pages/*` URLs
- API error states that explain missing configuration
- Next 15 / React 19 / ESLint 9 dependency alignment

## Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Install with pnpm:

```bash
corepack enable
pnpm install
pnpm dev
```

npm also works:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

```env
STEPHEN_KING_API=https://stephen-king-api.onrender.com
GOOGLE_API=https://www.googleapis.com/books/v1/volumes
GOOGLE_BOOKS_API_KEY=
```

`STEPHEN_KING_API` must be the server root. Do not include `/api`, because the routes append it.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Data and rights

This is an unofficial portfolio project. Stephen King names and titles belong to their respective rights holders. External API data may be incomplete. The UI deliberately avoids reproducing character or villain artwork and uses metadata, typography, CSS and SVG as its primary visual language.
