import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSongStore from "../zustand/store/SongStore";
import SongList from "./SongList"
import "./SongPage.css";

function SongPage() {
  const { id } = useParams();
  const [song, setSong] = useState(null);

  const fetchSongById = useSongStore((state) => state.fetchSongById);

  useEffect(() => {
    const loadSong = async () => {
      const songData = await fetchSongById(id);
      setSong(songData);
    };
    loadSong();
  }, [id, fetchSongById]);

  if (!song) {
    return <p>Loading song...</p>;
  }

  return (
    <div className="song-page">
      {/* Song Info Section */}
      <div className="song-page-info">
        <img
          src={song.signedCoverUrl}
          alt={song.title}
          className="song-page-image"
        />
        <div className="song-page-details">
          <h1 className="song-page-title">{song.title}</h1>
          <p className="song-page-artist">
            Artist: {song.artistName || "Unknown Artist"}
          </p>
          <p className="song-page-album">
            Album: {song.albumTitle || "No Album"}
          </p>
        </div>
      </div>

      {/* Song List Section */}
      <div className="song-page-list">
        <SongList songs={[song]} playlistId={null} />
      </div>
    </div>
  );
}

export default SongPage;