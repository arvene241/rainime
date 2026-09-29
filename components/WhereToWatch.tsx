import { ExternalLink } from "@/components/icons";
import type { StreamingLink } from "@/lib/types";

/** Licensed services that carry the show, as listed on AniList. */
const WhereToWatch = ({ links, className }: { links: StreamingLink[]; className?: string }) => {
  if (links.length === 0) return null;

  return (
    <ul className={className ?? "flex flex-wrap gap-2"} aria-label="Where to watch">
      {links.map((l) => (
        <li key={l.url}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary min-h-10 px-3 text-sm"
          >
            {l.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.icon}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 rounded-[3px] p-[1px]"
                style={{ background: l.color ?? "transparent" }}
              />
            ) : (
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            )}
            {l.site}
            {l.language && l.language !== "English" && l.language !== "Japanese" && (
              <span className="text-xs text-muted">{l.language}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default WhereToWatch;
