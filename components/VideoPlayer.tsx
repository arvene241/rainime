"use client";

import "node_modules/video-react/dist/video-react.css";
import {
  BigPlayButton,
  ControlBar,
  ForwardControl,
  LoadingSpinner,
  PlayToggle,
  Player,
  ReplayControl,
  VolumeMenuButton,
  PosterImage,
} from "video-react";
import { animeStore } from "@/lib/context";
import { AnimeInfo, Sources, Episodes } from "@/lib/types";
import HlsSource from "./HlsSource";

const VideoPlayer = ({ anime, id }: { anime: Sources[]; id: string }) => {
  const data: AnimeInfo = animeStore((state) => state.currentAnime);

  const isEpisode = (episode: Episodes) => episode.id === id;
  const episodeIndex = data.episodes.findIndex(isEpisode);

  return (
    <div>
      <Player poster={data.episodes[episodeIndex].image} autoPlay={false}>
        <PosterImage poster={data.episodes[episodeIndex].image} />
        <HlsSource isVideoChild src={anime[2].url} />

        <BigPlayButton position="center" />
        <LoadingSpinner />

        <ControlBar>
          <PlayToggle />
          <ReplayControl seconds={5} />
          <ForwardControl seconds={5} />
          <VolumeMenuButton vertical />
        </ControlBar>
      </Player>
    </div>
  );
};

export default VideoPlayer;
