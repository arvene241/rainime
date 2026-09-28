# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Casual bingers (primary).** Anime fans who arrive knowing roughly what they want: the newest episode of a show that is currently airing. They want to find it and press play fast, mostly in the evening, often on a phone.
- **Portfolio reviewers (secondary).** Recruiters and peers looking at the site as evidence of the author's front-end craft. They judge polish, responsiveness, and attention to detail within a minute or two.

## Product Purpose

Rainime is a free anime streaming front end. It lists recently released episodes, trending and popular shows, lets people search, read a show's details, pick an episode, and watch it in an in-page HLS player. Success means a returning fan gets from the home page to a playing episode in as few steps as possible.

## Positioning

A personal, ad-free front end over public anime metadata and stream APIs (Consumet, AniList data). It is a personal project, not a commercial service.

## Operating Context

- Data comes from a Consumet API instance (`/meta/anilist/*` routes). The base URL is configurable through `CONSUMET_API_URL`; public instances go down often, so every page must degrade gracefully when the API fails.
- Built with Next.js App Router, Tailwind CSS, Radix primitives, hls.js. Deployed on Vercel (`rainime.vercel.app`).

## Capabilities and Constraints

- Routes: home, recently updated, trending, popular, search, anime info, watch.
- No accounts or sign-in exist yet; do not show a sign-in affordance.
- Cover art, titles, and descriptions come from the API; the site owns no imagery of its own.

## Brand Commitments

- The name "rainime" is kept. Everything visual is open.
- The site ships three switchable design directions; one is the default.

## Evidence on Hand

No testimonials, user counts, or statistics exist. Do not invent any.

## Product Principles

1. Play is the primary action: the shortest path to a playing episode wins every layout decision.
2. The artwork is the content. Chrome recedes so cover art carries the page.
3. Failure is normal: API outages, missing episodes, and missing art each get an honest state, never a crash.
4. Craft is visible in the details, because reviewers read the site as a portfolio piece.
