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
      const data = await fetchLyrics(songId);
      if (data && typeof data === "string") {
        set({ lyrics: data }); // Store raw lyrics as plain text
      } else if (data && data.content) {
        set({ lyrics: data.content }); // Handle cases where the backend wraps lyrics in a "content" field
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
      const newLyrics = await addLyrics(songId, content); // Send raw lyrics
      set({ lyrics: newLyrics }); // Store raw lyrics
    } catch (err) {
      console.error("Failed to create lyrics", err);
    }
  },

  editLyrics: async (songId, newContent) => {
    try {
      const updated = await updateLyrics(songId, newContent); // Send raw lyrics
      console.log("Updated lyrics:", updated);
      set({ lyrics: updated }); // Store raw lyrics
    } catch (err) {
      console.error("Failed to update lyrics", err);
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
