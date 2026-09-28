# rainime

A free, ad-free anime streaming front end built with Next.js (App Router), Tailwind CSS, Radix primitives and hls.js. It lists new episodes, trending and popular shows, and offers search, show pages and an in-page HLS player.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### API

All data comes from a [Consumet](https://github.com/consumet/api.consumet.org) instance (`/meta/anilist/*` routes). Public instances go offline often, so the base URL is configurable:

```bash
# .env.local
CONSUMET_API_URL=https://your-consumet-instance.example.com
```

The default is `https://consumet-mocha.vercel.app`. When the API is down, pages show an explanation instead of crashing.

## Designs

The site ships three switchable design directions: **Lightbox** (default), **On Air** and **Weekly**. Visitors switch with the palette button in the header. To change the default, edit `DEFAULT_DESIGN` in `lib/constants/index.ts`. See [DESIGN.md](./DESIGN.md) for the tokens and rules.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (type-checks and lints) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
