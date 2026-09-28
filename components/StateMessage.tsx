import Link from "next/link";
import { cn } from "@/lib/utils";

interface StateMessageProps {
  title: string;
  body?: React.ReactNode;
  action?: { href: string; label: string };
  className?: string;
  children?: React.ReactNode;
}

/** Honest empty / failure state. Says what happened and what to do next. */
const StateMessage = ({ title, body, action, className, children }: StateMessageProps) => (
  <div
    role="status"
    className={cn(
      "frame flex flex-col items-start gap-3 bg-surface px-5 py-6 md:px-6",
      className
    )}
  >
    <p className="font-semibold">{title}</p>
    {body && <div className="max-w-prose text-sm text-muted">{body}</div>}
    {(action || children) && (
      <div className="mt-1 flex flex-wrap gap-2">
        {action && (
          <Link href={action.href} className="btn btn-secondary">
            {action.label}
          </Link>
        )}
        {children}
      </div>
    )}
  </div>
);

export const ApiDown = ({ error }: { error: string }) => (
  <StateMessage
    title="Couldn’t load this list"
    body={
      <>
        {error} The public API this site uses goes offline from time to time; try again in a
        few minutes.
      </>
    }
  />
);

export default StateMessage;
