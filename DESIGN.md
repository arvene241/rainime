# Design

Rainime uses one design direction, **Lightbox**: an animator's light table. Episodes are rows on an exposure sheet; shows are cels laid on a lit desk. All tokens live on `:root` in `app/globals.css`; components only read tokens.

## Palette

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(0.17 0.012 255)` | Graphite desk: page ground |
| `--surface`, `--surface-2` | `oklch(0.21 …)`, `oklch(0.255 …)` | Panels, inputs, hover fills |
| `--ink`, `--ink-muted` | `oklch(0.95 …)`, `oklch(0.74 …)` | Text |
| `--line`, `--line-strong` | `oklch(0.31 …)`, `oklch(0.4 …)` | Hairlines, control borders |
| `--accent` | `oklch(0.7 0.18 32)` | Red col-pencil: play actions only |
| `--accent-2` | `oklch(0.76 0.11 240)` | Blue col-pencil: current episode, selection, focus ring |
| `--tone-1`, `--tone-2` | blue / red pencil | Section heading ticks |
| `--scrim` | `oklch(0.12 …)` | Behind text on artwork |

Tailwind maps these to `bg`, `surface`, `surface-2`, `ink`, `muted`, `line`, `line-strong`, `accent`, `accent-2`, `scrim`. Opacity modifiers don't work on them; use `color-mix()`.

## Type

Archivo for everything; JetBrains Mono (`.num`) for episode numbers, dates and counts. Headings use `.display` (800 weight, -0.025em tracking, balanced).

## Shape and motion

3px radii everywhere, 1px hairlines, one soft pop shadow (`--shadow-pop`) for floating panels. The one authored motion is the spotlight cel wipe (clip-path, 320ms ease-out-expo); everything else is 160–260ms state feedback. `prefers-reduced-motion` turns animation off.

## Components

- `.btn` + `.btn-primary | .btn-secondary | .btn-ghost | .btn-icon`: 44px minimum. Primary is reserved for play.
- `.card` / `.card-poster`: 2:3 poster; hover draws a red pencil outline, the image never animates.
- `.badge`, `.chip`, `.sheet-row`, `.skeleton`, `.frame`.
- `Spotlight`, `EpisodeList` (exposure sheet, or number grid when episodes have no titles), `WhereToWatch` (licensed services with their AniList icons), `VideoEmbed` (click-to-load official YouTube/Dailymotion player), `StateMessage` / `ApiDown`.

## Icons

UI icons are `lucide-react`, 16–20px, stroke style. The brand mark is the peg bar in `components/Logo.tsx`; `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` and `public/icon-*.png` are the same mark on a graphite tile.

## Rules

- Accent colours mark actions and current state, never decoration.
- Text on artwork always sits over a scrim.
- Every list has a loading skeleton, an empty message and an API-failure message.
