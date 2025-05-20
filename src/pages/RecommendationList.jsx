import React, { useEffect, useMemo } from "react";
import SongList from "./SongList";
import useHistoryStore from "../zustand/store/HistoryStore";
import { useRecommendationStore } from "../zustand/store/RecommendationStore";

function RecommendationList() {
  const { recentSongs } = useHistoryStore();
  const {
    recommendations,
    fetchRecommendations,
    loading,
    error,
  } = useRecommendationStore();

  useEffect(() => {
    const fetchAllRecommendations = async () => {
      for (const song of recentSongs) {
        await fetchRecommendations(song.songID);
      }
    };

    if (recentSongs.length > 0) {
      fetchAllRecommendations();
    }
  }, [recentSongs, fetchRecommendations]);

  const recommendationList = useMemo(() => {
    if (recommendations.length === 0) {
      return <p>No recommendations available.</p>;
    }
    return <SongList songs={recommendations} />;
  }, [recommendations]);

  return (
    <div className="recommendation-list">
      <h2>Based on your history</h2>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : error ? (
        <p>Error fetching recommendations: {error}</p>
      ) : (
        recommendationList
      )}
    </div>
  );
}

export default RecommendationList;