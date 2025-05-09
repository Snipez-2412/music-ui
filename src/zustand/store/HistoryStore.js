import { create } from "zustand";
import {
  addToHistory,
  getRecentSongs,
  getRecentAlbums,
  getRecentArtists,
} from "../api/HistoryAPI";

const useHistoryStore = create((set) => ({
  recentSongs: [],
  recentAlbums: [],
  recentArtists: [],
  error: null,

  // Add a song to history
  addSongToHistory: async (songId) => {
    try {
      await addToHistory(songId);
      console.log("Song added to history:", songId);
    } catch (error) {
      console.error("Failed to add song to history:", error);
      set({ error: error.message });
    }
  },

  // Fetch recent songs
  fetchRecentSongs: async (limit = 10) => {
    try {
      const songs = await getRecentSongs(limit);
      set({ recentSongs: songs });
    } catch (error) {
      console.error("Failed to fetch recent songs:", error);
      set({ error: error.message });
    }
  },

  // Fetch recent albums
  fetchRecentAlbums: async (limit = 10) => {
    try {
      const albums = await getRecentAlbums(limit);
      set({ recentAlbums: albums });
    } catch (error) {
      console.error("Failed to fetch recent albums:", error);
      set({ error: error.message });
    }
  },

  // Fetch recent artists
  fetchRecentArtists: async (limit = 10) => {
    try {
      const artists = await getRecentArtists(limit);
      set({ recentArtists: artists });
    } catch (error) {
      console.error("Failed to fetch recent artists:", error);
      set({ error: error.message });
    }
  },
}));

export default useHistoryStore;