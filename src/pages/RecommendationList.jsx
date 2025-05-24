import React, { useEffect, useMemo } from "react";
import SongList from "./SongList";
import AlbumList from "./AlbumList";
import useHistoryStore from "../zustand/store/HistoryStore";
import { useRecommendationStore } from "../zustand/store/RecommendationStore";
import { useLikeStore } from "../zustand/store/LikeStore";
import { useUserStore } from "../zustand/store/UserStore";

function RecommendationList() {
  const { recentSongs } = useHistoryStore();
  const { likes, fetchLikes } = useLikeStore();
  const { currentUser } = useUserStore();
  const {
    recommendations,
    recommendedAlbums,
    fetchRecommendations,
    fetchRecommendedAlbums,
    loading,
    error,
  } = useRecommendationStore();

  useEffect(() => {
    const fetchAllRecommendations = async () => {
      const songIds = recentSongs.map((song) => song.songID);
      await fetchRecommendations(songIds);
    };

    if (recentSongs.length > 0) {
      fetchAllRecommendations();
    }
  }, [recentSongs, fetchRecommendations]);

  useEffect(() => {
    const fetchUserLikes = async () => {
      if (currentUser?.userID) {
        await fetchLikes(currentUser.userID);
      }
    };

    fetchUserLikes();
  }, [currentUser, fetchLikes]);

  useEffect(() => {
    const fetchAlbumRecommendations = async () => {
      if (likes.length > 0) {
        for (const likedSong of likes) {
          await fetchRecommendedAlbums(likedSong.songID);
        }
      }
    };

    fetchAlbumRecommendations();
  }, [likes, fetchRecommendedAlbums]);

  const recommendationList = useMemo(() => {
    if (recommendations.length === 0) {
      return <p>No recommendations available.</p>;
    }
    return <SongList songs={recommendations} />;
  }, [recommendations]);

  const albumRecommendationList = useMemo(() => {
    if (likes.length === 0) {
      return <p>You have no liked songs. Like some songs to get album recommendations!</p>;
    }

    if (recommendedAlbums.length === 0) {
      return <p>No album recommendations available.</p>;
    }

    return <AlbumList albums={recommendedAlbums} />;
  }, [likes, recommendedAlbums]);

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

      <h2>Albums you might like</h2>
      {loading ? (
        <p>Loading album recommendations...</p>
      ) : error ? (
        <p>Error fetching album recommendations: {error}</p>
      ) : (
        albumRecommendationList
      )}
    </div>
  );
}

export default RecommendationList;