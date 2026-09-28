import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  /** One of the design's tone tokens, e.g. "var(--tone-1)". */
  tone?: string;
  href?: string;
  hrefLabel?: string;
  as?: "h1" | "h2";
  className?: string;
  children: React.ReactNode;
}

const Section = ({
  title,
  tone = "var(--tone-1)",
  href,
  hrefLabel = "See all",
  as: Heading = "h2",
  className,
  children,
}: SectionProps) => (
  <section
    className={cn("section-tone", className)}
    style={{ "--tone": tone } as React.CSSProperties}
    aria-label={title}
  >
    <div className="mb-5 flex items-end justify-between gap-4">
      <Heading className="display flex items-center gap-3 text-2xl md:text-[1.75rem]">
        <span className="heading-key" aria-hidden="true" />
        {title}
      </Heading>
      {href && (
        <Link
          href={href}
          className="group flex min-h-10 flex-none items-center whitespace-nowrap gap-1.5 text-sm font-medium text-muted hover:text-ink"
        >
          {hrefLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
    {children}
  </section>
);

export default Section;
