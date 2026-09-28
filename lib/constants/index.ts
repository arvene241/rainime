export const siteConfig = {
  name: "rainime",
  url: "https://rainime.vercel.app",
  description:
    "Find what aired tonight, what's trending and where to watch it. Anime listings powered by AniList.",
  links: {
    github: "https://github.com/arvene241/rainime",
  },
};

export const mainNav = [
  { title: "New episodes", href: "/recently-updated", tone: "var(--tone-1)" },
  { title: "Trending", href: "/trending", tone: "var(--tone-2)" },
  { title: "Popular", href: "/popular", tone: "var(--tone-1)" },
] as const;
