import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import { AnimeInfo } from "./types";

interface AnimeState {
  currentAnime: any;
  setCurrentAnime: (newAnime: AnimeInfo) => void;
}

export const animeStore = create<AnimeState>()(
  devtools(
    persist(
      (set) => ({
        currentAnime: "",
        setCurrentAnime: (newAnime) => set({ currentAnime: newAnime }),
      }),
      {
        name: "anime-storage",
      }
    )
  )
);