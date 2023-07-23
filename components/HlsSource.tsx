"use client";

import Hls from "hls.js";
import { useEffect, useState } from "react";

const HlsSource = ({ src, video }: any) => {
  const [hls, setHls] = useState<Hls>();

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      setHls(hls);
    }
  }, [src, video]);

  if (!hls) {
    return null;
  }

  return <source src={src} type={"application/x-mpegURL"} />;
};

export default HlsSource;
