import { create } from "zustand";
import { fetchRecommendationsBySongId } from "../api/RecommendationAPI";

export const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  loading: false,
  error: null,

  fetchRecommendations: async (songId, topK = 5) => {
    set({ loading: true, error: null });
    try {
      console.log(`Fetching recommendations for songId: ${songId}, topK: ${topK}`);
      const data = await fetchRecommendationsBySongId(songId, topK);
      console.log("Raw API response:", data);

      const currentRecommendations = get().recommendations;

      console.log("Current recommendations before merging:", currentRecommendations);

      const filteredRecommendations = data.filter(
        (newSong) =>
          !currentRecommendations.some(
            (existingSong) => existingSong.songID === newSong.songID
          )
      );

      console.log("Filtered recommendations (new unique songs):", filteredRecommendations);
      const mergedRecommendations = [...currentRecommendations, ...filteredRecommendations];

      console.log("Merged recommendations:", mergedRecommendations);

      set({ recommendations: mergedRecommendations, loading: false });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      set({ error: error.message, loading: false });
    }
  },
}));