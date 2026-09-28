"use client";

import { useEffect, useState } from "react";

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

/** Server renders UTC; the browser swaps in the viewer's own time zone. */
const LocalTime = ({ unixSeconds }: { unixSeconds: number }) => {
  const [text, setText] = useState(() => format(unixSeconds, "UTC"));
  useEffect(() => setText(format(unixSeconds)), [unixSeconds]);
  return <time dateTime={new Date(unixSeconds * 1000).toISOString()}>{text}</time>;
};

export default LocalTime;
