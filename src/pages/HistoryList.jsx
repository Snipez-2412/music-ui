import React, { useEffect } from "react";
import Card from "../main/card";
import SongList from "./SongList";
import useHistoryStore from "../zustand/store/HistoryStore";
import { useUserStore } from "../zustand/store/UserStore"; // Import user store

function HistoryList() {
  const recentSongs = useHistoryStore((state) => state.recentSongs);
  const recentAlbums = useHistoryStore((state) => state.recentAlbums);
  const recentArtists = useHistoryStore((state) => state.recentArtists);
  const loading = useHistoryStore((state) => state.loading);
  const error = useHistoryStore((state) => state.error);
  const fetchRecentSongs = useHistoryStore((state) => state.fetchRecentSongs);
  const fetchRecentAlbums = useHistoryStore((state) => state.fetchRecentAlbums);
  const fetchRecentArtists = useHistoryStore((state) => state.fetchRecentArtists);

  const currentUser = useUserStore((state) => state.currentUser); // Get the current user

  useEffect(() => {
    if (currentUser) {
      console.log("Fetching recent history...");
      fetchRecentSongs();
      fetchRecentAlbums();
      fetchRecentArtists();
    }
  }, [fetchRecentSongs, fetchRecentAlbums, fetchRecentArtists, currentUser]);

  useEffect(() => {
    console.log("Recent Songs:", recentSongs);
    console.log("Recent Albums:", recentAlbums);
    console.log("Recent Artists:", recentArtists);
  }, [recentSongs, recentAlbums, recentArtists]);

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
          {recentSongs.length > 0 ? (
            <SongList songs={recentSongs} />
          ) : (
            <p>No recently played songs available.</p>
          )}

          <h2>Recently Played Albums</h2>
          <div className="album-history">
            {recentAlbums.length > 0 ? (
              recentAlbums.map((album) => (
                <Card
                  key={album.albumID}
                  image={album.signedCoverUrl}
                  title={album.albumTitle}
                  info={album.artistName || "Unknown Artist"}
                  type="album"
                />
              ))
            ) : (
              <p>No recently played albums available.</p>
            )}
          </div>

          <h2>Recently Played Artists</h2>
          <div className="artist-history">
            {recentArtists.length > 0 ? (
              recentArtists.map((artist) => (
                <Card
                  key={artist.artistID}
                  image={artist.signedCoverUrl}
                  title={artist.artistName}
                  info="Artist"
                  type="artist"
                />
              ))
            ) : (
              <p>No recently played artists available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryList;