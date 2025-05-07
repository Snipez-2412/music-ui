import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Button, Modal } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import "./SongList.css";
import useMusicPlayerStore from "../zustand/store/musicPlayerStore";
import { useLikeStore } from "../zustand/store/LikeStore";
import { useLyricsStore } from "../zustand/store/LyricsStore";
import { useUserStore } from "../zustand/store/UserStore";

function SongList({ songs }) {
  const { updateSongs, setCurrentSong } = useMusicPlayerStore();
  const { likes, addLike, removeLike } = useLikeStore();
  const { lyrics, loadLyrics } = useLyricsStore();
  const currentUser = useUserStore((state) => state.currentUser);

  const [isLyricsModalVisible, setIsLyricsModalVisible] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState([]);

  useEffect(() => {
    console.log("Songs passed to SongList:", songs);
    updateSongs(songs);
  }, [songs, updateSongs]);

  const handleSongClick = (song) => {
    setCurrentSong(song);
  };

  const handleLike = async (songId) => {
    if (!currentUser?.userID) {
      console.error("User ID is not available");
      return;
    }

    if (likes.includes(songId)) {
      await removeLike(currentUser.userID, songId);
    } else {
      await addLike(currentUser.userID, songId);
    }
  };

  const handleViewLyrics = async (songId) => {
    try {
      await loadLyrics(songId); // Wait for lyrics to load
      const rawLyrics = lyrics || "No lyrics available.";
      const formattedLyrics = rawLyrics.replace(/\\n/g, "\n").split("\n");
      setCurrentLyrics(formattedLyrics);
      console.log("Formatted Lyrics:", formattedLyrics);
      setIsLyricsModalVisible(true); // Open the modal after lyrics are loaded
    } catch (error) {
      console.error("Failed to load lyrics:", error);
    }
  };

  const handleCloseLyricsModal = () => {
    setIsLyricsModalVisible(false);
    setCurrentLyrics([]); // Clear the lyrics when the modal is closed
  };

  const renderMenu = (song) => (
    <Menu>
      <Menu.Item key="like" onClick={() => handleLike(song.id)}>
        {likes.includes(song.id) ? "Unlike" : "Like"}
      </Menu.Item>
      <Menu.Item key="lyrics" onClick={() => handleViewLyrics(song.id)}>
        View Lyrics
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div key={song.id} className="song-row">
          <span className="song-index">{index + 1}</span>
          <span className="song-title" onClick={() => handleSongClick(song)}>
            {song.title}
          </span>
          <Dropdown overlay={renderMenu(song)} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} className="song-options" />
          </Dropdown>
        </div>
      ))}

      {/* Lyrics Modal */}
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