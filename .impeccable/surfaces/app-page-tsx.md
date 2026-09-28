---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/watch","app/info"]
---

Scope: whole site (home, browse, info, watch). Mode: Operate. Audience: casual bingers on phones in the evening; portfolio reviewers. Task: reach a playing episode fast. Constraint: three switchable design directions, Lightbox default. Roll ran degraded (no challengers).

## Direction contract

THESIS: The site is an animator's light table: episodes are rows on an exposure sheet, shows are cels laid on a lit desk. Refuses the category default of a Netflix-clone carousel of rounded cards on black.

OWN-WORLD: Graphite desk ground, a cool lit-paper surface for sheets, red col-pencil for the one primary action (Play), blue col-pencil for current/selected state. Archivo for UI, JetBrains Mono for frame and episode numerals. Hairline ruled rows, 2px radii, a three-peg registration mark as the logo glyph.

STORY: The visitor sees what is new tonight, picks a show, and presses play in one or two taps; the episode sheet makes long shows scannable.

FIRST VIEWPORT: Home: spotlight of the trending show filling the width, title and synopsis bottom-left, red Play plus Details; a row of five next-up cels beneath switches the spotlight. Primary action is the red Play, above the fold on phone.

FORM: Animation production desk (exposure sheet and light table), position 5 of 7 on the ordered list; seed key 682e5f26. Alternates shipped as switchable presets: On Air (broadcast EPG, pick #1) and Weekly (manga magazine, #3).

Signature interaction: selecting a cel in the spotlight strip swaps the spotlight with a registration slide (short clip-path wipe), 220ms ease-out, disabled under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
