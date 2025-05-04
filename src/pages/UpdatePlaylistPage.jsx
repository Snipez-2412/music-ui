import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../zustand/store/PlaylistStore";
import { usePlaylistSongStore } from "../zustand/store/PlaylistSongStore";
import useSongStore from "../zustand/store/SongStore"; // Import SongStore for fetching all songs

function UpdatePlaylistPage() {
  const { id } = useParams(); // Get playlist ID from the URL
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const updatePlaylist = usePlaylistStore((state) => state.updatePlaylist);
  const loadPlaylistById = usePlaylistStore((state) => state.loadPlaylistById);
  const selectedPlaylist = usePlaylistStore((state) => state.selectedPlaylist);

  const playlistSongs = usePlaylistSongStore((state) => state.playlistSongs);
  const loadSongsInPlaylist = usePlaylistSongStore((state) => state.loadSongsInPlaylist);

  const allSongs = useSongStore((state) => state.songs); // Fetch all songs
  const fetchAllSongs = useSongStore((state) => state.fetchAllSongs);

  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch the playlist details, its songs, and all songs
    (async () => {
      try {
        await loadPlaylistById(id); // Load the playlist details
        await loadSongsInPlaylist(id); // Load the songs in the playlist
        await fetchAllSongs(); // Fetch all songs
      } catch (error) {
        console.error("Error loading playlist or songs:", error);
      }
    })();
  }, [id, loadPlaylistById, loadSongsInPlaylist, fetchAllSongs]);

  useEffect(() => {
    if (selectedPlaylist) {
      // Pre-fill the form with playlist data
      form.setFieldsValue({
        name: selectedPlaylist.name,
        description: selectedPlaylist.description,
      });
      setSelectedSongs(playlistSongs.map((song) => song.songId)); // Pre-select songs
      setSelectedImage(selectedPlaylist.coverImage); // Pre-select cover image
    }
  }, [selectedPlaylist, playlistSongs, form]);

  const onFinish = async (values) => {
    const playlist = {
      name: values.name,
      description: values.description,
      songIds: selectedSongs,
    };

    const result = await updatePlaylist(id, playlist, selectedImage); // Update the playlist
    if (result) {
      message.success("Playlist updated successfully!");
      navigate(`/playlist/${id}`);
    } else {
      message.error("Failed to update playlist.");
    }
  };

  const handleAddSong = (songID) => {
    if (!selectedSongs.includes(songID)) {
      setSelectedSongs([...selectedSongs, songID]);
    }
  };

  const handleRemoveSong = (songID) => {
    setSelectedSongs(selectedSongs.filter((id) => id !== songID));
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: 24,
        background: "#1e1e1e",
        borderRadius: 12,
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 24 }}>Update Playlist</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ color: "white" }}
      >
        <Form.Item
          label={<span style={{ color: "white" }}>Name</span>}
          name="name"
          rules={[{ required: true, message: "Please enter playlist name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Description</span>}
          name="description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Cover Image</span>}
          name="image"
        >
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            maxCount={1}
            onChange={(info) => {
              if (info.file.status === "removed") {
                setSelectedImage(null); // Handle file removal
              } else {
                const file = info.file.originFileObj || info.file;
                setSelectedImage(file); // Store the selected file
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Select Songs</span>}
          name="songs"
        >
          <div
            style={{
              maxHeight: 200,
              overflowY: "auto",
              padding: "8px",
              border: "1px solid #444",
              borderRadius: 8,
            }}
          >
            {allSongs.map((song) => (
              <div
                key={song.songId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  color: "white",
                }}
              >
                <span>{song.title}</span>
                {selectedSongs.includes(song.songId) ? (
                    <Button
                    type="primary"
                    onClick={() => handleAddSong(song.songId)}
                    style={{
                      backgroundColor: "#1db954", // Spotify green
                      borderColor: "#1db954",
                      color: "white",
                    }}
                  >
                    +
                    </Button>
                ) : (
                  <Button
                    type="default"
                    danger
                    onClick={() => handleRemoveSong(song.songId)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Playlist
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdatePlaylistPage;