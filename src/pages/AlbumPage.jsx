import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAlbumStore from "../zustand/store/albumStore";
import useSongStore from "../zustand/store/SongStore";
import SongList from "./SongList";
import "./AlbumPage.css";

function AlbumPage() {
  const { title } = useParams();
  const [album, setAlbum] = useState(null);

  const fetchAlbumByTitle = useAlbumStore((state) => state.fetchAlbumByTitle);
  const fetchSongsByAlbumId = useSongStore((state) => state.fetchSongsByAlbumId);
  const songs = useSongStore((state) => state.songs);

  useEffect(() => {
    const loadAlbum = async () => {
      const album = await fetchAlbumByTitle(title);
      if (album && album.albumID) {
        setAlbum(album);
        await fetchSongsByAlbumId(album.albumID);
      } else {
        setAlbum(null);
      }
    };
    loadAlbum();
  }, [title, fetchAlbumByTitle, fetchSongsByAlbumId]);

  if (!album) {
    return <p>Loading album...</p>;
  }

  const normalizedSongs = songs.map((song) => ({
    id: song.songID,
    title: song.title,
    artistName: song.artistName,
    albumTitle: song.albumTitle,
    signedCoverUrl: song.signedCoverUrl,
    signedFilePath: song.signedFilePath,
  }));

  return (
    <div className="album-page">
      <div className="album-info">
        <img src={album.signedCoverUrl} alt={album.title} className="album-image" />
        <div className="album-details">
          <h1 className="album-page-title">{album.title}</h1>
          <p className="album-artist">{album.artistName || "Unknown Artist"}</p>
          <p className="album-meta">
            {new Date(album.releaseDate).getFullYear()} • {songs.length} songs
          </p>
        </div>
      </div>

      <SongList songs={normalizedSongs} />
    </div>
  );
}

export default AlbumPage;
