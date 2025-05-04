import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Button, Modal } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import "./SongList.css";
import useMusicPlayerStore from "../zustand/store/musicPlayerStore";
import { useLikeStore } from "../zustand/store/LikeStore";
import { useLyricsStore } from "../zustand/store/LyricsStore";

function SongList({ songs, userId }) {
  const { updateSongs, setCurrentSong } = useMusicPlayerStore();
  const { likes, addLike, removeLike } = useLikeStore();
  const { lyrics, loadLyrics } = useLyricsStore();

  const [isLyricsModalVisible, setIsLyricsModalVisible] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState([]);

  useEffect(() => {
    console.log("Songs passed to SongList:", songs); // Debug log
    updateSongs(songs);
  }, [songs, updateSongs]);

  const handleSongClick = (song) => {
    setCurrentSong(song);
  };

  const handleLike = async (songId) => {
    if (likes.includes(songId)) {
      await removeLike(userId, songId);
    } else {
      await addLike(userId, songId);
    }
  };

  const handleViewLyrics = async (songId) => {
    await loadLyrics(songId);
    const rawLyrics = lyrics || "No lyrics available.";
    const formattedLyrics = rawLyrics.replace(/\\n/g, "\n").split("\n"); // Replace \\n with \n and split
    setCurrentLyrics(formattedLyrics);
    console.log("Formatted Lyrics:", formattedLyrics); // Debug log
    setIsLyricsModalVisible(true);
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
        onCancel={() => setIsLyricsModalVisible(false)}
        footer={null}
      >
        {currentLyrics.map((line, index) => (
          <p key={index}>{line}</p> // Render each line as a separate paragraph
        ))}
      </Modal>
    </div>
  );
}

export default SongList;