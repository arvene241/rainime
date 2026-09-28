# rainime

An anime front end built with Next.js (App Router) and Tailwind CSS. It lists what aired most recently, trending and popular shows, and has search, show pages and episode pages.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Data

**Show data** (lists, search, show pages, airing schedule, recommendations, where-to-watch links) comes from [AniList's public GraphQL API](https://docs.anilist.co). It needs no key or configuration.

**Watching:** the site hosts and scrapes no video. Episode pages play official uploads in the page when AniList links one (a show's official YouTube playlist or an episode's YouTube upload), and show pages embed the official trailer. Every other episode links to the licensed services AniList lists (Crunchyroll, Netflix and so on), straight to the episode when AniList has that link.

No API keys or environment variables are needed.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (type-checks and lints) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

See [DESIGN.md](./DESIGN.md) for the design tokens and rules.
