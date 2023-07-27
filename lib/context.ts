import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import { AnimeInfo } from "./types";

interface AnimeState {
  currentAnime: any;
  setCurrentAnime: (newAnime: AnimeInfo) => void;
}

interface recentState {
  page: number;
  increase: (by: number) => void;
  decrease: (by: number) => void;
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

export const recentPageStore = create<recentState>()((set) => ({
  page: 1,
  increase: (by) => set((state) => ({ page: state.page + by })),
  decrease: (by) => set((state) => ({ page: state.page - by })),
}));