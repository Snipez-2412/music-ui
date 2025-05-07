import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu, Button, Modal, Form, Input, Upload, Select } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import useAlbumStore from "../../zustand/store/AlbumStore";
import useArtistStore from "../../zustand/store/ArtistStore";

const { Option } = Select;
const { Search } = Input;

function ManageAlbums() {
  const { albums, fetchAllAlbums, updateAlbum, deleteAlbum, addAlbum } = useAlbumStore();
  const { artists, fetchAllArtists } = useArtistStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [form] = Form.useForm();
  const [coverFile, setCoverFile] = useState(null);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllAlbums();
    fetchAllArtists();
  }, [fetchAllAlbums, fetchAllArtists]);

  useEffect(() => {
    let filtered = albums;

    // Filter by artist
    if (selectedArtist) {
      filtered = filtered.filter((album) => album.artistID === selectedArtist);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (album) =>
          album.title.toLowerCase().includes(lowerCaseQuery) || // Match album title
          album.artistName.toLowerCase().includes(lowerCaseQuery) // Match artist name
      );
    }

    setFilteredAlbums(filtered);
  }, [albums, selectedArtist, searchQuery]);

  const handleArtistFilterChange = (value) => {
    setSelectedArtist(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this album?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteAlbum(id),
    });
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    form.setFieldsValue(album);
    setCoverFile(null);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingAlbum(null);
    form.resetFields();
    setCoverFile(null);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingAlbum) {
        await updateAlbum({ ...editingAlbum, ...values }, coverFile);
      } else {
        await addAlbum(values, coverFile);
      }
      setIsModalVisible(false);
      setEditingAlbum(null);
    } catch (error) {
      console.error("Failed to save album:", error);
    }
  };

  const handleCoverChange = ({ fileList }) => {
    const file = fileList[0]?.originFileObj;
    console.log("Image file:", file);
    setCoverFile(file);
  };

  const renderMenu = (album) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(album)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => handleDelete(album.albumID)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h1>Manage Albums</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "16px" }}>
        <Search
          placeholder="Search by album or artist"
          allowClear
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </div>

      {/* Artist Filter */}
      <div style={{ marginBottom: "16px" }}>
        <Select
          placeholder="Filter by Artist"
          allowClear
          onChange={handleArtistFilterChange}
          style={{ width: 200 }}
        >
          {artists.map((artist) => (
            <Option key={artist.artistID} value={artist.artistID}>
              {artist.name}
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
        Add Album
      </Button>
      <List
        dataSource={filteredAlbums}
        renderItem={(album) => (
          <List.Item
            actions={[
              <Dropdown overlay={renderMenu(album)} trigger={["click"]}>
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <img
                  src={album.signedCoverUrl}
                  alt={album.title}
                  style={{ width: 50, height: 50, borderRadius: 4 }}
                />
              }
              title={album.title}
              description={`Artist: ${album.artistName}`}
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

      {/* Add/Edit Album Modal */}
      <Modal
        title={editingAlbum ? "Edit Album" : "Add Album"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Album Title"
            rules={[{ required: false, message: "Please enter the album title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="artistID"
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
                <Option key={artist.artistID} value={artist.artistID}>
                  {artist.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Cover Image">
            <Upload
              beforeUpload={() => false}
              onChange={handleCoverChange}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Cover</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageAlbums;