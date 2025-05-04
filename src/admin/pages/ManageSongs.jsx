import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu, Button, Modal, Form, Input, Select, Upload, message } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import useSongStore from "../../zustand/store/SongStore";
import useAlbumStore from "../../zustand/store/AlbumStore";
import useArtistStore from "../../zustand/store/ArtistStore";
import { useLyricsStore } from "../../zustand/store/LyricsStore"; // Import LyricsStore

const { Option } = Select;

function ManageSongs() {
  const { songs, fetchAllSongs, updateSong, deleteSong, addSong } = useSongStore();
  const { albums, fetchAllAlbums } = useAlbumStore();
  const { artists, fetchAllArtists } = useArtistStore();
  const { lyrics, loadLyrics, createLyrics, editLyrics } = useLyricsStore(); // LyricsStore methods

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLyricsModalVisible, setIsLyricsModalVisible] = useState(false); // Lyrics modal state
  const [editingSong, setEditingSong] = useState(null);
  const [form] = Form.useForm();
  const [lyricsForm] = Form.useForm(); // Form for lyrics
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    fetchAllSongs();
    fetchAllAlbums();
    fetchAllArtists();
  }, [fetchAllSongs, fetchAllAlbums, fetchAllArtists]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this song?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteSong(id),
    });
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    form.setFieldsValue(song);
    setCoverFile(null);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingSong(null);
    form.resetFields();
    setCoverFile(null);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingSong) {
        await updateSong(editingSong.songID, { ...editingSong, ...values }, coverFile);
      } else {
        await addSong(values, coverFile);
      }
      setIsModalVisible(false);
      setEditingSong(null);
    } catch (error) {
      console.error("Failed to save song:", error);
    }
  };

  const handleCoverChange = ({ file }) => {
    setCoverFile(file.originFileObj);
  };

  const handleLyrics = async (song) => {
    setEditingSong(song);
    await loadLyrics(song.songID); // Load lyrics for the selected song
    lyricsForm.setFieldsValue({ content: lyrics || "" }); // Pre-fill lyrics if available
    setIsLyricsModalVisible(true);
  };

  const handleSaveLyrics = async () => {
    try {
      const { content } = await lyricsForm.validateFields();
      if (lyrics) {
        await editLyrics(editingSong.songID, content); // Edit existing lyrics
      } else {
        await createLyrics(editingSong.songID, content); // Add new lyrics
      }
      setIsLyricsModalVisible(false);
      setEditingSong(null);
    } catch (error) {
      console.error("Failed to save lyrics:", error);
    }
  };

  const renderMenu = (song) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(song)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => handleDelete(song.songID)}>
        Delete
      </Menu.Item>
      <Menu.Item key="lyrics" onClick={() => handleLyrics(song)}>
        Manage Lyrics
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h1>Manage Songs</h1>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Song
      </Button>
      <List
        dataSource={songs}
        renderItem={(song) => (
          <List.Item
            actions={[
              <Dropdown overlay={renderMenu(song)} trigger={["click"]}>
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              title={song.title}
              description={`Artist: ${song.artistName}`}
            />
          </List.Item>
        )}
      />

      {/* Add/Edit Song Modal */}
      <Modal
        title={editingSong ? "Edit Song" : "Add Song"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Song Title"
            rules={[{ required: true, message: "Please enter the song title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="artistName"
            label="Artist Name"
            rules={[{ required: true, message: "Please select an artist" }]}
          >
            <Select
              showSearch
              placeholder="Select an artist"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {artists.map((artist) => (
                <Option key={artist.id} value={artist.name}>
                  {artist.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Please enter the duration" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="albumID"
            label="Assign Album"
            rules={[{ required: false }]}
          >
            <Select
              showSearch
              placeholder="Select an album"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value={null}>No Album</Option>
              {albums.map((album) => (
                <Option key={album.albumID} value={album.albumID}>
                  {album.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Cover Image">
            <Upload
              beforeUpload={() => false}
              onChange={handleCoverChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Cover</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit Lyrics Modal */}
      <Modal
        title="Manage Lyrics"
        visible={isLyricsModalVisible}
        onOk={handleSaveLyrics}
        onCancel={() => setIsLyricsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={lyricsForm} layout="vertical">
          <Form.Item
            name="content"
            label="Lyrics"
            rules={[{ required: true, message: "Please enter the lyrics" }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageSongs;