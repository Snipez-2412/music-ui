import React, { useEffect, useCallback, useMemo } from "react";
import Card from "../main/Card";
import SongList from "../Pages/SongList";
import useHistoryStore from "../zustand/store/HistoryStore";
import { useUserStore } from "../zustand/store/UserStore";

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

  const currentUser = useUserStore((state) => state.currentUser);

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

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Normalize the recentSongs data
  const normalizedSongs = useMemo(() => {
    return recentSongs.map((song) => ({
      id: song.songID,
      title: song.songTitle,
      artistName: song.artistName,
      albumTitle: song.albumTitle,
      signedCoverUrl: song.signedCoverUrl,
      signedFilePath: song.signedFilePath,
    }));
  }, [recentSongs]);

  const songList = useMemo(() => {
    if (normalizedSongs.length === 0) {
      return <p>No recently played songs available.</p>;
    }
    return <SongList songs={normalizedSongs} />; 
  }, [normalizedSongs]);
  console.log("Recent Songs:", recentSongs);
  console.log("Normal:", normalizedSongs);

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
    return <p>Please log in to view your history.</p>;
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
          <div className="album-history">{albumList}</div>

          
        </>
      )}
    </div>
  );
}

export default React.memo(HistoryList);