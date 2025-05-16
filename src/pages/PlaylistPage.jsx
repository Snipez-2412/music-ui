import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown, Button, Menu, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import SongList from "./SongList";
import "./PlaylistPage.css";

import { usePlaylistStore } from "../zustand/store/PlaylistStore";
import { usePlaylistSongStore } from "../zustand/store/PlaylistSongStore";

function PlaylistPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const selectedPlaylist = usePlaylistStore((state) => state.selectedPlaylist);
  const loadPlaylistByName = usePlaylistStore((state) => state.loadPlaylistByName);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
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
  
  useEffect(() => {
    console.log("Playlist songs data:", playlistSongs);
  }, [playlistSongs]);

  if (!selectedPlaylist) {
    return <p>Loading playlist...</p>;
  }

  const handleUpdatePlaylist = () => {
    navigate(`/playlist/update/${selectedPlaylist.name}`);
  };

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(selectedPlaylist.playlistID);
      message.success("Playlist deleted successfully!");
      navigate("/");
    } catch (error) {
      message.error("Failed to delete playlist.");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="update" onClick={handleUpdatePlaylist}>
        Update Playlist
      </Menu.Item>
      <Menu.Item key="delete" onClick={handleDeletePlaylist} danger>
        Delete Playlist
      </Menu.Item>
    </Menu>
  );

  const normalizedSongs = playlistSongs.map((song) => ({
    id: song.songID,
    title: song.title,
    artistName: song.artistName,
    albumTitle: song.albumTitle,
    signedCoverUrl: song.signedCoverUrl,
    signedFilePath: song.signedFilePath,
  }));

  const refreshSongs = () => {
    loadSongsInPlaylist(selectedPlaylist.playlistID); // Reload songs from the backend
  };

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
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            icon={<EllipsisOutlined />}
            shape="circle"
            style={{ marginLeft: "auto" }}
          />
        </Dropdown>
      </div>

      <SongList songs={normalizedSongs} playlistId={selectedPlaylist.playlistID} refreshSongs={refreshSongs} />
    </div>
  );
}

export default PlaylistPage;
