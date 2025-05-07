// zustand/store/LyricsStore.js
import { create } from "zustand";
import {
  fetchLyrics,
  addLyrics,
  updateLyrics,
  deleteLyrics,
} from "../api/LyricsAPI";

export const useLyricsStore = create((set, get) => ({
  lyrics: null,

  loadLyrics: async (songId) => {
    try {
      const data = await fetchLyrics(songId)
      // console.log("Fetched lyrics:", data);
      if (data && data.content) {
        set({ lyrics: data.content });
      } else {
        set({ lyrics: null });
      }
    } catch (error) {
      console.error("Failed to load lyrics:", error);
      set({ lyrics: null });
    }
  },

  createLyrics: async (songId, content) => {
    try {
      const newLyrics = await addLyrics(songId, content);
      set({ lyrics: newLyrics });
    } catch (err) {
      console.error("Failed to create lyrics", err);
    }
  },

  editLyrics: async (songId, newContent) => {
    try {
      const currentLyrics = get().lyrics; // Get the current lyrics from the store
      if (currentLyrics) {
        // If lyrics exist, update them
        const updated = await updateLyrics(songId, newContent);
        console.log("Updated lyrics:", updated);
        set({ lyrics: updated });
      } else {
        // If no lyrics exist, add them
        const added = await addLyrics(songId, { content: newContent });
        console.log("Added lyrics:", added);
        set({ lyrics: added });
      }
    } catch (err) {
      console.error("Failed to update or add lyrics", err);
    }
  },

  removeLyrics: async (songId) => {
    try {
      await deleteLyrics(songId);
      set({ lyrics: null });
    } catch (err) {
      console.error("Failed to delete lyrics", err);
    }
  },
}));
