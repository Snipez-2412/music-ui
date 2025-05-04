import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown, Button, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import SongList from "./SongList";
import "./PlaylistPage.css";

import { usePlaylistStore } from "../zustand/store/PlaylistStore";
import { usePlaylistSongStore } from "../zustand/store/PlaylistSongStore";

function PlaylistPage() {
  const { name } = useParams();

  const selectedPlaylist = usePlaylistStore((state) => state.selectedPlaylist);
  const loadPlaylistByName = usePlaylistStore((state) => state.loadPlaylistByName);
  const playlistSongs = usePlaylistSongStore((state) => state.playlistSongs);
  const loadSongsInPlaylist = usePlaylistSongStore((state) => state.loadSongsInPlaylist);

  useEffect(() => {
    if (name) {
      loadPlaylistByName(name);
    }
  }, [name, loadPlaylistByName]);

  useEffect(() => {
    if (selectedPlaylist?.playlistID) {
      loadSongsInPlaylist(selectedPlaylist.playlistID);
    }
  }, [selectedPlaylist, loadSongsInPlaylist]);

  if (!selectedPlaylist) {
    return <p>Loading playlist...</p>;
  }

  const normalizedSongs = playlistSongs.map((item) => ({
    id: item.song.id,
    title: item.song.title,
  }));

  return (
    <div className="playlist-page">
      <div className="playlist-page-info">
        <img
          src={selectedPlaylist.signedCoverUrl}
          alt={selectedPlaylist.name}
          className="playlist-page-image"
        />
        <div className="playlist-page-details">
          <h1 className="playlist-page-title">{selectedPlaylist.name}</h1>
          <p className="playlist-page-subtext">{selectedPlaylist.description}</p>
          <p className="playlist-page-meta">{playlistSongs.length} songs</p>
        </div>
      </div>

      <div className="song-list-header">
        <span>#</span>
        <span>Title</span>
      </div>
      <hr className="divider" />

      <SongList songs={normalizedSongs} />
    </div>
  );
}

export default PlaylistPage;
