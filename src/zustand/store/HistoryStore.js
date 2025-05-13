import { create } from "zustand";
import {
  addToHistory,
  getRecentSongs,
  getRecentAlbums,
  getRecentArtists,
} from "../api/HistoryAPI";

const useHistoryStore = create((set, get) => ({
  recentSongs: [],
  recentAlbums: [],
  recentArtists: [],
  error: null,
  lastFetchTime: null,
  isLoading: false,

  // Add a song to history
  addSongToHistory: async (songId) => {
    try {
      await addToHistory(songId);
      // Only fetch recent songs after adding a new song
      const songs = await getRecentSongs();
      set({ recentSongs: songs });
    } catch (error) {
      console.error("Failed to add song to history:", error);
      set({ error: error.message });
    }
  },

  // Fetch recent songs
  fetchRecentSongs: async (limit = 10) => {
    const { lastFetchTime, isLoading } = get();
    const now = Date.now();
    
    // Don't fetch if we've fetched in the last 30 seconds and we're not loading
    if (lastFetchTime && now - lastFetchTime < 30000 && !isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const songs = await getRecentSongs(limit);
      set({ 
        recentSongs: songs,
        lastFetchTime: now,
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to fetch recent songs:", error);
      set({ 
        error: error.message,
        isLoading: false 
      });
    }
  },

  // Fetch recent albums
  fetchRecentAlbums: async (limit = 10) => {
    const { lastFetchTime, isLoading } = get();
    const now = Date.now();
    
    if (lastFetchTime && now - lastFetchTime < 30000 && !isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const albums = await getRecentAlbums(limit);
      set({ 
        recentAlbums: albums,
        lastFetchTime: now,
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to fetch recent albums:", error);
      set({ 
        error: error.message,
        isLoading: false 
      });
    }
  },

  // Fetch recent artists
  fetchRecentArtists: async (limit = 10) => {
    const { lastFetchTime, isLoading } = get();
    const now = Date.now();
    
    if (lastFetchTime && now - lastFetchTime < 30000 && !isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const artists = await getRecentArtists(limit);
      set({ 
        recentArtists: artists,
        lastFetchTime: now,
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to fetch recent artists:", error);
      set({ 
        error: error.message,
        isLoading: false 
      });
    }
  },
}));

export default useHistoryStore;