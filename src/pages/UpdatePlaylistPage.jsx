import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../zustand/store/PlaylistStore";

function UpdatePlaylistPage() {
  const { name } = useParams(); // Get playlist name from the URL
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const updatePlaylist = usePlaylistStore((state) => state.updatePlaylist);
  const loadPlaylistByName = usePlaylistStore((state) => state.loadPlaylistByName);
  const selectedPlaylist = usePlaylistStore((state) => state.selectedPlaylist);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch the playlist by name
    if (name) {
      loadPlaylistByName(name);
    }
  }, [name, loadPlaylistByName]);

  useEffect(() => {
    if (selectedPlaylist) {
      form.setFieldsValue({
        name: selectedPlaylist.name,
        description: selectedPlaylist.description,
      });
      setSelectedImage(selectedPlaylist.coverImage);
    }
  }, [selectedPlaylist, form]);

  const onFinish = async (values) => {
    const playlist = {
      name: values.name,
      description: values.description,
    };

    const result = await updatePlaylist(selectedPlaylist.playlistID, playlist, selectedImage);
    if (result) {
      message.success("Playlist updated successfully!");
      navigate(`/playlist/${playlist.name}`);
    } else {
      message.error("Failed to update playlist.");
    }
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
            beforeUpload={() => false}
            maxCount={1}
            onChange={(info) => {
              if (info.file.status === "removed") {
                setSelectedImage(null);
              } else {
                const file = info.file.originFileObj || info.file;
                setSelectedImage(file);
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
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