import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { usePlaylistStore } from "../zustand/store/PlaylistStore";
import useSongStore from "../zustand/store/SongStore";
import { useNavigate } from "react-router-dom";

function CreatePlaylistPage() {
  const [form] = Form.useForm();
  const addPlaylist = usePlaylistStore((state) => state.createPlaylist);
  const error = usePlaylistStore((state) => state.error);
  const navigate = useNavigate();
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const songs = useSongStore((state) => state.songs);
  const fetchAllSongs = useSongStore((state) => state.fetchAllSongs);

  useEffect(() => {
    fetchAllSongs();
  }, []);

  const onFinish = async (values) => {
    console.log("Selected image file before submission:", selectedImage);

    const playlist = {
      name: values.name,
      description: values.description,
      songIds: selectedSongs,
    };

    const result = await addPlaylist(playlist, selectedImage);
    if (result) {
      message.success("Playlist created successfully!");
      navigate("/");
    } else {
      message.error("Failed to create playlist.");
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
      <h2 style={{ color: "#fff", marginBottom: 24 }}>Create New Playlist</h2>
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
            beforeUpload={() => false}
            maxCount={1}
            onChange={(info) => {
              console.log("Upload info:", info);
              if (info.file.status === "removed") {
                setSelectedImage(null);
              } else {
                const file = info.file.originFileObj || info.file; 
                setSelectedImage(file); 
                console.log("Selected image file:", file); 
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
            {songs.map((song) => (
              <div
                key={song.songID}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  color: "white",
                }}
              >
                <span>{song.title}</span>
                {selectedSongs.includes(song.songID) ? (
                  <Button
                    type="default"
                    danger
                    onClick={() => handleRemoveSong(song.songID)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => handleAddSong(song.songID)}
                    style={{
                      backgroundColor: "#1db954",
                      borderColor: "#1db954", 
                      color: "white",
                    }}
                  >
                    +
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Playlist
          </Button>
        </Form.Item>
      </Form>
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
    </div>
  );
}

export default CreatePlaylistPage;
