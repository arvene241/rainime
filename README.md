# rainime

An anime front end built with Next.js (App Router), Tailwind CSS and hls.js. It lists what aired most recently, trending and popular shows, and has search, show pages and an episode player.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Data

**Show data** (lists, search, show pages, airing schedule, recommendations, where-to-watch links) comes from [AniList's public GraphQL API](https://docs.anilist.co). It needs no key or configuration.

**Playback** is optional. Set `CONSUMET_API_URL` to a [Consumet](https://github.com/consumet)-compatible API that you host yourself, and episodes play in the site's own player:

```bash
# .env.local
CONSUMET_API_URL=https://your-instance.example.com
# optional: which provider that API should use for /meta/anilist routes
CONSUMET_PROVIDER=
```

The site calls `/meta/anilist/episodes/{anilistId}` and `/meta/anilist/watch/{episodeId}` on that API. Without it, or when an episode isn't available there, each episode page links to the licensed services AniList lists for the show (Crunchyroll, Netflix and so on), down to the exact episode when AniList has it.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (type-checks and lints) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

See [DESIGN.md](./DESIGN.md) for the design tokens and rules.
