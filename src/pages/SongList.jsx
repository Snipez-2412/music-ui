import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Button, Modal } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import "./SongList.css";
import useMusicPlayerStore from "../zustand/store/musicPlayerStore";
import { useLikeStore } from "../zustand/store/LikeStore";
import { useLyricsStore } from "../zustand/store/LyricsStore";
import { useUserStore } from "../zustand/store/UserStore";

function SongList({ songs, isAlbumPage = false }) {
  const { setCurrentSong } = useMusicPlayerStore();
  const { likes, addLike, removeLike } = useLikeStore();
  const { lyrics, loadLyrics } = useLyricsStore();
  const currentUser = useUserStore((state) => state.currentUser);

  const [isLyricsModalVisible, setIsLyricsModalVisible] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState([]);
  const [sortedSongs, setSortedSongs] = useState([...songs]);
  const [isTitleAscending, setIsTitleAscending] = useState(true);
  const [isAlbumAscending, setIsAlbumAscending] = useState(true);

  useEffect(() => {
    setSortedSongs([...songs]);
  }, [songs]);

  const handleSongClick = (song) => {
    const { updateSongs } = useMusicPlayerStore.getState();
    updateSongs(songs);
    setCurrentSong(song);
  };

  const handleSortByTitle = () => {
    const sorted = [...sortedSongs].sort((a, b) => {
      if (isTitleAscending) {
        return (a.title || a.songTitle).localeCompare(b.title || b.songTitle);
      } else {
        return (b.title || b.songTitle).localeCompare(a.title || a.songTitle);
      }
    });
    setSortedSongs(sorted);
    setIsTitleAscending(!isTitleAscending);
  };

  const handleSortByAlbum = () => {
    const sorted = [...sortedSongs].sort((a, b) => {
      if (isAlbumAscending) {
        return (a.albumTitle || "Unknown Album").localeCompare(b.albumTitle || "Unknown Album");
      } else {
        return (b.albumTitle || "Unknown Album").localeCompare(a.albumTitle || "Unknown Album");
      }
    });
    setSortedSongs(sorted);
    setIsAlbumAscending(!isAlbumAscending);
  };

  const handleLike = async (songId) => {
    if (!currentUser?.userID) {
      console.error("User ID is not available");
      return;
    }

    const isLiked = likes.some((like) => like.songID === songId || like.id === songId);

    try {
      if (isLiked) {
        await removeLike(currentUser.userID, songId);
        console.log("Song unliked:", songId);
      } else {
        await addLike(currentUser.userID, songId);
        console.log("Song liked:", songId);
      }
    } catch (error) {
      console.error("Failed to toggle like status:", error);
    }
  };

  const handleViewLyrics = async (songId) => {
    try {
      await loadLyrics(songId);
      const rawLyrics = lyrics || "No lyrics available.";
      const formattedLyrics = rawLyrics.replace(/\\n/g, "\n").split("\n");
      setCurrentLyrics(formattedLyrics);
      console.log("Formatted Lyrics:", formattedLyrics);
      setIsLyricsModalVisible(true);
    } catch (error) {
      console.error("Failed to load lyrics:", error);
    }
  };

  const handleCloseLyricsModal = () => {
    setIsLyricsModalVisible(false);
    setCurrentLyrics([]);
  };

  const renderMenu = (song) => (
    <Menu>
      <Menu.Item key="like" onClick={() => handleLike(song.id || song.songID)}>
        {likes.some((like) => like.songID === song.songID || like.songID === song.id)
          ? "Unlike"
          : "Like"}
      </Menu.Item>
      <Menu.Item key="lyrics" onClick={() => handleViewLyrics(song.id || song.songID)}>
        View Lyrics
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="song-list">
      <div className="song-list-header">
        <span className="song-index">#</span>
        <span className="song-title" onClick={handleSortByTitle} style={{ cursor: "pointer" }}>
          Title {isTitleAscending ? "▲" : "▼"}
        </span>
        <span className="song-album" onClick={handleSortByAlbum} style={{ cursor: "pointer" }}>
          Album {isAlbumAscending ? "▲" : "▼"}
        </span>
      </div>

      {sortedSongs.map((song, index) => (
        <div key={song.id} className="song-row">
          <span className="song-index">{index + 1}</span>
          <div className="song-details">
            <span className="song-title" onClick={() => handleSongClick(song)}>
              {song.title || song.songTitle}
            </span>
            <span className="song-artist">{song.artistName || "Unknown Artist"}</span>
          </div>
          <span className="song-album">{song.albumTitle || "Unknown Album"}</span>
          <Dropdown overlay={renderMenu(song)} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} className="song-options" />
          </Dropdown>
        </div>
      ))}

      <Modal
        title="Song Lyrics"
        visible={isLyricsModalVisible}
        onCancel={handleCloseLyricsModal}
        footer={null}
      >
        {currentLyrics.length > 0 ? (
          currentLyrics.map((line, index) => <p key={index}>{line}</p>)
        ) : (
          <p>No lyrics available.</p>
        )}
      </Modal>
    </div>
  );
}

export default SongList;