import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu, Button, Modal, Form, Input, Select } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import useArtistStore from "../../zustand/store/ArtistStore";

const { Option } = Select;
const { Search } = Input;

function ManageArtists() {
  const { artists, fetchAllArtists, updateArtist, deleteArtist, addArtist } = useArtistStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [form] = Form.useForm();
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllArtists();
  }, [fetchAllArtists]);

  useEffect(() => {
    let filtered = artists;

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter((artist) => artist.country === selectedCountry);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((artist) =>
        artist.name.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredArtists(filtered);
  }, [artists, selectedCountry, searchQuery]);

  const handleCountryFilterChange = (value) => {
    setSelectedCountry(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this artist?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteArtist(id),
    });
  };

  const handleEdit = (artist) => {
    setEditingArtist(artist);
    form.setFieldsValue(artist);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingArtist(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingArtist) {
        await updateArtist({ ...editingArtist, ...values });
      } else {
        await addArtist(values);
      }
      setIsModalVisible(false);
      setEditingArtist(null);
    } catch (error) {
      console.error("Failed to save artist:", error);
    }
  };

  const renderMenu = (artist) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(artist)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => handleDelete(artist.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h1>Manage Artists</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "16px" }}>
        <Search
          placeholder="Search by artist name"
          allowClear
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </div>

      {/* Country Filter */}
      <div style={{ marginBottom: "16px" }}>
        <Select
          placeholder="Filter by Country"
          allowClear
          onChange={handleCountryFilterChange}
          style={{ width: 200 }}
        >
          {[...new Set(artists.map((artist) => artist.country))].map((country) => (
            <Option key={country} value={country}>
              {country}
            </Option>
          ))}
        </Select>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Artist
      </Button>
      <List
        dataSource={filteredArtists}
        renderItem={(artist) => (
          <List.Item
            actions={[
              <Dropdown overlay={renderMenu(artist)} trigger={["click"]}>
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <img
                  src={artist.signedProfileUrl}
                  alt={artist.name}
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
              }
              title={artist.name}
              description={`Country: ${artist.country}`}
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

      {/* Add/Edit Artist Modal */}
      <Modal
        title={editingArtist ? "Edit Artist" : "Add Artist"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Artist Name"
            rules={[{ required: true, message: "Please enter the artist's name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please enter the artist's country" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageArtists;