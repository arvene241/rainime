"use client";

import { useSyncExternalStore } from "react";

const format = (unixSeconds: number, timeZone?: string) =>
  new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(new Date(unixSeconds * 1000));

const noop = () => () => {};

/** Server renders UTC; the browser swaps in the viewer's own time zone. */
const LocalTime = ({ unixSeconds }: { unixSeconds: number }) => {
  const text = useSyncExternalStore(
    noop,
    () => format(unixSeconds),
    () => format(unixSeconds, "UTC")
  );
  return <time dateTime={new Date(unixSeconds * 1000).toISOString()}>{text}</time>;
};

export default LocalTime;
