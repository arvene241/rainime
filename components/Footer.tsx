import Link from "next/link";
import { mainNav, siteConfig } from "@/lib/constants";
import Logo from "./Logo";

const Footer = () => (
  <footer className="mt-20 border-t">
    <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
      <div className="max-w-sm">
        <Logo />
        <p className="mt-3 text-sm text-muted">
          A personal project. rainime hosts no video. Show data comes from{" "}
          <a href="https://anilist.co" target="_blank" rel="noreferrer" className="underline hover:text-ink">
            AniList
          </a>
          .
        </p>
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-muted hover:text-ink">
              {item.title}
            </Link>
          </li>
        ))}
        <li>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-ink"
          >
            Source on GitHub
          </a>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;
