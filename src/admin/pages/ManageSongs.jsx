import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu, Button, Modal, Form, Input, Select } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import useSongStore from "../../zustand/store/SongStore";
import useAlbumStore from "../../zustand/store/AlbumStore";
import useArtistStore from "../../zustand/store/ArtistStore";
import { useLyricsStore } from "../../zustand/store/LyricsStore";

const { Option } = Select;
const { Search } = Input;

function ManageSongs() {
  const { songs, fetchAllSongs, updateSong, deleteSong, addSong } = useSongStore();
  const { albums, fetchAllAlbums } = useAlbumStore();
  const { artists, fetchAllArtists } = useArtistStore();
  const { lyrics, loadLyrics, editLyrics, removeLyrics, createLyrics } = useLyricsStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLyricsModalVisible, setIsLyricsModalVisible] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [form] = Form.useForm();
  const [lyricsForm] = Form.useForm();
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [filteredAlbums, setFilteredAlbums] = useState(albums); 
  const [formFilteredAlbums, setFormFilteredAlbums] = useState(albums);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllSongs();
    fetchAllAlbums();
    fetchAllArtists();
  }, [fetchAllSongs, fetchAllAlbums, fetchAllArtists]);

  useEffect(() => {
    if (isLyricsModalVisible) {
      lyricsForm.setFieldsValue({ lyrics: lyrics || "" });
    } else {
      lyricsForm.resetFields();
    }
  }, [isLyricsModalVisible, lyrics, lyricsForm]);

  useEffect(() => {
    let filtered = songs;

    if (selectedArtist) {
      filtered = filtered.filter((song) => song.artistID === selectedArtist);
    }

    if (selectedAlbum) {
      filtered = filtered.filter((song) => song.albumID === selectedAlbum);
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(lowerCaseQuery) ||
          song.artistName.toLowerCase().includes(lowerCaseQuery) ||
          song.albumTitle?.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredSongs(filtered);
  }, [songs, selectedArtist, selectedAlbum, searchQuery]);

  useEffect(() => {
    if (!selectedArtist) {
      setFilteredAlbums(albums);
    }
  }, [albums, selectedArtist]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this song?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteSong(id);
          await fetchAllSongs();
          console.log("Song deleted successfully");
        } catch (error) {
          console.error("Failed to delete song:", error);
        }
      },
    });
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setCoverFile(null);
    setAudioFile(null);
    form.setFieldsValue(song);

    const coverInput = document.querySelector('input[type="file"][accept="image/*"]');
    const audioInput = document.querySelector('input[type="file"][accept="audio/mp3,audio/mpeg"]');
    if (coverInput) coverInput.value = null;
    if (audioInput) audioInput.value = null;

    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingSong(null);
    setCoverFile(null);
    setAudioFile(null);
    form.resetFields();

    // Clear file input elements
    const coverInput = document.querySelector('input[type="file"][accept="image/*"]');
    const audioInput = document.querySelector('input[type="file"][accept="audio/mp3,audio/mpeg"]');
    if (coverInput) coverInput.value = null;
    if (audioInput) audioInput.value = null;

    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);

      if (editingSong) {
        const payload = {
          songID: editingSong.songID,
          ...values,
        };
        console.log("Updating song with payload:", payload);
        await updateSong(payload, coverFile, audioFile);
      } else {
        console.log("Adding new song with values:", values);
        await addSong(values, coverFile, audioFile);
      }

      setIsModalVisible(false);
      setEditingSong(null);
    } catch (error) {
      console.error("Failed to save song:", error);
    }
  };

  const handleManageLyrics = async (song) => {
    setEditingSong(song);
    setIsLyricsModalVisible(true);
    await loadLyrics(song.songID);
  };

  const handleSaveLyrics = async () => {
    try {
      const values = await lyricsForm.validateFields();
      const rawLyrics = values.lyrics;
      console.log("Saving raw lyrics:", rawLyrics);

      if (lyrics) {
        console.log("Updating existing lyrics...");
        await editLyrics(editingSong.songID, rawLyrics);
      } else {
        console.log("Creating new lyrics...");
        await createLyrics(editingSong.songID, rawLyrics);
      }

      setIsLyricsModalVisible(false);
      setEditingSong(null);
    } catch (error) {
      console.error("Failed to save lyrics:", error);
    }
  };

  const handleDeleteLyrics = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete the lyrics?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await removeLyrics(editingSong.songID);
        setIsLyricsModalVisible(false);
        setEditingSong(null);
      },
    });
  };

  const handleArtistFilterChange = (value) => {
    setSelectedArtist(value);

    if (value) {
      const filtered = albums.filter((album) => album.artistID === value);
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(albums);
    }

    setSelectedAlbum(null);
  };

  const handleAlbumFilterChange = (value) => {
    setSelectedAlbum(value);
  };

  const handleFormArtistChange = (value) => {
    form.setFieldsValue({ albumID: null });

    if (value) {
      const filtered = albums.filter((album) => album.artistID === value);
      setFormFilteredAlbums(filtered);
    } else {
      setFormFilteredAlbums(albums);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const renderMenu = (song) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(song)}>
        Edit
      </Menu.Item>
      <Menu.Item key="manage-lyrics" onClick={() => handleManageLyrics(song)}>
        Manage Lyrics
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(song.songID)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h1>Manage Songs</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "16px" }}>
        <Search
          placeholder="Search by song, artist, or album"
          allowClear
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <Select
          placeholder="Filter by Artist"
          allowClear
          onChange={handleArtistFilterChange}
          style={{ width: 200 }}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {artists.map((artist) => (
            <Option key={artist.artistID} value={artist.artistID}>
              {artist.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Filter by Album"
          allowClear
          onChange={handleAlbumFilterChange}
          style={{ width: 200 }}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {filteredAlbums.map((album) => (
            <Option key={album.albumID} value={album.albumID}>
              {album.title}
            </Option>
          ))}
        </Select>
      </div>

      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Song
      </Button>
      <List
        dataSource={filteredSongs}
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
              description={`Artist: ${song.artistName} | Album: ${song.albumTitle || "No Album"}`}
            />
          </List.Item>
        )}
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #f0f0f0",
          padding: "8px",
        }}
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
            name="artistID"
            label="Artist"
            rules={[{ required: true, message: "Please select an artist" }]}
          >
            <Select
              showSearch
              placeholder="Select an artist"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleFormArtistChange}
            >
              {artists.map((artist) => (
                <Option key={artist.artistID} value={artist.artistID}>
                  {artist.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="albumID" label="Assign Album">
            <Select
              showSearch
              placeholder="Select an album"
              optionFilterProp="children"
              allowClear
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value={null}>No Album</Option>
              {formFilteredAlbums.map((album) => (
                <Option key={album.albumID} value={album.albumID}>
                  {album.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* New Genre Field as Input */}
          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: false, message: "Please enter the genre" }]}
          >
            <Input placeholder="Enter the genre" />
          </Form.Item>

          {/* File input for cover image */}
          <Form.Item
            label="Cover Image"
            valuePropName="file"
            extra="Upload an image file"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
          </Form.Item>

          {/* File input for MP3 file */}
          <Form.Item
            label="MP3 File"
            valuePropName="file"
            extra="Upload an audio file"
            rules={[
              {
                required: true,
                message: "Please upload an audio file",
              },
            ]}
          >
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              onChange={(e) => setAudioFile(e.target.files[0])}
              required
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Manage Lyrics Modal */}
      <Modal
        title={`Manage Lyrics for ${editingSong?.title || "Song"}`}
        visible={isLyricsModalVisible}
        onOk={handleSaveLyrics}
        onCancel={() => setIsLyricsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        footer={[
          <Button key="delete" danger onClick={handleDeleteLyrics}>
            Delete Lyrics
          </Button>,
          <Button key="cancel" onClick={() => setIsLyricsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveLyrics}>
            Save
          </Button>,
        ]}
      >
        <Form form={lyricsForm} layout="vertical">
          <Form.Item
            name="lyrics"
            label="Lyrics"
            rules={[{ required: false, message: "Please enter the lyrics" }]}
          >
            <Input.TextArea rows={6} placeholder="Enter song lyrics here" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageSongs;