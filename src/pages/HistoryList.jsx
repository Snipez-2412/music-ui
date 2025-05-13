import React, { useEffect, useCallback, useMemo } from "react";
import Card from "../main/Card";
import SongList from "../Pages/SongList";
import useHistoryStore from "../zustand/store/HistoryStore";
import { useUserStore } from "../zustand/store/UserStore"; // Import user store

function HistoryList() {
  const {
    recentSongs,
    recentAlbums,
    recentArtists,
    loading,
    error,
    fetchRecentSongs,
    fetchRecentAlbums,
    fetchRecentArtists,
  } = useHistoryStore();

  const currentUser = useUserStore((state) => state.currentUser); // Get the current user

  // Memoize the fetch functions
  const fetchHistory = useCallback(async () => {
    if (currentUser) {
      console.log("Fetching recent history...");
      await Promise.all([
        fetchRecentSongs(),
        fetchRecentAlbums(),
        fetchRecentArtists(),
      ]);
    }
  }, [currentUser, fetchRecentSongs, fetchRecentAlbums, fetchRecentArtists]);

  // Fetch history only when user changes
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Memoize the song list
  const songList = useMemo(() => {
    if (recentSongs.length === 0) {
      return <p>No recently played songs available.</p>;
    }
    return <SongList songs={recentSongs} />;
  }, [recentSongs]);

  // Memoize the album list
  const albumList = useMemo(() => {
    if (recentAlbums.length === 0) {
      return <p>No recently played albums available.</p>;
    }
    return recentAlbums.map((album) => (
      <Card
        key={album.albumID}
        image={album.signedCoverUrl}
        title={album.albumTitle}
        info={album.artistName || "Unknown Artist"}
        type="album"
      />
    ));
  }, [recentAlbums]);

  // Memoize the artist list
  const artistList = useMemo(() => {
    if (recentArtists.length === 0) {
      return <p>No recently played artists available.</p>;
    }
    return recentArtists.map((artist) => (
      <Card
        key={artist.artistID}
        image={artist.signedCoverUrl}
        title={artist.artistName}
        info="Artist"
        type="artist"
      />
    ));
  }, [recentArtists]);

  if (!currentUser) {
    return <p>Please log in to view your history.</p>; // Render a message if the user is not logged in
  }

  return (
    <div className="history-list">
      {loading ? (
        <p>Loading history...</p>
      ) : error ? (
        <p>Error fetching history: {error}</p>
      ) : (
        <>
          <h2>Recently Played Songs</h2>
          {songList}

          <h2>Recently Played Albums</h2>
          <div className="album-history">
            {albumList}
          </div>

          <h2>Recently Played Artists</h2>
          <div className="artist-history">
            {artistList}
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(HistoryList);