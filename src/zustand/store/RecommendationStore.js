import { create } from "zustand";
import { fetchRecommendationsBySongId, fetchRecommendedAlbumsBySongId } from "../api/RecommendationAPI";

export const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  recommendedAlbums: [],
  error: null,

  fetchRecommendations: async (songId, topK = 5) => {
    set({ loading: true, error: null });
    try {
      console.log(`Fetching recommendations for songId: ${songId}, topK: ${topK}`);
      const data = await fetchRecommendationsBySongId(songId, topK);
      console.log("Raw API response:", data);

      const currentRecommendations = get().recommendations;

      const filteredRecommendations = data.filter(
        (newSong) =>
          !currentRecommendations.some(
            (existingSong) => existingSong.songID === newSong.songID
          )
      );

      const mergedRecommendations = [...currentRecommendations, ...filteredRecommendations];
      console.log("Merged recommendations:", mergedRecommendations);

      set({ recommendations: mergedRecommendations });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchAllRecommendations: async (songIds, topK = 5) => {
    set({ loading: true, error: null });
    try {
      const allRecommendations = [];
      for (const songId of songIds) {
        const data = await fetchRecommendationsBySongId(songId, topK);
        allRecommendations.push(...data);
      }

      const currentRecommendations = get().recommendations;

      const filteredRecommendations = allRecommendations.filter(
        (newSong) =>
          !currentRecommendations.some(
            (existingSong) => existingSong.songID === newSong.songID
          )
      );

      const mergedRecommendations = [...currentRecommendations, ...filteredRecommendations];
      console.log("Final merged recommendations:", mergedRecommendations);

      set({ recommendations: mergedRecommendations });
    } catch (error) {
      console.error("Error fetching all recommendations:", error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchRecommendedAlbums: async (songId, topK = 5) => {
    set({ loading: true, error: null });
    try {
      const albums = await fetchRecommendedAlbumsBySongId(songId, topK);
      const currentAlbums = get().recommendedAlbums;

      const filteredAlbums = albums.filter(
        (newAlbum) =>
          !currentAlbums.some(
            (existingAlbum) => existingAlbum.albumID === newAlbum.albumID
          )
      );

      const mergedAlbums = [...currentAlbums, ...filteredAlbums];
      set({ recommendedAlbums: mergedAlbums, loading: false });
    } catch (error) {
      console.error("Error fetching recommended albums:", error);
      set({ error: error.message, loading: false });
    }
  },
}));