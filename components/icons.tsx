import type { SVGProps } from "react";

/*
 * Rainime's own icon set, drawn on a 20px grid to match Lightbox: square
 * caps and mitred joins like a ruled pencil line, 1.75 stroke. Size them
 * with h-/w- classes; colour comes from currentColor. Icons are decorative
 * (aria-hidden) unless given an aria-label.
 */
type IconProps = SVGProps<SVGSVGElement>;

const Icon = ({ children, ...props }: IconProps & { children: React.ReactNode }) => {
  const labelled = props["aria-label"] !== undefined;
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
};

/** Solid, slightly softened triangle: the one play shape used everywhere. */
export const Play = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 3.75 16.25 10 6 16.25Z" fill="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
  </Icon>
);

export const ChevronLeft = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12.5 4.5 7 10l5.5 5.5" />
  </Icon>
);

export const ChevronRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7.5 4.5 13 10l-5.5 5.5" />
  </Icon>
);

export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5" />
  </Icon>
);

/** Arrow leaving an open frame: goes to another site. */
export const ExternalLink = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8.5 4.5h-4v11h11v-4M12 4.5h3.5V8M15 5l-5.5 5.5" />
  </Icon>
);

export const Close = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5.25 5.25 9.5 9.5M14.75 5.25l-9.5 9.5" />
  </Icon>
);

export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="8.75" cy="8.75" r="5" />
    <path d="m12.75 12.75 3.75 3.75" />
  </Icon>
);

/** Two full rules and a short one, like the last row of an exposure sheet. */
export const Menu = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h7" />
  </Icon>
);

/** A ring of film frames; spin it with animate-spin. */
export const Spinner = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="10" cy="10" r="6.5" strokeWidth={2.25} strokeLinecap="butt" strokeDasharray="3.4 1.7" />
  </Icon>
);

export const Alert = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 3.25 17.25 16H2.75Z" />
    <path d="M10 8.25v3.5M10 13.9v.1" />
  </Icon>
);

export const Info = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="13" height="13" rx="3" />
    <path d="M10 9.25v4.25M10 6.6v.1" />
  </Icon>
);

/** A screen showing play: watch on another service. */
export const Screen = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="3.75" width="15" height="10.5" rx="1.5" />
    <path d="M7 17h6" />
    <path d="M8.5 6.75v4.5L12.25 9Z" fill="currentColor" stroke="none" />
  </Icon>
);

/** Exposure sheet: rows of frames, one of them playing. */
export const Episodes = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 5h7M3 10h7M3 15h14" />
    <path d="M13 3v6l4.5-3Z" fill="currentColor" stroke="none" />
  </Icon>
);

/** Punched sheet with a clock hand: when the next episode airs. */
export const Airing = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.75" y="4.25" width="14.5" height="12.5" rx="1.5" />
    <path d="M6.5 2.5v3.25M13.5 2.5v3.25M10 8.75V11.5l2 1.5" />
  </Icon>
);
