# Design

Rainime ships three switchable design directions on one component structure. Every component reads tokens only; a direction is a token set under `[data-design="…"]` in `app/globals.css`, plus a few scoped overrides. The default lives in `lib/constants/index.ts` (`DEFAULT_DESIGN`). Visitors switch with the palette button in the header, and the choice is kept in `localStorage` (`rainime-design`) by `next-themes`.

## Directions

| | Lightbox (default) | On Air | Weekly |
|---|---|---|---|
| World | An animator's light table and exposure sheet | A broadcast programme guide and its remote | A weekly manga magazine |
| Scheme | Dark: graphite desk | Dark: deep broadcast navy | Light: newsprint white |
| Primary action | Red col-pencil `oklch(0.7 0.18 32)` | Tally yellow `oklch(0.87 0.16 95)` | Magazine red `oklch(0.56 0.21 28)` |
| Current / selected | Blue col-pencil | Data-key blue | Solid ink |
| Section colour | Pencil tick before headings | Remote data-key square (blue, red, green, yellow) | Whole section printed on coloured stock (pink, yellow, mint, blue) |
| Type | Archivo, JetBrains Mono for numerals | Archivo at 72% width, uppercase headings and labels | Dela Gothic One headings, Zen Kaku Gothic New text |
| Shape | 3px radii, 1px hairlines | 10px cards, pill controls | Square corners, 2.5px ink borders |

## Tokens

Colour: `--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-muted`, `--line`, `--line-strong`, `--accent`, `--accent-hover`, `--on-accent`, `--accent-2`, `--on-accent-2`, `--tone-1…4`, `--scrim`.
Type: `--font-ui`, `--font-display`, `--font-num`, `--display-weight`, `--display-stretch`, `--display-case`, `--display-tracking`, `--label-case`, `--label-tracking`.
Shape: `--radius`, `--radius-card`, `--radius-control`, `--bw` (border width), `--shadow-pop`.

Tailwind maps these to `bg`, `surface`, `ink`, `muted`, `line`, `accent`, `accent-2`… and `rounded-card`, `rounded-control`, `font-display`, `font-num`. Tailwind's opacity modifiers do not work on these colours; use `color-mix()` when a translucent tint is needed.

## Components

- `.btn` + `.btn-primary | .btn-secondary | .btn-ghost | .btn-icon`: 44px minimum height. The primary style is reserved for play actions.
- `.card` / `.card-poster`: 2:3 poster with a token outline on hover and focus. Hover never animates the image.
- `.badge`, `.chip`, `.sheet-row` (ruled exposure-sheet row), `.skeleton`, `.display`, `.label`, `.num`.
- `Section`: heading with the direction's key and an optional "See all" link. Pass `tone="var(--tone-n)"`.
- `Spotlight`: trending hero. Choosing a cel in the strip wipes it in with `clip-path` (320ms, ease-out-expo). Reduced motion turns this off.
- `EpisodeList`: an exposure sheet with number, title and air date when titles exist, otherwise a number grid. Shows over 100 episodes are split into ranges, and there is a "jump to episode" field.

## Rules

- Accent colours only mark actions and current state, never decoration.
- Text on artwork always sits over a scrim (dark directions) or a solid panel (Weekly).
- Every list has a loading skeleton, an empty message and an API-failure message (`StateMessage`, `ApiDown`).
- Focus rings use `--accent-2` (Weekly uses `--accent`). Text selection, the caret and scrollbars are themed from tokens.
