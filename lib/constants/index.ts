export const siteConfig = {
  name: "rainime",
  url: "https://rainime.vercel.app",
  description:
    "Watch the newest anime episodes, trending shows, and all-time favourites, subbed and dubbed.",
  links: {
    github: "https://github.com/arvene241/rainime",
  },
};

export const mainNav = [
  { title: "New episodes", href: "/recently-updated", tone: "var(--tone-1)" },
  { title: "Trending", href: "/trending", tone: "var(--tone-2)" },
  { title: "Popular", href: "/popular", tone: "var(--tone-3)" },
] as const;

export const designs = [
  {
    id: "lightbox",
    name: "Lightbox",
    blurb: "Animator's light table. Dark graphite, red pencil.",
  },
  {
    id: "onair",
    name: "On Air",
    blurb: "Broadcast programme guide. Deep navy, data-key colours.",
  },
  {
    id: "weekly",
    name: "Weekly",
    blurb: "Manga magazine. Ink lines, coloured newsprint.",
  },
] as const;

export type DesignId = (typeof designs)[number]["id"];

/** Change this to ship a different direction by default. */
export const DEFAULT_DESIGN: DesignId = "lightbox";
