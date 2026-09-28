"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NavLinks = ({
  className,
  onNavigate,
  vertical,
}: {
  className?: string;
  onNavigate?: () => void;
  vertical?: boolean;
}) => {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={className}>
      <ul className={cn("flex gap-1", vertical && "flex-col gap-0")}>
        {mainNav.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                style={{ "--tone": item.tone } as React.CSSProperties}
                className={cn(
                  "flex items-center gap-2.5 rounded-control px-3 text-[0.9375rem] font-medium text-muted transition-colors hover:text-ink",
                  vertical ? "min-h-12 border-b px-1 text-lg" : "min-h-10",
                  active && "text-ink"
                )}
              >
                <span className="heading-key" />
                <span
                  className={cn(
                    active &&
                      "underline decoration-accent decoration-2 underline-offset-[0.45em]"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavLinks;
